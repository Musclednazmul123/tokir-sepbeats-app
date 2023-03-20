import { Shopify } from '@shopify/shopify-api';
import ShopModel from '../models/ShopModel.js';
import { Asset } from '@shopify/shopify-api/dist/rest-resources/2022-04/index.js';
import { WelcomeTemplate } from "../email/Templates.js";

export function ShopifyAPI (shop, callback) {
    ShopModel.count(shop, function(error, count){
        if (Number(count) > 0) {
            ShopModel.getByShop(shop, function(error, response){
                if (response && response.access_token) {
                    var client = new Shopify.Clients.Rest(shop, response.access_token);
                    if (typeof callback === "function") {
                        return callback(client);
                    }
                }
                else{
                    if (typeof callback === "function") {
                        return callback({
                            error: error,
                            message: "No access token provided",
                            response: response
                        });
                    }
                }
            });
        }
        else{
            if (typeof callback === "function") {
                return callback({
                    error: error
                });
            }
        }
    });
}

export function GetShop (shop, callback) {
    ShopModel.getByShop(shop, function(error, response){
        if (typeof callback === "function") {
            return callback(response || {});
        }
    });
}

export function AdminApi(params, callback){
    const { shop, type, fetch } = params;
    ShopModel.getByShop(shop, function(error, shopData){
        if (shopData && shopData.access_token) {
            RequestAdminApi(shopData, type, fetch).then(response => {
                if (typeof callback === "function") {
                    return callback(null, response);
                }
            }).catch(error => {
                console.log("error", error);
                if (typeof callback === "function") {
                    return callback({
                        error: true,
                        trace: error
                    });
                }
            })
        }
        else{
            if (typeof callback === "function") {
                return callback({
                    error: true,
                    trace: error,
                    message: "No access token provided",
                    shopData: shopData
                });
            }
        }
    });
}

export function GraphqlApi(params, callback){
    const { shop, type, fetch } = params;
    ShopModel.findOneByField({shop: shop}, {access_token:1, shop:1}, function(error, shopData){
        if (shopData && shopData.access_token) {
            RequestAdminApiGraphQL(shopData, type, fetch).then(response => {
                if (typeof callback === "function") {
                    return callback(null, response);
                }
            }).catch(error => {
                if (typeof callback === "function") {
                    return callback({
                        error: true,
                        trace: error
                    });
                }
            })
        }
        else{
            if (typeof callback === "function") {
                return callback({
                    error: true,
                    trace: error,
                    message: "No access token provided",
                    shopData: shopData
                });
            }
        }
    });
}

async function RequestAdminApi(shop, type, fetch){
    const client = new Shopify.Clients.Rest(
        shop.shop,
        shop.access_token
    );
    const response = await client[type](fetch);
    return response;
}

async function RequestAdminApiGraphQL(shop, type, fetch){
    try {
        const client = new Shopify.Clients.Graphql(
            shop.shop,
            shop.access_token
        );
        const response = await client[type](fetch);
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
}

export async function getAsset(session, theme_id, asset){
    var get = await Asset.all({
        session: session,
        theme_id: theme_id,
        asset: asset,
    });
    return get;
}

export async function deleteAsset(session, theme_id, asset){
    var deletAsset = await Asset.delete({
        session: session,
        theme_id: theme_id,
        asset: asset,
    });
    return deletAsset;
}

export async function putAsset(session, theme_id, key, value){
    const asset = new Asset({session: session});
    asset.theme_id = theme_id;
    asset.key = key;
    asset.value = value;
    var assetResult = await asset.save({});
    return assetResult;
}

export var Mailgun = {
    send(data, callback){
       
    },
    welcome_message(to, callback){
        
    }
}

export function ProductID(string){
    if (!string) return null;
    try {
        var index = string.split("/").length-1;
        string = string.split("/")[index];
    } catch (e) { }
    return string;
}