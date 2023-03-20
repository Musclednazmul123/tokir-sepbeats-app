import express from "express";
import "dotenv/config";
const router = express.Router();

router.use(function(req, res, next){
    if(req.headers && req.headers["x-auth-shop"]){
        req.query.shop = req.headers["x-auth-shop"]; // x-auth-shop
    }
    if(req.headers && req.headers["x-auth-password"] && req.headers["x-auth-password"] == process.env.API_PASSWORD){
        next();
    }
    else{
        next();
        // return res.sendStatus(401);
    }
});

export default router;