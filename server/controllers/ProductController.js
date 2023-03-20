import { DataType } from "@shopify/shopify-api";
import { AdminApi } from "../helpers/Helper.js";
import { productByHandle } from "../helpers/ShopifyGraphQL.js";
import Shopify from '@shopify/shopify-api';
import ProductsModel from '../models/ProductsModel.js';
import SamplesModel from '../models/SamplesModel.js';
import { GraphqlApi } from '../helpers/Helper.js';
import api_middleware from '../middleware/api.js';
import UUID from "../helpers/UUID.js";
import "dotenv/config";
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

import express from 'express';
import { Console } from "console";
const router = express.Router();


const S3_BUCKET_ENDPOINT = 'nyc3.digitaloceanspaces.com';
const S3_BUCKET_KEY = 'DO00L6VHCM6UJH393BVY';
const S3_BUCKET_SECRET = 'qUq6x/fg1t75qarPWEUFbtU7pvSlXreeoOEFGjJCtn4';
const S3_BUCKET_NAME = 'sgtw';

const s3BucketEndpoint = new AWS.Endpoint(S3_BUCKET_ENDPOINT);


const s3 = new AWS.S3({
    endpoint: s3BucketEndpoint,
    accessKeyId: S3_BUCKET_KEY,
    secretAccessKey: S3_BUCKET_SECRET,
});

// export async function autoUpload() {
//     //uploading files to do logic
//         fs.readdir('public/files', (err, files) => {
//             if (err) {
//                 return
//             } else {
//                 if (files.length > 0) {
//                 for (let index = 0; index < files.length; index++) {
//                     const element = files[index];
//                     const image = ['.jpg', '.jpeg', '.png', '.svg'];
//                     const video = ['.mp4', '.avi'];
//                     const audio = ['.mp3', '.png'];
//                     let type;
//                     if (image.includes(path.extname(element))) {
//                     type = `Image/${path.extname(element).replace('.', '')}`;
//                     } else if (video.includes(path.extname(element))) {
//                     type = `Video/${path.extname(element).replace('.', '')}`;
//                     } else if (audio.includes(path.extname(element))) {
//                     type = `Audio/${path.extname(element).replace('.', '')}`;
//                     } else {
//                     type = undefined;
//                     }
//                     const dest = `public/files/${element}`;
//                     if (type) {
//                     uploadFileToS3({
//                         fileName: element,
//                         contentType: type,
//                         destination: dest,
//                     })
//                         .then((data) => {
//                         // console.log(data)
//                         fs.readFile(dest, 'utf8', function(err, data){
//                             if (err){
//                             return 
//                             } else if (data){
//                             return fs.unlinkSync(dest);
//                             } else{
//                             return
//                             }
//                         });
//                         })
//                         .catch((err) => console.log(err));
//                     }
//                 }
//                 }
//             }
//         });
//     }

