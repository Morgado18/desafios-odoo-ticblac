import { Entity, PrimaryGeneratedColumn, Generated, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ServiceEntity } from 'src/features/service/entities/service.entity';

@Entity('coupons')
export class CouponEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ unique: true })
    code: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discount_value: number | null;

    @Column({ type: 'float', nullable: true })
    discount_percentage: number | null;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date | null;

    @Column({ default: true })
    is_active: boolean;

    @OneToMany(() => ServiceEntity, (service) => service.coupons, { cascade: true })
    services: ServiceEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
