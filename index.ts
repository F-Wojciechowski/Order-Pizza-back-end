import express, {json} from "express";
import cors from 'cors';
import "express-async-errors";
import {handleError} from "./utils/errors";
import {options} from "./utils/passport";
import passport, {use} from 'passport';
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import {User} from "./Users/Users.records";
import {Strategy as JwtStrategy} from "passport-jwt";
import {Order} from "./Orders/Orders.record";
import {v4 as uuid} from "uuid"
import bcrypt from "bcrypt";
import {pool} from "./utils/db";

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
//Middlewares
app.use(cookieParser()); //cookie-parser for send and receive cookies from user
app.use(json());
//// Passport initialization for authorization and authentication. In this case JWT local strategy
passport.use(new JwtStrategy(options, function (jwt_payload: string, done) {
    return done(null, jwt_payload)
}))
app.use(passport.initialize());


app.post('/', async (req, res) => {

});
app.post('/login', async (req, res) => {
    const [userID, userName] = await User.logIn(req.body.email, req.body.password);
    if (userID) {
        const token = jwt.sign(userID, "hasło"); //Must be the same as in passport config
        res.cookie("JWT", token, {httpOnly: true});
        res.json({
            isLogIn: true,
            id: userID,
            name: userName
        });
        return
    } else {
        console.log("błąd logowania")
        res.json({
            isLogIn: false,
            id: null,
            name: null
        })
    }

})


app.post('/order',
    passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        const orderID = uuid();
        const userId = jwt.verify(req.cookies.JWT, "hasło") as string
        const {pizzas} = req.body;
        console.log(pizzas)
        const pizzasArray = [...pizzas]
        const adress = req.body.adress;
        await Order.createNew(orderID, adress, userId);
        pizzasArray.map(pizza => {
                const newOrder = new Order({id: orderID, pizza_id: pizza, user_id: userId, adress});
                newOrder.insert()
            }
        )
        res.json(orderID);

    })
app.post('/register', async (req, res) => {
    const id = uuid();
    const {email, name, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email, name, password: hashedPassword, id
    });
    const result = await newUser.insert();
    if (result == "ok") {
        res.json({usserRegisterd: true})
    } else if (result == "Error") {
        res.json({usserRegisterd: false})
    }
})
//Rout for checking is user JWT is valid
app.get('/check', async (req, res) => {
    if (req.cookies.JWT) {
        let decode;
        try {
            decode = await jwt.verify(req.cookies.JWT, "hasło");
        } catch (err) {
            console.log(err);
        }
        ;
        if (decode) {
            const {name} = await User.getOne(decode);
            res.json({isLogIn: true, name})
        } else {
            res.json({isLogIn: false})
        }
    } else {
        res.json({isLogIn: false})
    }

})
app.get('/pizzas', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    const [response] = await pool.execute("SELECT * from `pizzas`");
    res.send(JSON.stringify(response))

})

app.get('/orders', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    let userId;
    try {
        userId = jwt.verify(req.cookies.JWT, "hasło");
    } catch {
        res.json({msq: "Error"})
    }
    const newUser = await User.getOne(userId);
    const ordersList = await newUser.getOrdersList()
    res.json(ordersList);
})
app.get('/orders/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    console.log(req.params.id);
    let userId;
    try {
        userId = jwt.verify(req.cookies.JWT, "hasło");
    } catch {
        res.json({msq: "Error"})
    }
    const newUser = await User.getOne(userId);
    const orders = await newUser.getOneOrder(req.params.id)
    console.log(orders)
    res.json(orders)
})
app.post('/logout', async (req, res) => {
    res.cookie("JWT", '', {httpOnly: true});
    res.json({logout: true})
})

app.use(handleError);


app.listen(3001, '0.0.0.0', () => {
    console.log("http://localhost:3001")
})


