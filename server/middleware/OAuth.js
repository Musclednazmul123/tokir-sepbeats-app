import express from 'express';
import querystring from "query-string";
import crypto from "crypto";
import request from 'request-promise';
import Shops from "../controllers/Shops.js";
import "dotenv/config";
import ShopModel from '../models/ShopModel.js';
import EventsHelper from '../helpers/EventsHelper.js';
const OAuth = express.Router();

OAuth.get("/oauth/init", function(req, res) {
    const shop = req.query.shop;
    console.log("req.query:", req.query.shop, typeof req.query.shop);
    if (shop) {
        console.log("req.query 1");
        ShopModel.getByShop(shop, function(error, shopData){
            console.log("req.query here 1");
            if (shopData && (shopData.access_token && shopData.status === "active")) {
                console.log("req.query here 1 active");
                const redirect_to_app = `https://${shop}/admin/apps/${process.env.APP_HANDLE}/${process.env.AFTER_AUTH_REDIRECT}?ref=loaded&shop=${shop}`;
                if (req.query.embedded === "none") {
                    return res.send(redirect_to_app);
                }
                return res.redirect(redirect_to_app);
            }
            else{
                console.log("req.query here 1 active elese");
                let redirect_uri = `${process.env.HOST}/oauth/callback`;
                var oauth_url = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SCOPES}&redirect_uri=${redirect_uri}`;
                console.log("oauth_url", oauth_url);
                if (req.query.embedded === "none") {
                    return res.send(oauth_url);
                }
                return res.redirect(oauth_url);
            }
        });
    }
    else{
        console.log("req.query 2");
        if (req.query.embedded === "none") {
            return res.send({error: "shop not available"});
        }
        return res.send(`Shop parameter is missing. Add ?shop={shop_name}.myshopify.com`);
    }
});

OAuth.get("/oauth/start", (req, res) => {
    let redirect_uri = `${process.env.HOST}/oauth/callback`;
    var oauth_url = `https://${req.query.shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SCOPES}&redirect_uri=${redirect_uri}`;
    if (req.query.shop) {
        if (req.query.embedded === "none") {
            return res.send(oauth_url);
        }
        return res.redirect(oauth_url);
    }
    else{
        return res.send(`Shop parameter is missing. Add ?shop={shop_name}.myshopify.com`)
    }
});

OAuth.get("/oauth/callback", (req, res) => {
    const {
        shop,
        hmac,
        code
    } = req.query;
    if(shop && hmac && code){
        // const redirect_to_app = `${process.env.HOST}/auth/toplevel?shop=${shop}`;
        const redirect_to_app = `https://${shop}/admin/apps/${process.env.APP_HANDLE}/${process.env.AFTER_AUTH_REDIRECT}?ref=afauth&shop=${shop}`;
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };
        if (!hashEquals) {
            return res.status(401).send('HMAC validation failed');
        }
        // DONE: Exchange temporary code for a permanent access token
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: process.env.SHOPIFY_API_KEY,
            client_secret: process.env.SHOPIFY_API_SECRET,
            code,
        };
        request.post(accessTokenRequestUrl, {
            json: accessTokenPayload
        }).then(response => {
            const { scope, access_token } = response;
            EventsHelper.emit("app/installation", {shop:shop, access_token: access_token, scope: scope});
            // Shops.OAuthCallBack(shop, access_token, scope);
            return res.redirect(redirect_to_app);
        }).catch(error => {
            return res.redirect(redirect_to_app);
        });
    }
    else{
        return res.status(400).send('Required parameters missing');
    }
});

export default OAuth;