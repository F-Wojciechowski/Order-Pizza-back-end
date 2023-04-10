import {FieldPacket, RowDataPacket} from "mysql2";
export interface CustomRowDataPacket extends RowDataPacket {
    affectedRows?: number;
}

export interface userRecord {
    id: string;
    name: string;
    password: string;
    email: string;
    insert:() =>Promise<string>;
};

export interface newUser extends Omit<userRecord, "id" | "insert">{
    id?: string
}

export type userRecordResult =[userRecord[], FieldPacket[]]