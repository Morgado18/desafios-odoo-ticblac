import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RouteSchedule } from '../../route-schedules/entities/route-schedule.entity';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  schedule_id: string;

  @Column({ length: 10, nullable: false })
  seat_number: string;

  @Column({ type: 'boolean', default: false })
  is_occupied: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => RouteSchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: RouteSchedule;
}
