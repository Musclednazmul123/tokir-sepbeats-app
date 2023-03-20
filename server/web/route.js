import express from 'express';
import "dotenv/config";
import EventsHelper from "../helpers/EventsHelper.js";
//import controllers here
import PaymentController from "../controllers/PaymentController.js";
import Shops from "../controllers/Shops.js";
import ThemeController from '../controllers/ThemeController.js';
import ProductController from '../controllers/ProductController.js';
import shopValidate from "../middleware/shopValidate.js";
const route = express.Router(); 
import multer from 'multer';

route.use(shopValidate);// filter request for x-auth-shop

// EventsHelper.on('shop/uninstalled', (data) => {
//    PaymentsModel.updateOneByShop(data.shop,{
//       status: "pending"
//    }, function(error, payment_udpated){});
 
//    // update database when uninstall the app
// });


// const { uploadFile } = require("../s3");
// const fs = require("fs");
// const util = require("util");
// const unlinkFile = util.promisify(fs.unlink);


// route.post("/single", upload.single("image"), async (req, res) => {

//    console.log(req.file);
 
//  // uploading to AWS S3*
 
//    const result = await uploadFile(req.file);  // Calling above function in s3.js
 
//    console.log("S3 response", result);
 
//   // You may apply filter, resize image before sending to client*
 
//   // Deleting from local if uploaded in S3 bucket*
 
//    await unlinkFile(req.file.path);
 
//    res.send({
//      status: "success",
//      message: "File uploaded successfully",
//      data: req.file,
//    });
//  });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("file: ", file);
      cb(null, './public/files');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s/g, '-');
      cb(null, uniqueSuffix);
    },
  });
  
  const upload = multer({ storage: storage });


route.get("/merchant/shop_plan", PaymentController.plan);


route.post("/merchant/add_product", upload.single('image'), ProductController.createPack);
route.get("/merchant/products", ProductController.getAllPacks);
route.get("/merchant/get_pack", ProductController.getSinglePack);
route.delete("/merchant/delete_pack", ProductController.deletePack);
route.put("/merchant/update_pack", ProductController.udpatePack);

route.post("/merchant/add_samples", upload.single('image'), ProductController.addSample);
route.get("/merchant/get_all_samples", ProductController.getAllSamples);
route.delete("/merchant/sample/delete", ProductController.deleteSample);
route.get("/merchant/edit_sample", ProductController.getSingleSample);
route.post("/merchant/update_sample", ProductController.updateSample);


// product

route.get("/product/id.json",ProductController.id);
route.get("/product/handle.json",ProductController.handle);
route.get("/shop/get.json", Shops.index);
route.post("/shop/create.json", Shops.store);
route.put("/shop/update.json", Shops.udpate);
route.delete("/shop/delete.json", Shops.delete);

// payment

route.get("/payment/invoice.json", PaymentController.createInvoice);
route.get("/payment/invoice/accept.json", PaymentController.invoiceCallback);
route.get("/payment/get.json", PaymentController.get);
route.get("/payment/status.json", PaymentController.status);
route.post("/payment/create.json", PaymentController.store);
route.put("/payment/update.json", PaymentController.udpate);
route.delete("/payment/delete.json", PaymentController.delete);

//theme
 
route.get("/merchant/themes/all", ThemeController.themes);
route.get("/themes/status.json", ThemeController.status);
route.post("/themes/install.json", ThemeController.install);
route.post("/themes/uninstall.json", ThemeController.uninstall);

export default route;