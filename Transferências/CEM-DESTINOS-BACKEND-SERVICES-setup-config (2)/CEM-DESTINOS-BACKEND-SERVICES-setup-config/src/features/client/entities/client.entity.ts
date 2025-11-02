import { CompanyEntity } from "src/features/company/entities/company.entity";
import { ServiceHistoryEntity } from "src/features/service-history/entities/service-history.entity";
import { UserEntity } from "src/imports/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('clients')
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @ManyToOne(() => UserEntity, user => user.clients)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => CompanyEntity, company => company.clients)
    @JoinColumn({ name: 'company_id' })
    companies: CompanyEntity;

    @OneToMany(() => ServiceHistoryEntity, history => history.client)
    histories: ServiceHistoryEntity[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}