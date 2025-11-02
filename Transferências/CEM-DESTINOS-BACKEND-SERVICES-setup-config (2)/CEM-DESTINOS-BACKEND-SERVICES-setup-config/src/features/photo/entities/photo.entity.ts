import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileEntity } from "src/features/profile/entities/profile.entity";
import { UserEntity } from "src/imports/user/entities/user.entity";

@Entity('photos')
export class PhotoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    url: string;

    @Column({ default: false })
    isMain: boolean;

    @ManyToOne(() => ProfileEntity, profile => profile.photos, { nullable: true })
    @JoinColumn({ name: 'profile_id' })
    profile: ProfileEntity;

    @ManyToOne(() => UserEntity, user => user.photos, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}