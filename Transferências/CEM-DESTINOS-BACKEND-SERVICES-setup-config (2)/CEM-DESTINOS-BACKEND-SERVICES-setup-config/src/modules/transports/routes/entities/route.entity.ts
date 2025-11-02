import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  company_id: string;

  @Column({ type: 'bigint', nullable: false })
  departure_id: string;

  @Column({ type: 'bigint', nullable: false })
  arrival_id: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  duration_minutes: number;

  @Column({ type: 'int', nullable: false })
  seats_total: number;

  @Column({ type: 'int', nullable: false })
  seats_available: number;

  @Column({ length: 50, nullable: true })
  seat_pattern: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'departure_id' })
  departure: Location;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'arrival_id' })
  arrival: Location;
}
