import Controller from '../app/Controller.js';
import PaymentsModel from '../models/PaymentsModel.js';
import { AdminApi } from '../helpers/Helper.js';
import { DataType } from '@shopify/shopify-api';

class PaymentController extends Controller {
    createInvoice(req, res){
        if (plans.hasOwnProperty(req.query.plan)) {
            const plan = plans[req.query.plan]; 
            AdminApi({
                shop: req.query.shop,
                type: "post",
                fetch: {
                    path: "recurring_application_charges",
                    data: {
                        "recurring_application_charge": {
                            name: plan.title,
                            price: plan.price,
                            trial_days: plan.trial_days,
                            test: process.env.TEST_CHARGES === 'True',
                            return_url: process.env.HOST+"/payment/invoice/accept.json?shop="+req.query.shop+"&pid="+plan.id
                        }
                    },
                    type: DataType.JSON
                }
            }, function(error, response){
                if (error) {
                    return res.send(error);
                }
                if (response && response.body && response.body.recurring_application_charge) {
                    const { recurring_application_charge } = response.body;
                    if (recurring_application_charge.confirmation_url) {
                        return res.redirect(recurring_application_charge.confirmation_url);
                    }
                    else{
                        res.statusCode = 403;
                        return res.send(recurring_application_charge);
                    }
                }
            });  
        }
        else{
            res.statusCode = 403;
            return res.send({
                error: true,
                trace: "Plan was not found"
            });
        }
    }
    invoiceCallback(req, res){
        var redirect_app_admin = `https://${req.query.shop}/admin/apps/${process.env.APP_HANDLE}/pricing?shop=${req.query.shop}`;
        if (req.query.charge_id) {
            AdminApi({
                shop: req.query.shop,
                type: "get",
                fetch: {
                    path: "recurring_application_charges/"+req.query.charge_id,
                    type: DataType.JSON
                }
            }, function(error, response){
                if (response && response.body && response.body.recurring_application_charge) {
                    const { recurring_application_charge } = response.body;
                    console.log("recurring_application_charge", recurring_application_charge);
                    PaymentsModel.count(req.query.shop, function(error, count){
                        if (Number(count) === 0) {
                            var data = recurring_application_charge;
                            data["shop"] = req.query.shop;
                            data["charge_id"] = recurring_application_charge.id;
                            data["id"] = req.query.pid;
                            PaymentsModel.store(data, function (payment_error, payment_saved) {
                                console.log("payment_error, payment_saved", payment_error, payment_saved);
                                return res.redirect(redirect_app_admin+"&status=success");
                            });
                        }
                        else{
                            // update charges
                            var data = {
                                "charge_id": recurring_application_charge.id,
                                "id": req.query.pid,
                                "name": recurring_application_charge.name,
                                "price": recurring_application_charge.price,
                                "status": recurring_application_charge.status,
                                "test": recurring_application_charge.test,
                                "cancelled_on": recurring_application_charge.cancelled_on,
                                "trial_days": recurring_application_charge.trial_days,
                                "trial_ends_on": recurring_application_charge.trial_ends_on,
                                "updated_at": recurring_application_charge.updated_at,
                            };
                            // store charges
                            PaymentsModel.updateOneByShop(req.query.shop, data, function (payment_error, payment_saved) {
                                return res.redirect(redirect_app_admin);
                            });
                        }
                    });
                }
                else{
                    return res.redirect(redirect_app_admin+"&status=failed");
                }
            });
        }
        else{
            return res.redirect(redirect_app_admin+"&status=failed&cid=missing");
        }
    }
    index(req, res) {
        PaymentsModel.all(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    get(req, res) {
        PaymentsModel.getByShop(req.query.shop, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    status(req, res) {
        PaymentsModel.findOneByField(
            {
                shop: req.query.shop,
                status: "active"
            },
            { 
                status: 1,
                shop: 1,
                name: 1,
                id: 1,
            },  function(error, payment){
                return res.send({
                    error, payment
                });
            }
        );
    }
    store(req, res) {
        PaymentsModel.store(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    udpate(req, res) {
        PaymentsModel.update(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    delete(req, res) {
        PaymentsModel.delete(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    remove(req, res) {
        PaymentsModel.deleteall({shop: req.query.shop}, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    plan(req, res){
        PaymentsModel.getByShop(req.query.shop, function(error, data){
            if(data && data.name){
                var plan_name={
                    plan : data.name
                }
                return res.send(plan_name);
            }
            else{
                return res.send(null);
            }
        });
    }
}

const plans = {
    "4688e671": {
      "id": "4688e671",
      "title": "Basic",
      "price": "4.99",
      "trial_days": "14",
      "details": [
        "Unlimited products",
        "Manual recommendations",
        "Visual customizer",
        "24/7 priority support"
      ]
    },
    "4688e672": {
      "id": "4688e672",
      "title": "PROFESSIONAL",
      "price": "14.99",
      "trial_days": "14",
      "details": [
        "Unlimited products",
        "Manual recommendations",
        "Visual customizer",
        "24/7 priority support"
      ]
    },
    "4688e673": {
      "id": "4688e673", 
      "title": "ADVANCE",
      "price": "34.99",
      "trial_days": "14",
      "details": [
        "Unlimited products",
        "Manual recommendations",
        "Visual customizer",
        "24/7 priority support"
      ]
    }
};

export default new PaymentController();