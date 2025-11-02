import { CompanyEntity } from "src/features/company/entities/company.entity";
import { PermissionEntity } from "src/features/permission/entities/permission.entity";
import { UserEntity } from "src/imports/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => CompanyEntity, company => company.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: CompanyEntity;

    @ManyToMany(() => PermissionEntity, permission => permission.roles)
    @JoinTable({
        name: 'role_permissions',
        joinColumns: [{ name: 'role_id' }],
        inverseJoinColumns: [{ name: 'permission_id' }]
    })
    permissions: PermissionEntity[];

    @ManyToMany(() => UserEntity, user => user.roles)
    @JoinTable({
        name: 'user_roles',
        joinColumns: [{ name: 'role_id' }],
        inverseJoinColumns: [{ name: 'user_id' }]
    })
    users: UserEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}