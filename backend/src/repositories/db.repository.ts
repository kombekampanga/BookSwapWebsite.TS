import mysql, {Pool, RowDataPacket} from "mysql2";

export class DbRepository {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: process.env.SQL_PASS || '',
            database: 'bookswap',
        });
    }

    // Execute a query
    executeQuery = async <T>(query: string): Promise<T[]> => {
        console.log("db.repository called")

        return new Promise<T[]>((resolve, reject) => {
            this.pool.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result as T[]);
                }
            });
        });
    }

    executeQueryWithParameter = async <T>(query: string, userId: string): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            this.pool.query(query, userId, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result)
                    resolve(result as T[]);
                }
            })
        })
    }

    executeQueryWithParameters = async <T>(query: string, values: (string | boolean | number)[]): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            this.pool.query(query, values, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result)
                    resolve(result as T[]);
                }
            })
        })
    }
}