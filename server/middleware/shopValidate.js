import express from "express";
import "dotenv/config";
const router = express.Router();

router.use(function(req, res, next){
    if(req.headers && req.headers["x-auth-shop"]){
        req.query.shop = req.headers["x-auth-shop"]; // x-auth-shop
        next();
    }
    else{
        next();
        // return res.sendStatus(401);
    }
});

export default router;