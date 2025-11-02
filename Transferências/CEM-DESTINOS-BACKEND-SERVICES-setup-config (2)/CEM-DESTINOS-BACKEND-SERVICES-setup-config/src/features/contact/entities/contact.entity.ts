import { CompanyEntity } from "src/features/company/entities/company.entity";
import { ContactTypeEntity } from "src/features/contact-type/entities/contact-type.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "contacts" })
export class ContactEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    value: string;

    @Column({ default: true })
    is_active: boolean;

    @ManyToOne(() => ContactTypeEntity, (type) => type.contacts, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'contact_type_id' })
    type: ContactTypeEntity;

    @ManyToOne(() => CompanyEntity, (company) => company.contacts, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: CompanyEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}