import { PhotoEntity } from "src/features/photo/entities/photo.entity";
import { UserEntity } from "src/imports/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('profiles')
export class ProfileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: true })
    bio: string;

    @OneToOne(() => UserEntity, user => user.profile)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @OneToMany(() => PhotoEntity, photo => photo.profile)
    photos: PhotoEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}