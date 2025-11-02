import { AvailableServiceEntity } from "src/features/available-service/entities/available-service.entity";
import { CompanyEntity } from "src/features/company/entities/company.entity";
import { CouponEntity } from "src/features/coupon/entities/coupon.entity";
import { PromotionEntity } from "src/features/promotion/entities/promotion.entity";
import { ServiceHistoryEntity } from "src/features/service-history/entities/service-history.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('services')
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    price: number;

    @ManyToOne(() => CompanyEntity, company => company.services, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: CompanyEntity;

    @ManyToOne(() => AvailableServiceEntity, available => available.services, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'available_service_id' })
    availableService: AvailableServiceEntity;

    @ManyToMany(() => CouponEntity, coupon => coupon.services)
    coupons: CouponEntity[];

    @ManyToMany(() => PromotionEntity, promotion => promotion.services)
    promotions: PromotionEntity[];

    @OneToMany(() => ServiceHistoryEntity, history => history.service)
    histories: ServiceHistoryEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}