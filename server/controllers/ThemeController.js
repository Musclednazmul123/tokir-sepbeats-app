import Controller from "../app/Controller.js";
import { AdminApi, deleteAsset, getAsset, putAsset } from "../helpers/Helper.js";
import ShopModel from "../models/ShopModel.js";
import { InstallationScriptCss, InstallationScriptJS, InstallationScriptLiquid } from "../snippets/SnippetHelper.js";

class ThemeController extends Controller {
    themes(req, res) {
        AdminApi({
            shop: req.query.shop,
            type: "get",
            fetch: {
                path: "themes"
            }
        }, function(error, response){
            if (error) {
                return res.send(error);
            }
            if (response && response.body && response.body.themes) {
                return res.send(response.body);
            }
            else{
                return res.send({
                    themes: []
                });
            }
        });
    }
    status(req, res) {
        return res.send({});
    }
    install(req, res) {
        ShopModel.getByShop(req.query.shop, function(error, shopData){
            if (shopData) {
                const { session } = shopData;
                const { theme_id, shop } = req.query;
                getAsset(session, theme_id, { "key" : "templates/product.liquid" }).then(asset => {
                    if (asset && asset[0]) {
                        var value = asset[0].value;
                        putAsset(session, theme_id, "templates/bkp-crp-product.liquid", value).then(section_created => {
                            try {
                                value = value.split("{% section 'custom-related-products' %}").join("");
                            } catch (e) { }
                            value += `\n{% section 'custom-related-products' %}`;
                            putAsset(session, theme_id, "templates/product.liquid", value).then(section_created => {
                                putAsset(session, theme_id, "sections/custom-related-products.liquid", InstallationScriptLiquid).then(section_created => {
                                    putAsset(session, theme_id, "assets/custom-related-products.css", InstallationScriptCss).then(css_created => {
                                        putAsset(session, theme_id, "assets/custom-related-products.js", InstallationScriptJS).then(js_created => {
                                            return res.send({
                                                success: true,
                                                message: "Configuration has been successfully completed"
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                    else{
                        return res.send({
                            message: "Shopify OS 2.0 detected. Please config app from Theme customization tool",
                            error: true
                        })
                    }
                });
            }
            else{
                return res.send({
                    error: null,
                    shop: "404"
                });
            }
        });
    }
    uninstall(req, res) {
        ShopModel.getByShop(req.query.shop, function(error, shopData){
            if (shopData) {
                const { session } = shopData;
                const { theme_id, shop } = req.query;
                getAsset(session, theme_id, { "key":"templates/product.json"}).then(asset_20_s => {
                    if(asset_20_s && asset_20_s[0]){
                        return res.send({
                            message: "Shopify OS 2.0 detected. Please config app from Theme customization tool",
                            error: true
                        })
                    }
                    else{
                        getAsset(session, theme_id, { "key":"templates/bkp-crp-product.liquid"}).then(asset => {
                            deleteAsset(session, theme_id, {"key":"sections/custom-related-products.liquid"}).then(section_created => {
                                deleteAsset(session, theme_id, {"key":"assets/custom-related-products.css"}).then(css_created => {
                                    deleteAsset(session, theme_id, {"key":"assets/custom-related-products.js"}).then(js_created => {
                                        if (asset && asset[0]) {
                                            var value = asset[0].value;
                                            putAsset(session, theme_id, "templates/product.liquid", value).then(bkp_section_created => {
                                                return res.send({
                                                    message: "Uninstallation process completed",
                                                    error: false,
                                                    success: true,
                                                });
                                            });
                                        }
                                        else{
                                            return res.send({
                                                message: "Backup not found.",
                                                error: true
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            }
            else{
                return res.send({
                    error: null,
                    shop: "404"
                });
            }
        });
    }
}

export default new ThemeController();