import {FieldPacket} from "mysql2";

export type orderRecord = {
    id: string;
    pizza_id: string;
    adress: string;
    user_id:string
}

export type simpleOrderRecord={
    adress:string;
    name:string;
    price: number;
    username:string;
}
export type simpleOrderRecordList ={
    id: string
}

export interface newOrder extends Omit<orderRecord, 'id'>{
    id?
}

export type orderResult =[simpleOrderRecord[], FieldPacket[]];
export type orederListResult = [simpleOrderRecordList[], FieldPacket[]];