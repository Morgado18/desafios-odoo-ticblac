import { AddressEntity } from "src/features/address/entities/address.entity";
import { ClientEntity } from "src/features/client/entities/client.entity";
import { PhotoEntity } from "src/features/photo/entities/photo.entity";
import { ProfileEntity } from "src/features/profile/entities/profile.entity";
import { RoleEntity } from "src/features/role/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false, unique: true })
    refUuid: string;

    @OneToOne(() => ProfileEntity, profile => profile.user)
    profile: ProfileEntity;

    @OneToMany(() => PhotoEntity, photo => photo.user)
    photos: PhotoEntity[];

    @ManyToMany(() => RoleEntity, role => role.users)
    roles: RoleEntity[];

    @OneToMany(() => ClientEntity, client => client.user)
    clients: ClientEntity[];

    @OneToMany(() => AddressEntity, address => address.user)
    addresses: AddressEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}