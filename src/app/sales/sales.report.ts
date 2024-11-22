import * as dayjs from 'dayjs';
import { Sale } from './sales.entity';
import * as ExcelJS from 'exceljs';

export function getPeriod(startDate: string, endDate: string): [Record<string, any>, string[], Error?] {
   try {
      const start = dayjs(startDate, 'YYYY-MM-DD');
      const end = dayjs(endDate, 'YYYY-MM-DD').add(1, 'day');

      if (!start.isValid() || !end.isValid()) {
         throw new Error('Invalid date format');
      }

      const periods: Record<string, any> = {};
      const dates: string[] = [];

      for (let date = start; date.isBefore(end); date = date.add(1, 'day')) {
         const dateStr = date.format('YYYY-MM-DD');
         periods[dateStr] = {
         date_transaction: dateStr,
         total_sales: 0.0,
         };
         dates.push(dateStr);
      }

      return [periods, dates];
   } catch (err) {
      return [null, null, err];
   }
}

export function reformatSalesReport(sales: Sale[], periods: string[]): any[] {
   const salesDetail: any[] = [];
   const totalPerDate: Record<string, number> = {};
   let total = 0.0;

   for (const sale of sales) {
      const saleDate = dayjs(sale.created_at).format('YYYY-MM-DD');

      for (const detail of sale.details) {
         if (!detail.product) continue;

         const { product_category_id: categoryId, name: productName, product_category } = detail.product;
         const categoryName = product_category.name;
         const productId = detail.product_id;
         const totalSales = detail.price * detail.total_item;

         // Find or create the category map
         let categoryMap = salesDetail.find((c) => c.category_id === categoryId);
         if (!categoryMap) {
         categoryMap = {
            category_id: categoryId,
            category_name: categoryName,
            category_total: 0.0,
            products: [],
         };
         salesDetail.push(categoryMap);
         }

         categoryMap.category_total += totalSales;

         // Find or create the product map within the category
         let productMap = categoryMap.products.find((p) => p.product_id === productId);
         if (!productMap) {
         productMap = {
            product_id: productId,
            product_name: productName,
            transactions: initializePeriod(periods),
            transactions_total: 0.0,
         };
         categoryMap.products.push(productMap);
         }

         productMap.transactions_total += totalSales;

         const transaction = productMap.transactions[saleDate];
         transaction.total_sales += totalSales;

         totalPerDate[saleDate] = (totalPerDate[saleDate] || 0) + totalSales;
         total += totalSales;
      }
   }

   return salesDetail;
}

function initializePeriod(periods: string[]): Record<string, any> {
   const transactions: Record<string, any> = {};
   for (const period of periods) {
      transactions[period] = {
         date_transaction: period,
         total_sales: 0.0,
      };
   }
   return transactions;
}

export async function generateSalesReportExcel(formatedReport: any, dates: string[]) {
   const workbook = new ExcelJS.Workbook();
   const sheet = workbook.addWorksheet('SalesReport');

   sheet.mergeCells('A1:A2');
   sheet.getCell('A1').value = 'Menu';

   // Menggabungkan B1 hingga kolom yang sesuai dengan panjang dates untuk header "Periode"
   const lastColumn = String.fromCharCode(65 + dates.length); // Menghitung kolom terakhir berdasarkan panjang dates (B, C, D, dll.)
   sheet.mergeCells(`B1:${lastColumn}1`);
   sheet.getCell('B1').value = 'Periode';

   // Mengisi tanggal di B2 hingga kolom terakhir sesuai dengan dates
   dates.forEach((date, index) => {
   const column = String.fromCharCode(66 + index); // Kolom B, C, D, dll.
   sheet.getCell(`${column}2`).value = date;
   });

   // Menggabungkan kolom E1 dan E2 untuk header "Total"
   const totalColumn = String.fromCharCode(65 + dates.length + 1); // Kolom setelah D
   sheet.mergeCells(`${totalColumn}1:${totalColumn}2`);
   sheet.getCell(`${totalColumn}1`).value = 'Total';

   // Menyetel lebar kolom
   sheet.getColumn('A').width = 10; // Lebar kolom A (Menu)
   sheet.getColumn('B').width = 20; // Lebar kolom B (Periode)
   sheet.getColumn('E').width = 15; // Lebar kolom E (Total)

   // Untuk kolom yang dihasilkan berdasarkan dates (B, C, D, dll.), setel lebar secara dinamis
   dates.forEach((_, index) => {
   const column = String.fromCharCode(66 + index); // Kolom B, C, D, dll.
   sheet.getColumn(column).width = 15; // Menyesuaikan lebar kolom berdasarkan panjang konten
   });

   // Variabel untuk melacak baris saat ini
   let currentRow = 3;

   // Iterasi melalui kategori di formatedReport
   formatedReport.forEach((category) => {
      // Menggabungkan sel untuk kategori_name (A3:C3, A5:C5, dll.)
      const lastColumn = String.fromCharCode(65 + dates.length); // Menghitung kolom terakhir berdasarkan dates
      sheet.mergeCells(`A${currentRow}:C${currentRow}`);
      sheet.getCell(`A${currentRow}`).value = category.category_name;
   
      // Mengisi total kategori pada kolom D
      const totalCategoryCell = sheet.getCell(`D${currentRow}`);
      totalCategoryCell.value = category.category_total;
      totalCategoryCell.numFmt = 'Rp#,##0'; // Format Rupiah
   
      // Iterasi melalui produk dalam kategori
      category.products.forEach((product) => {
      // Mengisi nama produk di kolom A
      sheet.getCell(`A${currentRow + 1}`).value = product.product_name;
   
      // Mengisi transaksi untuk setiap tanggal
      dates.forEach((date, dateIndex) => {
         const column = String.fromCharCode(66 + dateIndex); // Kolom B, C, D, dll.
         const transaction = product.transactions[date];
         const transactionCell = sheet.getCell(`${column}${currentRow + 1}`);
   
         // Mengisi nilai transaksi dan menerapkan format Rupiah
         transactionCell.value = transaction ? transaction.total_sales : 0;
         transactionCell.numFmt = 'Rp#,##0';
      });
   
      // Menghitung total penjualan untuk produk ini (SUM dari B hingga kolom terakhir di baris ini)
      const totalProductCell = sheet.getCell(`D${currentRow + 1}`);
      totalProductCell.value = {
         formula: `SUM(B${currentRow + 1}:${lastColumn}${currentRow + 1})`,
      };
      totalProductCell.numFmt = 'Rp#,##0'; // Format Rupiah
   
      // Update baris saat ini setelah produk
      currentRow += 1;
      });
   
      // Update baris saat ini setelah kategori
      currentRow += 1;
   });

   // Menambahkan Grand Total pada baris terakhir
   sheet.getCell(`A${currentRow}`).value = 'Grand Total';

   // Menambahkan formula dengan format Rupiah
   ['B', 'C', 'D'].forEach((col) => {
   const grandTotalCell = sheet.getCell(`${col}${currentRow}`);
   grandTotalCell.value = {
      formula: `SUM(${col}3:${col}${currentRow - 1})`, // Menghitung SUM untuk kolom tertentu
   };
   grandTotalCell.numFmt = 'Rp#,##0'; // Format Rupiah
   });

   return workbook;
}
