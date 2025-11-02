import { ClientEntity } from "src/features/client/entities/client.entity";
import { CompanyAddressEntity } from "src/features/company-address/entities/company-address.entity";
import { ContactEntity } from "src/features/contact/entities/contact.entity";
import { RoleEntity } from "src/features/role/entities/role.entity";
import { ServiceEntity } from "src/features/service/entities/service.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('companies')
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    corporate_name: string;

    @Column({ nullable: false })
    brand_name: string;

    @Column({ nullable: true })
    nif: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => ServiceEntity, service => service.company)
    services: ServiceEntity[];

    @OneToMany(() => RoleEntity, role => role.company)
    roles: RoleEntity[];

    @OneToMany(() => ClientEntity, client => client.companies)
    clients: ClientEntity[];

    @OneToMany(() => CompanyAddressEntity, address => address.company)
    addresses: CompanyAddressEntity[];

    @OneToMany(() => ContactEntity, contact => contact.company)
    contacts: ContactEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}