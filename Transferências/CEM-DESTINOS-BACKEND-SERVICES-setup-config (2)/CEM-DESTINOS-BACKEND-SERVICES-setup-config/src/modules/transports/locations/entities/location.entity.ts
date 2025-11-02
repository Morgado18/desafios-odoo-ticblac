import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: false })
  latitude: number;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: false })
  longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
