import { ServiceEntity } from "src/features/service/entities/service.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('available_services')
export class AvailableServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => ServiceEntity, service => service.availableService)
    services: ServiceEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}