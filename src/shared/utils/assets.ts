import * as fs from 'fs';
import * as path from 'path';

export async function writeFile(fileBase64: string, filepath: string, fileName: string): Promise<void> {
    const base64Data = fileBase64.split(',')[1];
    
    if (!base64Data) {
        throw new Error('Invalid base64 format');
    }

    const fileBuffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join('./src/assets', filepath, fileName);

    return new Promise((resolve, reject) => {
        const directory = path.dirname(filePath);
        // buat direktori jika tidak ada
        fs.mkdir(directory, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }

            // write the file
            const fileStream = fs.createWriteStream(filePath);
            fileStream.on('error', reject);
            fileStream.on('finish', resolve);
            fileStream.write(fileBuffer);
            fileStream.end();
        });
    });
}
