import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../users/users.entity";

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => User, user => user.customer)
  @JoinColumn({ name: 'user_id' })
  user: User; // definisi relasi dengan User

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phonenumber: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  photo: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @BeforeInsert()
  private generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
