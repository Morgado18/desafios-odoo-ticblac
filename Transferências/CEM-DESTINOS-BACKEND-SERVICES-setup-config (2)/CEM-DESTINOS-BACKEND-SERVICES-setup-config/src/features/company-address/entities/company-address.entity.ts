import { CompanyEntity } from 'src/features/company/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Generated } from 'typeorm';

@Entity('company_addresses')
export class CompanyAddressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    street: string;

    @Column({ nullable: true })
    number: string;

    @Column({ nullable: true })
    complement: string;

    @Column({ nullable: false })
    city: string;

    @Column({ nullable: false })
    state: string;

    @Column({ nullable: false })
    country: string;

    @Column({ nullable: true })
    postal_code: string;

    @Column({ nullable: true })
    latitude: string;

    @Column({ nullable: true })
    longitude: string;

    @Column({ default: false })
    is_primary: boolean;

    @ManyToOne(() => CompanyEntity, (company) => company.addresses, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: CompanyEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}