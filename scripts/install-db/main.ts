import { existsSync, readFileSync, createReadStream } from "node:fs";
import { Pool } from "pg";
import { hash } from 'argon2';
import csvParser from 'csv-parser';
import xlsx from 'xlsx';
import { generateSlug } from "../../packages/core/src";

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
    const test: boolean = process.argv.some(x => x == "test");
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
        // Cargar las categorías
        console.log("Test")
        const pathDataCategories = "storage/categories.csv";
        const pathProducts = "storage/productos.xlsx";

        if (existsSync(pathDataCategories)){
            const res = new Promise<any[]>((resolve) => {
                const data: any[] = [];

                const parseNullValues = (value: unknown) => { // Convertir "NULL" y celdas vacías en null 
                    if (value === 'NULL' || value === '') { return null; } return value;
                };

                createReadStream(pathDataCategories)
                .pipe(csvParser())
                .on('data', (row) => { 
                    data.push(Object.fromEntries( Object.entries(row).map(([key, value]) => [key, parseNullValues(value)]) ));
                 })
                .on('end', () => resolve(data))
            });
            sql += "\n\n -- Categoría\n";
            (await res).forEach(item => {
                sql += `INSERT INTO inventory_categories(id, name, slug, parent_id, description) VALUES('${item.id}', '${item.name  }', '${item.slug}', ${item.parent_id ? `'${item.parent_id}'` : 'NULL'}, NULL);\n`
            })
        }

        if (existsSync(pathProducts)){
            const workbook = xlsx.readFile(pathProducts);
            // Obtener el nombre de la primera hoja de cálculo
            const sheetName = workbook.SheetNames[0];

            // Obtener los datos de la primera hoja de cálculo
            const sheet = workbook.Sheets[sheetName];

            // Convertir los datos de la hoja de cálculo a formato JSON
            const data: any[] = xlsx.utils.sheet_to_json(sheet);

            data.forEach(product => {
                sql += `INSERT INTO inventory_items(code, type, name, brand, order_index, slug, price, category_id) VALUES('${product.code}', 'product', '${product.name}', '${product.brand}', ${product.index ?? 0}, '${generateSlug(product.name)}', ${product.price ?? 0}, '${product.category}');\n`
            })

        }

        // console.log(sql);

        // return;
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