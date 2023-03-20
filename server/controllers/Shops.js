import Controller from '../app/Controller.js';
import Shop from '../models/ShopModel.js';
import EventsHelper from "../helpers/EventsHelper.js";
import { Shopify } from '@shopify/shopify-api';
import { AdminApi } from '../helpers/Helper.js';
import { DataType } from '@shopify/shopify-api';

async function saveShopInfo(shop, accessToken, new_installation){
    
    AdminApi({
        shop: shop,
        type: "post",
        fetch: {
            path: "webhooks",
            data: {
                "webhook": {
                    topic: "app/uninstalled",
                    address: process.env.HOST+"/webhook/callback/app/uninstall"
                }
            },
            type: DataType.JSON
        }
    }, function(errorsdf, webhook_sresponse){
        if (errorsdf) console.log("webhook_error already subscribed");
        if (webhook_sresponse && webhook_sresponse.body) {
            console.log("webhook_response", webhook_sresponse.body);
        }
    });
    const client = new Shopify.Clients.Rest(
        shop,
        accessToken
    );
    const response = await client.get({path: 'shop'});
    try {
        if (response && response.body && response.body.shop) {
            Shop.updateOneByShop(shop, {
                info: response.body.shop
            }, function(error, saved){
                if (error) {
                    console.log(error);
                    return error;
                }
                return saved;
            })
        }
    } catch (e) {
        return e;
    }
}

EventsHelper.on("app/installation", (data) => {
    const { shop, access_token, scope } = data;
    console.log("New installation", shop, access_token);
    if (shop) {
        Shop.count(shop, function(error, count){
            if (Number(count) === 0) { // new application installed
                Shop.store({
                    shop: shop,
                    access_token: access_token,
                    access_scope: scope,
                }, function(s_error, s_success){
                    if(s_error) console.log(s_error);
                    else console.log("A new shop has been registered", shop, new Date());
                    saveShopInfo(shop, access_token, true).then(saved => {}).catch(error => {
                        console.log(error);
                    });
                });
            }
            else{ // old app login
                EventsHelper.emit("app/installation/updated", {shop, access_token});
                Shop.updateOneByShop(shop, {
                    access_token: access_token,
                    access_scope: scope,
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        __v: 1
                    }
                }, function(s_error, s_success){
                    if(s_error) console.log(s_error);
                    saveShopInfo(shop, access_token, false).then(saved => {}).catch(error => {
                        console.log(error);
                    });
                });
            }
        });
    }
})

class Shops extends Controller {
    OAuthCallBack(shop, access_token, scope) {
        console.log("OAuth Callback received", shop, scope);
        if (shop) {
            Shop.count(shop, function(error, count){
                if (Number(count) === 0) { // new application installed
                    EventsHelper.emit("app/installation", {shop, access_token});
                    Shop.store({
                        shop: shop,
                        access_token: access_token,
                        access_scope: scope,
                    }, function(s_error, s_success){
                        if(s_error) console.log(s_error);
                        else console.log("A new shop has been registered", shop, new Date());
                        saveShopInfo(shop, access_token, true).then(saved => {}).catch(error => {
                            console.log(error);
                        });
                    });
                }
                else{ // old app login
                    EventsHelper.emit("app/installation/updated", {shop, access_token});
                    Shop.updateOneByShop(shop, {
                        access_token: access_token,
                        access_scope: scope,
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            __v: 1
                        }
                    }, function(s_error, s_success){
                        if(s_error) console.log(s_error);
                        saveShopInfo(shop, access_token, false).then(saved => {}).catch(error => {
                            console.log(error);
                        });
                    });
                }
            });
        }
    }
    OAuthCallBackError(error){
        // console.log("Error", error);
    }
    testing(req, res) {
        AdminApi(req.body, function(error, response){
            if (error) {
                return res.send(error);
            }
            return res.send(response);
        });
    }
    index(req, res) {
        Shop.all(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    get(req, res) {
        Shop.get(req.query.id, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    store(req, res) {
        Shop.store(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    udpate(req, res) {
        Shop.update(req.body.id, req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    delete(req, res) {
        Shop.delete(function(error, data){
            return res.send({
                error, data
            });
        })
    }
}

export default new Shops();