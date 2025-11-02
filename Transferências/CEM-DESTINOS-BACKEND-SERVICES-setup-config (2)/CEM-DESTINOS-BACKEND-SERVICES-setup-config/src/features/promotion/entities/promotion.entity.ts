import { CompanyEntity } from 'src/features/company/entities/company.entity';
import { ServiceEntity } from 'src/features/service/entities/service.entity';
import { Entity, PrimaryGeneratedColumn, Generated, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';

@Entity('promotions')
export class PromotionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'float', nullable: true })
    discount_percentage: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discount_value: number | null;

    @Column({ type: 'timestamp', nullable: true })
    start_date: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date | null;

    @Column({ default: true })
    is_active: boolean;

    @ManyToOne(() => ServiceEntity, (service) => service.promotions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    services: ServiceEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
