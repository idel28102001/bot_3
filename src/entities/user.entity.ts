import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createdAt: Date;
    @Column({nullable: true})
    first_name: string;
    @Column({nullable: true})
    last_name: string;
    @Column({nullable: true})
    username: string;
    @Column({nullable: false})
    telegramId: string;
    @Column()
    stage: number;

    constructor() {
        this.id = 0;
        this.createdAt = new Date();
        this.first_name = undefined as any as string;
        this.last_name = undefined as any as string;
        this.username = undefined as any as string;
        this.telegramId = undefined as any as string;
        this.stage = 1;
    }
}
