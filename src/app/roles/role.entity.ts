import { User } from 'src/app/users/users.entity';
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'roles' })
export class Roles {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text' })
  access: string;

  @Column({ type: 'varchar', nullable: true })
  created_by: string;

  @Column({ type: 'varchar', nullable: true })
  updated_by: string;

  @Column({ type: 'varchar', nullable: true })
  deleted_by: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @OneToMany(() => User, user => user.role_id)
  users: User[];

  @BeforeInsert()
  private generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
