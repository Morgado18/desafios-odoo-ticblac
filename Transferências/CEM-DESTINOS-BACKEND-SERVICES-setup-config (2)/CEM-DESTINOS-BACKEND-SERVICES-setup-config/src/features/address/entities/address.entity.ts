import { UserEntity } from 'src/imports/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('addresses')
export class AddressEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToOne(() => UserEntity, (user) => user.addresses, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}