import {Request} from "express";
//Settings for passport-JS
export const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['JWT'];//Must be same as is in signing cookie
    }
    return token;
}

export const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: "hasło" //Must be same as in signing cookie
}