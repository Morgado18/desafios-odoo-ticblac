import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Passenger } from '../../passengers/entities/passenger.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { RouteSchedule } from '../../route-schedules/entities/route-schedule.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  passenger_id: string;

  @Column({ type: 'bigint', nullable: false })
  seat_id: string;

  @Column({ type: 'bigint', nullable: false })
  schedule_id: string;

  @Column({ type: 'bigint', nullable: true })
  payment_id: string;

  @Column({ length: 50, default: 'incomplete' })
  status: 'incomplete' | 'pending' | 'approved' | 'rejected' | 'expired';

  @Column({ type: 'timestamp', nullable: true })
  confirmed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Passenger, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'passenger_id' })
  passenger: Passenger;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @ManyToOne(() => RouteSchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: RouteSchedule;

  @ManyToOne(() => Payment, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;
}
