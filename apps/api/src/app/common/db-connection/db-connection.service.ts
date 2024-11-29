import { Injectable } from '@nestjs/common';
import { PostgreSQlConnection } from './postgres/postgres';

@Injectable()
export class DbConnectionService extends PostgreSQlConnection {
    public static instance: DbConnectionService;
    constructor(){
        super({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : undefined
        });
        DbConnectionService.instance = this;
    }
}