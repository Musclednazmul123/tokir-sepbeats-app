import mongoose from 'mongoose';
import database from "../config/database.js";
const Schema = mongoose.Schema;

class Model {
    path = '../databases';
    model = null;
    tableName = null;
    fields = null;
    db = null;
    table = {};
    constructor(table){
        this.table = table;
        mongoose.connect(database._connection);
        if(table){
            if(!table.fields) throw new Error("Database table fields is not defined");
            if(!table.model) { throw new Error("Database table is not defined") };
            this.tableName = table.model;
            this.model = table.model;
            this.fields = table.fields;
            this.db = mongoose.model(this.model,new Schema(this.fields,{collection:this.tableName}));
        }
        else{
            new Error("Database is not defined");
        }
    }
    paginate(req, callback){
        var $this = this;
        var find = { shop: req.query.shop };
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 7;
        var from = parseInt(limit*Number(page-1));
        var to = parseInt(limit*Number(page));
        var sort = {
            _id: req.query.sort === "desc"?-1:1
        };
        this.db
        .find(find)
        .limit(limit)
        .skip(from)
        .sort(sort)
        .exec(function(error, collections){
            $this.count(req.query.shop, function(e, count){
                if(typeof callback === "function"){
                    return callback(error, {
                        collections: collections,
                        results: collections.length,
                        paginate: {
                            counts: count,
                            page: page,
                            next_page: Number(count) > Number(to)? Number(page+1):null,
                            prev_page: Number(page) > 1?Number(page-1):null
                        }
                    });
                }
            });
        });
    }
    allByPagination(req, callback){
        var $this = this;
        var find = { };
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 20;
        var from = parseInt(limit*Number(page-1));
        var to = parseInt(limit*Number(page));
        var sort = {
            _id: req.query.sort === "desc"?-1:1
        };
        this.db
        .find(find)
        .limit(limit)
        .skip(from)
        .sort(sort)
        .exec(function(error, collections){
            $this.count(req.query.shop, function(e, count){
                if(typeof callback === "function"){
                    return callback(error, {
                        collections: collections,
                        results: collections.length,
                        paginate: {
                            counts: count,
                            page: page,
                            next_page: Number(count) > Number(to)? Number(page+1):null,
                            prev_page: Number(page) > 1?Number(page-1):null
                        }
                    });
                }
            });
        });
    }
    all(shop, callback){
        this.db.find({shop: shop}, callback);
    }
    getAll(query, callback){
        this.db.find(query, function(error, data){
            if(typeof callback === "function"){
                return callback(error, data);
            }
        });
    }
    getByShop(shop, callback){
        this.db.findOne({shop: shop}, function(error, data){
            if(typeof callback === "function"){
                return callback(error, data);
            }
        });
    }
    getAllByShop(shop, callback){
        this.db.find({shop: shop}, function(error, data){
            if(typeof callback === "function"){
                return callback(error, data);
            }
        });
    }
    aggregateByShop(shop, callback){
        this.db.aggregate([
            { $match: { shop: shop } },
            {
                $group: {
                    _id: shop,
                    views: { $sum: "$views" },
                    clicks: { $sum: "$clicks" },
                    price: { $avg: "$product_price" }
                }
            } 
        ]
        , callback);
    }
    aggregateByUid(uid, callback){
        this.db.aggregate([
            { $match: { uid: uid } },
            {
                $group: { 
                    _id: uid,
                    views: { $sum: "$views" },
                    clicks: { $sum: "$clicks" },
                    price: { $avg: "$product_price" }
                } 
            }
        ]
        , callback);
    }

    aggregateByProductId(product_id, callback){
        this.db.aggregate([
            { $match: { product_id: product_id } },
            {
                $group: { 
                    _id: product_id,
                    views: { $sum: "$views" },
                    clicks: { $sum: "$clicks" },
                    price: { $avg: "$product_price" }
                } 
            }
        ]
        , callback);
    }

    count(shop, callback){
        this.db.countDocuments({shop: shop}, callback);
    }
    get(id, callback){
        this.db.findOne({_id: id}, callback);
    }
    getByPackId(pack_id, callback){
        this.db.findOne({pack_id: pack_id}, callback);
    }
    getByUid(uid, callback){
        this.db.findOne({uid: uid}, callback);
    }
    store(data, callback){
        var tbl = new this.db(data);
        tbl.save(callback);
    }
    updateMany(shop, data, callback){
        this.db.updateMany({shop: shop}, data, function(error, saved) {
            if(typeof callback === "function"){
                return callback(error, saved);
            }
        });
    }
    updateOneByShop(shop, data, callback){
        this.db.updateOne({shop: shop}, data, function(error, saved) {
            if(typeof callback === "function"){
                return callback(error, saved);
            }
        });
    }
    updateOne(id, data, callback){
        this.db.updateOne({_id: id}, data, function(error, saved) {
            if(typeof callback === "function"){
                return callback(error, saved, data);
            }
        }); 
    }
    updateByPack(pack_id, data, callback){
        this.db.updateOne({pack_id: pack_id}, data, function(error, saved) {
            if(typeof callback === "function"){
                return callback(error, saved, data);
            }
        }); 
    }
    delete(id, callback){
        this.db.deleteOne({_id: id}, callback);
    }
    deleteByUid(uid, callback){
        this.db.deleteOne({uid: uid}, callback);
    }
    deleteByPackid(pack_id, callback){
        this.db.deleteOne({pack_id: pack_id}, callback);
    }
    deleteBySampleid(sample_id, callback){
        this.db.deleteOne({sample_id: sample_id}, callback);
    }
    emptyTable(callback){
        this.db.deleteMany({}, callback);
    }
    deleteAllSamplesByPackId(pack_id, callback){
        this.db.deleteMany({pack_id: pack_id}, callback);
    }
    deleteAll(shop, callback){
        this.db.deleteMany({shop: shop}, callback);
    }
    query(query, callback){
        this.db.find(query, callback);
    }
    queryOne(query, callback){
        this.db.findOne(query,callback);
    }
    findOneByField(query, fields, callback){
        this.db.findOne(query,fields,callback);
    }
    findByField(query, fields, callback){
        this.db.find(query,fields,callback);
    }
    countByQuery(query, callback){
        this.db.countDocuments(query, callback);
    }
    findPost(req, callback){
        var product_array = [];
        req.body.trigger_products.forEach(id => {
            product_array.push({
                "trigger_products.id": id
            });
        });
        var query = {
            shop: req.body.shop,
            $and: [
                {
                    $or: [
                        {
                            "trigger_type": "all_products"
                        },
                        {
                           '$and': [
                                {
                                    "trigger_type": "tagged_product"
                                },
                                {
                                    trigger_tags: {
                                        $in: req.body.trigger_tags
                                    }
                                }
                            ]
                        },
                        {
                            '$and': [
                                {
                                    "trigger_type": "specific_product"
                                },
                                {
                                    '$or':  product_array
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        this.db.find(query,
            function(error, data){
            if(typeof callback === "function"){
                return callback(error, data);
            }
        });
    }
}

export default Model;