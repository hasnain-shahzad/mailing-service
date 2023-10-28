import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { EnMailStatus } from './common/mail.enums';

@Entity({
    name: 'mails',
})
export class Mail {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: EnMailStatus,
        default: EnMailStatus.PENDING
    })
    status: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    fromDto(name: string, email: string): Mail {
        this.name = name;
        this.email = email;
        return this;
    }
}
