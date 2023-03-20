import { GraphqlApi } from './Helper.js';

export function productByHandle(shop, handle, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data: `
            {
                productByHandle (handle: "${handle}") {
                  id
                  title
                  handle
                  featuredImage {
                    id
                    src
                  }
                }
            }
            `,
        }
    }, function(error, response){
        if (error) {
            return callback({error});
        }
        else if (response && response.body && response.body.data && response.body.data.productByHandle) {
            return callback(null, {
                product: response.body.data.productByHandle
            });
        }
        else{
            return callback({
                error: response
            });
        }
    });
}