class ProductController{
    createPack(req, res){
        // console.log("createPack: ", req.file);
        // upload.single('image');
        const title = req.body.title;
        const genre = req.body.genre;
        const price = req.body.price;
        const description = req.body.description;
        // const files = req.body.files;
        console.log("createPack: ", req.body);
        GraphqlApi({
            shop: req.body.shop,
            type: "query",
            fetch: {
                data: `
                    mutation  {
                        productCreate(
                            input: {
                                title: "${title}",
                                descriptionHtml: "${description}"
                            }
                        ){
                            product {
                                id
                            }
                        }
                    }
                `,
            }
        }, function(error, response){
            if(response && response.body && response.body.data && response.body.data.productCreate && response.body.data.productCreate.product && response.body.data.productCreate.product.id){
                const product_id = response.body.data.productCreate.product.id;
                const s_product_id = product_id.split("gid://shopify/Product/")[1];
                console.log("product created success: ", product_id);
                GraphqlApi({
                    shop: req.body.shop,
                    type: "query",
                    fetch: {
                        data: {
                            "query": `mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
                                productCreateMedia(media: $media, productId: $productId) {
                                    media {
                                        alt
                                        mediaContentType
                                        status
                                    }
                                    mediaUserErrors {
                                        field
                                        message
                                    }
                                    product {
                                        id
                                        title
                                    }
                                }
                            }`, "variables": {
                                    "media": {
                                        "alt": "Image",
                                        "mediaContentType": "IMAGE",
                                        "originalSource": "https://muscledupsell.com/lib/amazone_288x100.png"
                                    },
                                "productId": product_id
                            }
                        }
                    }
                }, function(error, response){
                    if(response && response.body && response.body.data && response.body.data.productCreateMedia.media){
                        // console.log("media created success: ", response.body.data.productCreateMedia.media);
                        try{
                            var sourceUrls = './public/files/'+req.file.filename;
                            fs.unlinkSync(sourceUrls);
                        }catch(err){
                            console.log(err);
                        }

                        getPublish(req.body.shop, function (error, response) {
                            if(response && response.body && response.body.data && response.body.data.publications && response.body.data.publications.edges){
                                var publish_id = response.body.data.publications.edges[0].node.id;
                                console.log("publish_id: ", publish_id);
                                GraphqlApi({
                                    shop: req.body.shop,
                                    type: "query",
                                    fetch: {
                                        data: {
                                            "query": `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
                                                publishablePublish(id: $id, input: $input) {
                                                    publishable {
                                                        availablePublicationCount
                                                        publicationCount
                                                    }
                                                    shop {
                                                        publicationCount
                                                    }
                                                    userErrors {
                                                        field
                                                        message
                                                    }
                                                }
                                            }`, "variables": {
                                                "input":  {
                                                    "publicationId": publish_id
                                                },
                                                "id": product_id
                                            },
                                        }
                                    }
                                }, function(error, response){
                                    if(response && response.body && response.body.data && response.body.data.publishablePublish && response.body.data.publishablePublish.publishable){
                                        // console.log("product published success: ", response.body.data.publishablePublish.publishable);
                                            GraphqlApi({
                                                shop: req.body.shop,
                                                type: "query",
                                                fetch: {
                                                    data: {
                                                        "query": `mutation {
                                                            productUpdate(
                                                                input : {
                                                                    id: "${product_id}",
                                                                    metafields: [
                                                                        {
                                                                            namespace: "media", 
                                                                            key: "featured_image",
                                                                            value: "https://sleeveandskin.com/img/ebay/2/sleeves-w-strap-d-rings/13/500x500-main/m-2.jpg",
                                                                            type:"single_line_text_field"
                                                                        }
                                                                    ]
                                                                }
                                                            )
                                                            {
                                                                product {
                                                                    metafields(first: 100) {
                                                                        edges {
                                                                            node {
                                                                            namespace
                                                                            key
                                                                            value
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        }`, "variables": {
                                                                "input":  {
                                                                "metafields": [
                                                                        {
                                                                            "namespace": "media", 
                                                                            "key": "featured_image",
                                                                            "value": "https://muscledupsell.com/lib/amazone_288x100.png",
                                                                            "type":"single_line_text_field"
                                                                        }
                                                                    ],
                                                                },
                                                                "id": product_id
                                                            }
                                                        }
                                                    }
                                                }, function(error, response){
                                                    if(response && response.body && response.body.data && response.body.data.productUpdate && response.body.data.productUpdate.product){
                                                        // console.log("metafields response", response.body.data.productUpdate.product);
                                                        var img_src = response.body.data.productUpdate.product.metafields.edges[0].node.value;
                                                        console.log("img_src: ", img_src);
                                                        // console.log("createSamplesAPI response", response.body);
                                                        var data = {};
                                                        data["shop"] = req.body.shop;
                                                        data["pack_id"] = s_product_id;
                                                        data["genre"] = genre;
                                                        data["image_src"] = img_src;
                                                        ProductsModel.store(data, function (error, success) {
                                                            if(success){
                                                                console.log("pack saved in DB: ", success.pack_id);
                                                                return res.send({error, success});
                                                            }
                                                            else{
                                                                console.log("pack saved in DB ERROR: ", error);
                                                            }
                                                        });
                                                    }
                                                    else{
                                                        console.log(error);
                                                    }
                                                });
                                            }
                                            else{
                                                console.log("pack save error", error);
                                                return res.send({
                                                    error: error,
                                                    status: 0
                                                });
                                            }
                                        });
                                    }
                                    else{
                                        console.log("product publish error", error);
                                        return res.send({
                                            error: error,
                                            status: 0
                                        });
                                    }
                        });
                    }
                });
            }
            else{
                console.log("product create error", error);
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    udpatePack(req, res){
        console.log("udpatePack: ",req.body);
        console.log("req.query.id", req.query.id);
        var product_id = "gid://shopify/Product/"+req.query.id;
        GraphqlApi({
            shop: req.body.shop,
            type: "query",
            fetch: {
                data: {
                    "query": `mutation {
                        productUpdate(input: {id: "${product_id}", title: "${req.body.title}", bodyHtml: "${req.body.description}"}) {
                            product {
                                id
                            }
                        }
                    }`
                }
            }
            }, function(error, response){
                // if(response && response.body && response.body.data && response.body.data.productUpdate && response.body.data.productUpdate.product){
                    if(response && response.body){
                    console.log("metafields response", response.body);
                    // var img_src = response.body.data.productUpdate.product.metafields.edges[0].node.value;
                    // console.log("img_src: ", img_src);
                    // createSamplesAPI(req.body.shop, product_id, title, function (error, response) {
                    //     if(response){
                    //         console.log("createSamplesAPI response", response.body);
                    //         var data = {};
                    //         data["shop"] = req.body.shop;
                    //         data["pack_id"] = s_product_id;
                    //         data["genre"] = genre;
                    //         data["image_src"] = img_src;
                    //         ProductsModel.store(data, function (error, success) {
                    //             if(success){
                    //                 console.log("pack saved in DB: ", success.pack_id);
                    //                 return res.send({error, success});
                    //             }
                    //             else{
                    //                 console.log("pack saved in DB ERROR: ", error);
                    //             }
                    //         });
                    //     }
                    //     else{
                    //         console.log(" error createSamplesAPI response", error);
                    //     }
                    // });
                }
                else{
                    console.log(error);
                }
            });
        ProductsModel.updateByPack(req.query.id, req.body, function(error, saved) {
            console.log("saved",saved);
            console.log("error",error);
            return res.send({
                error, saved
            });
        });
    }

    getSinglePack(req, res){
        console.log("req.query.id", req.query);
        // AdminApi({
        //     shop: req.query.shop,
        //     type: "get",
        //     fetch: {
        //         path: "products/"+req.query.pack_id,
        //         type: DataType.JSON
        //     }
        // }, function(error, response){
        //     if (response && response.body && response.body.product) {
        //         console.log("response body: ", response.body.product);
        //         return res.send(response.body);
        //     }
        //     else{
        //         return res.send({
        //             error,response
        //         });
        //     }
        // });

        GraphqlApi({
            shop: req.query.shop,
            type: "query",
            fetch: {
                data: `
                    query Product {
                        product(id:"gid://shopify/Product/${req.query.pack_id}") {
                            title
                            handle
                            tags
                            productType
                            vendor
                            id
                            legacyResourceId
                            description
                            featuredImage {
                                url
                            }
                            variants(first:1){
                                edges {
                                    node {
                                        availableForSale
                                        id
                                        compareAtPrice
                                        price
                                        title
                                    }
                                }
                            }
                        } 
                    }
                `,
            }
        }, function(error, response){
            if (response && response.body) {
                console.log("getPack: ", response.body.data.product);
                return res.send(response.body.data.product);
            }
            else{
                return res.send({
                    error,response
                });
            }
        });
    }

    deletePack(req, res){
        console.log("req.query.id", req.query.id);
        console.log("req.query.shop", req.query.shop);
        deletePackAPI(req.query.shop, req.query.id, function(error, response){
            console.log("req.query: ", response.body);
            if( response && response.body){
                SamplesModel.deleteAllSamplesByPackId(req.query.id, function(error, data){
                    if(data){
                        ProductsModel.deleteByPackid(req.query.id, function(error, data){
                            if(data){
                                return res.send(data);
                            }
                            else{
                                return res.send({
                                    error: error,
                                    status: 0
                                });
                            }
                        });
                    }
                    else{
                        return res.send({
                            error: error,
                            status: 0
                        });
                    }
                });
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    getAllPacks(req, res){
        const { shop } = req.query;
        ProductsModel.paginate(req, function(error, products){
            if(products){ 
                return res.send(products);
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    addSample(req, res){
        console.log("addSamples: ", req.body);
        var shop = req.body.shop;
        var title = req.body.title;
        var price = req.body.price;
        var product_id = "gid://shopify/Product/"+req.body.pack_id;
        console.log("pack_id: ", product_id);
        createSamplesAPI(shop, product_id, title, price, function (error, response) {
            if(response && response.body.data && response.body.data.productVariantsBulkCreate && response.body.data.productVariantsBulkCreate.productVariants){
                var sample_id = response.body.data.productVariantsBulkCreate.productVariants[0].id;
                console.log("sample_id: ", response.body.data.productVariantsBulkCreate.productVariants[0].metafields.edges);

                var data = {};
                data["pack_id"] = req.body.pack_id;
                data["sample_id"] = sample_id.split("gid://shopify/ProductVariant/")[1];
                data["filesUrl"] = req.body.pack_id;
                SamplesModel.store(data, function (error, response) {
                    if(response){
                        console.log("sample saved in DB: ", response);
                        return res.send({error, response});
                    }
                    else{
                        console.log("sample saved in DB ERROR: ", error);
                    }
                });
            }
            else{
                return res.send({
                    error,response
                });
            }
        });
    }

    getSingleSample(req, res) { 
        console.log("getsample::", req.query);
        AdminApi({
            shop: req.query.shop,
            type: "get",
            fetch: {
                path: "variants/"+req.query.id,
                type: DataType.JSON
            }
        }, function(error, response){
            if (response && response.body) {
                console.log("response body: ", response.body);
                return res.send(response.body.variant);
            }
            else{
                return res.send({
                    error,response
                });
            }
        });
    }

    deleteSample(req, res){
        console.log("delete sample: ", req.query);
        var shop = req.query.shop;
        var sample_id = "gid://shopify/ProductVariant/"+req.query.id;
        console.log("sample_id", sample_id);
        console.log("shop", shop);
        deleteSampleAPI(shop, sample_id, function(error, response){
            if(response && response.body && response.body.data && response.body.data.productVariantDelete && response.body.data.productVariantDelete.product){
                SamplesModel.deleteBySampleid(req.query.id, function(error, data){
                    console.log("data", data);
                    if(data){
                        return res.send(data);
                    }
                    else{
                        return res.send({
                            error: error,
                            status: 0
                        });
                    }
                });
            }
            else{
                return res.send({error});
            }
        });
    }

    updateSample(req, res){
        console.log("updateSample: ", req.query);
        
        // updateSampleAPI(shop, product_id, sample_id, function(error, response){
        //     console.log("updateSampleAPI: ", response.body);
        // });
    }

    getAllSamples(req, res){
        // console.log("getAllSample: ", req.query);
        var shop = req.query.shop;
        var product_id = req.query.product_id;
        getAllSampleAPI(shop, product_id, function(error, response){
            if(response && response.body.data && response.body.data.product && response.body.data.product.variants && response.body.data.product.variants.edges){
                console.log("response", response.body.data.product.variants.edges);
                return res.send(response.body.data.product.variants.edges);
            }
            else{
                return res.send({error});
            }
        });
    }

    id(req, res){
        AdminApi({
            shop: req.query.shop,
            type: "get",
            fetch: {
                path: "products/"+req.query.id,
                type: DataType.JSON
            }
        }, function(error, response){
            if (response && response.body && response.body.product) {
                return res.send(response.body);  
            }
            else{
                return res.send({
                    error,response
                });
            }
        });
    }

    handle(req, res){
        productByHandle(req.query.shop, req.query.handle, (error, product) => {
            return res.send({
                error: error,
                product: product
            });
        });
    }
}

function getPublish(shop, callback) {
    GraphqlApi({ 
        shop: shop,
        type: "query",
        fetch: {
            data: `{
                publications(first:1){
                    edges{
                        node{
                            id
                        }
                    }
                }
            }`,
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function deletePackAPI(shop, product_id, callback) {
    AdminApi({
        shop: shop,
        type: "delete",
        fetch: {
            path: "products/"+product_id,
            type: DataType.JSON
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function createSamplesAPI(shop, product_id, title, price, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                    productVariantsBulkCreate(productId: $productId, variants: $variants) {
                    product {
                        id
                    }
                    productVariants {
                        id
                        metafields(first: 1) {
                        edges {
                            node {
                            namespace
                            key
                            value
                            }
                        }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                    }
                }
                `, "variables": {
                    "variants": [
                        {
                            "options": [
                                title
                            ],
                            "price": price,
                            "mediaSrc": [
                                "https://muscledupsell.com/lib/amazone_288x100.png"
                            ],
                            "metafields": [
                                {
                                    "namespace": "sgtw_sample", 
                                    "key": "file_url",
                                    "value": "https://muscledupsell.com/lib/one-night.mp4",
                                    "type":"single_line_text_field"
                                }
                            ]
                        }
                    ],
                    "productId": product_id,
                }
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function updateSampleAPI(shop, product_id, sample_id, title, price, option1, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation {
                productVariantUpdate(input: {id: "gid://shopify/ProductVariant/44669396680980", position: 1, barcode: "12343434343", weight: 1.5, weightUnit: KILOGRAMS, requiresShipping: true, sku: "EXAMPLE_SKU", taxable: true, taxCode: "", options: ["M"], inventoryItem: {cost: 19.99}}) {
                  productVariant {
                    id
                    legacyResourceId
                    sku
                    barcode
                    weight
                    weightUnit
                    inventoryItem {
                      id
                      legacyResourceId
                      requiresShipping
                      unitCost {
                        amount
                      }
                    }
                    position
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      id
                      title
                      legacyResourceId
                    }
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }`
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function getAllSampleAPI(shop, product_id, callback){
    // console.log("getAllSampleAPI: ", product_id);
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{
                "query": `{
                    product(id: "gid://shopify/Product/${product_id}") {
                        variants(first: 15) {
                            edges {
                                node {
                                    id
                                    price
                                    title
                                    image {
                                        url
                                    }
                                }
                            }
                        }
                    }
                }`
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function deleteSampleAPI(shop, sample_id, callback) {
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation productVariantDelete($id: ID!) {
                    productVariantDelete(id: $id) {
                    deletedProductVariantId
                    product {
                        id
                        title
                    }
                    userErrors {
                        field
                        message
                    }
                    }
                }`, "variables": {
                        "id": sample_id
                }
            }
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
 }

export default new ProductController();