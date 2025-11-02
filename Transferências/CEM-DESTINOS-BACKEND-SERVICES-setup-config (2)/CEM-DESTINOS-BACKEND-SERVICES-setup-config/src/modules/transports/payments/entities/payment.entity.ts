import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ nullable: true })
  company_service_type: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: false })
  amount: number;

  @Column({ length: 50, nullable: true })
  payment_method: string;

  @Column({ type: 'timestamp', nullable: true })
  payment_date: Date;

  @Column({ nullable: true })
  file_url: string;

  @Column({ length: 100, nullable: true })
  reference_code: string;

  @Column({ length: 50, default: 'completed' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
