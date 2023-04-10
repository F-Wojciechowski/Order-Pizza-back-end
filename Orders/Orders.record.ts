import {newOrder, orderRecord} from "../types/ordersRecords";
import {pool} from "../utils/db";

export class Order implements orderRecord{
    adress: string;
    id: string;
    pizza_id: string;
    user_id: string;
    constructor(obj: newOrder) {
        this.id = obj.id
        this.adress = obj.adress;
        this.pizza_id= obj.pizza_id;
        this.user_id = obj.user_id;
    }
     static async createNew(id, adress, user_id){
        try{
            const response = await pool.execute("INSERT INTO `orders`(`id`, `adress`,`user_id`) VALUES(:id, :adress, :user_id )",
                {id, adress, user_id}
            )
        }catch (err){console.log(err)}
    }
    async insert(){
        try{
            const responseFromDB = await pool.execute("INSERT INTO `orders_pizzas`(`order_Id`, `pizzas_Id`) VALUES(:order_Id, :pizzas_Id )",
                {order_Id: this.id,
                       pizzas_Id: this.pizza_id
                }
             )
        }catch(err){console.log(err)}

    };

    static async getOne(){
        try{
            const [response] = await pool.execute("SELECT name FROM orders_pizzas JOIN `pizzas` ON orders_pizzas.pizzas_Id = pizzas.id WHERE orders_pizzas.order_Id = :id",{id: "2555c900-6f57-48bc-96c9-db1acc7e9c89"})
            console.log(response);
        }catch(err){
            console.log(err);}
    }

}