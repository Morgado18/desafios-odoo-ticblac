import { ClientEntity } from 'src/features/client/entities/client.entity';
import { ServiceEntity } from 'src/features/service/entities/service.entity';
import { Entity, PrimaryGeneratedColumn, Generated, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import type { ServiceProgressTypes } from '../enums/service-progress.types';

@Entity('service_histories')
export class ServiceHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @ManyToOne(() => ClientEntity, (client) => client.histories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;

    @ManyToOne(() => ServiceEntity, (service) => service.histories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;

    @Column({ nullable: false, default: 'PENDING' })
    status: ServiceProgressTypes;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}