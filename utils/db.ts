import {createPool} from "mysql2/promise";
//Database configuration
export const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'login_app',
    namedPlaceholders: true
})