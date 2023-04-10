import {CustomRowDataPacket, newUser, userRecord, userRecordResult} from "../types/userRecord";
import { ValidationError } from "../utils/errors";
import passport from "passport";
import { pool } from "../utils/db";
import {
    orderRecord,
    orderResult,
    orederListResult,
    simpleOrderRecord,
    simpleOrderRecordList
} from "../types/ordersRecords";
import bcrypt from "bcrypt";


export class User implements userRecord{
    name: string
    email: string;
    id: string;
    password: string;

    constructor(obj: newUser) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa użytkownika nie może być pusta, ani przekraczać 100 znaków.');
        };
        if (!obj.password || obj.password.length > 100) {
            throw new ValidationError('hasło użytkownika nie może być pusta, ani przekraczać 100 znaków.');
        }
        this.id = obj.id;
        this.email = obj.email;
        this.password = obj.password;
        this.name = obj.name;
    }

    static async getOne(id: string): Promise<User | null> {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        }) as userRecordResult;

        return results.length === 0 ? null : new User(results[0]);
    }

    static async logIn(email, password): Promise<string| null[] | null>{
        const [response] = await pool.execute("SELECT * from `users` WHERE `email` = :email",{
            email
        });
        console.log(response)
        if(Array.isArray(response)){
            if(response.length == 0){
                return [null, null]
            }
        }

        const resoldeOfComapre = await bcrypt.compare(password, response[0].password);
        if(resoldeOfComapre){
            return [response[0].id, response[0].name]
        }else return [null, null]
    }

    async getOrders():Promise<simpleOrderRecord[]>{
        const [response] = await pool.execute("SELECT users.name as userName, adress,orders.id, pizzas.name   FROM `orders`JOIN `users` ON orders.user_id = users.id JOIN `orders_pizzas` ON orders_pizzas.order_Id = orders.id JOIN `pizzas` ON pizzas.id = orders_pizzas.pizzas_Id  WHERE users.id = :id", {
            id: this.id
        }) as orderResult
        return response
    }

    async getOrdersList():Promise<simpleOrderRecordList[]>{
        const [response] = await pool.execute("SELECT id FROM `orders` WHERE user_id = :id", {
            id: this.id
        }) as orederListResult
        return response
    }
    async summaryOrders(): Promise<number>{
        const orders = await this.getOrders();
        const summary = orders.reduce((acc, cur)=>acc + Number(cur.price),0)
        return summary
    }
    async insert(): Promise<string>{
        const result = await pool.execute("INSERT INTO `users`(`id`,`name`, `password`, `email`) VALUES(:id,:name, :password, :email)",this) as CustomRowDataPacket
        if(result[0].affectedRows ==1){
            return "ok"
        }
        else{
            return "Error"
        }
    }
async getOneOrder(orderId){
    const [response] = await pool.execute("SELECT users.name as userName, adress,orders.id, pizzas.name   FROM `orders`JOIN `users` ON orders.user_id = users.id JOIN `orders_pizzas` ON orders_pizzas.order_Id = orders.id JOIN `pizzas` ON pizzas.id = orders_pizzas.pizzas_Id  WHERE users.id = :id AND orders.id = :orderId", {
        id: this.id,
        orderId
    }) as orderResult
    return response
}


}