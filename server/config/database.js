import "dotenv/config";
export default {
    "_connection" : "mongodb+srv://dev-shephbeats:dev-shephbeats@cluster0.zht1eqw.mongodb.net/shephbeats?retryWrites=true" || "shephbeats"
};

// import 'dotenv/config';
// export default {
//   _connection:
//   "mongodb+srv://dev-shephbeats:dev-shephbeats@cluster0.zht1eqw.mongodb.net/shephbeats?retryWrites=true&w=majority"+process.env.DATABASE_NAME || "shephbeats",
//   _local: 'mongodb://127.0.0.1:27017/' + process.env.DATABASE_NAME || 'test',
// };