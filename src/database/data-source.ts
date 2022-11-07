import "reflect-metadata"
import {DataSource} from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "herf12ktn",
    database: "bot_3",
    logging: false,
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../**/**/*-migration{.ts,.js}'],
    synchronize: false,
})
