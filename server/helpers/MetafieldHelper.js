import { DataType } from '@shopify/shopify-api';
import { AdminApi } from './Helper.js';

export function createMetafield(shop, params, callback) {
    AdminApi({
        shop: shop,
        type: "post",
        fetch: {
            path: "metafields",
            data: params,
            type: DataType.JSON
        }
    }, callback);
}

export function deleteMetafield(shop, id, callback) {
    AdminApi({
        shop: shop,
        type: "delete",
        fetch: {
            path: "metafields/"+id,
            type: DataType.JSON
        }
    }, callback);
} 

export function updateMetafield(shop, id, params, callback) {
    AdminApi({
        shop: shop,
        type: "put",
        fetch: {
            path: "metafields/"+id,
            data: params,
            type: DataType.JSON 
        }
    }, callback);
}