import express, { query } from 'express';
import api_middleware from '../middleware/api.js';import { DataType } from '@shopify/shopify-api';
import "dotenv/config";
import { GraphqlApi } from '../helpers/Helper.js';
//import controllers here
const api = express.Router(); 
api.use("/api/*",api_middleware);
import { AdminApi } from '../helpers/Helper.js';
const PORT = parseInt(process.env.PORT || "3822", 10);

api.get("/api/test", (req, res) => {
    return res.send("Test api working...");
});


export default api;