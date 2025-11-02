import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Route } from '../../routes/entities/route.entity';

@Entity('route_schedules')
export class RouteSchedule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  route_id: string;

  @Column({ type: 'date', nullable: false })
  departure_date: string;

  @Column({ type: 'time', nullable: false })
  departure_time: string;

  @Column({ length: 50, default: 'scheduled' })
  status: 'scheduled' | 'departed' | 'completed' | 'canceled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Route, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: Route;
}
