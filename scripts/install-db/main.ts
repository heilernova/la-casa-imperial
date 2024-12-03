import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { hash } from 'argon2';


const generateSQLInsert = (table: string, object: { [key: string]: string | number }) => {
    const fields = Object.keys(object).join(", ");
    const values = Object.values(object).map(x => {
        if (typeof x == "string") {
            return `'${x}'`;
        } else {
            return x;
        }
    }).join(", ");
    return `INSERT INTO ${table}(${fields}) VALUES(${values});`;
}

async function main() {
    const test: boolean = process.argv.some(x => x == "--test");
    const baseSQL: string = readFileSync("database/structure.postgres.sql").toString();
    let sql = baseSQL;

    const defaultUser = {
        role: "admin",
        username: "admin",
        email: "admin@admin.com",
        name: "Heiler",
        last_name: "Nova",
        sex: "M",
        cellphone: "+57 320 971 6145",
        pin: await hash("1234"),
        password: await hash("admin")
    }

    sql += "-- Usuario por defecto\n" + generateSQLInsert("users", defaultUser);

    process.loadEnvFile('.env');
    const pool = new Pool({
        host: process.env['DB_HOSTNAME'],
        user: process.env['DB_USERNAME'],
        database: process.env['DB_DATABASE'],
        password: process.env['DB_PASSWORD'],
        port: parseInt(process.env['DB_PORT'] ?? '0')
    });


    if (test){
        sql += "";
    }


    try {
        await pool.query(sql);
        console.log("La base de datos se ha instalado correctamente.");
    } catch(err) {
        console.log("Error con la inhalación de la base de datos.");
        console.log(err);
    }
}

main();