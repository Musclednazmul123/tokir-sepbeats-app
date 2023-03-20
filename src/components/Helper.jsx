import Axios from  "../Axios";
import { Card, EmptyState } from "@shopify/polaris"
import store from "store2";
import queryString from 'query-string';

export function PingServer(data){
    // Axios.post("/api/ping?shop="+store("shop"), data).then(response => {}).catch(error => {});
}

export function resizeImage(image, size) {
    if (!size) {
        size = '100x';
    }
    // size += "_crop_center";
    if (image) {
        if (image.indexOf(".jpg") > -1) {
            var n = image.lastIndexOf(".jpg");
            image = image.substring(0, n) + "_" + size + image.substring(n);
        } else if (image.indexOf(".png") > -1) {
            var n = image.lastIndexOf(".png");
            image = image.substring(0, n) + "_" + size + image.substring(n);
        } else if (image.indexOf(".gif") > -1) {
            var n = image.lastIndexOf(".gif");
            image = image.substring(0, n) + "_" + size + image.substring(n);
        }
        return image;
    } else {
        return "https://cdn.shopify.com/s/images/admin/no-image-large.gif?da5ac9ca38617f8fcfb1ee46268f66d451ca66b4";
    }
}

export function getID(string){
    if (!string) return null;
    try {
        var index = string.split("/").length-1;
        string = string.split("/")[index];
    } catch (e) { }
    return string;
}

export function EmptySection({ heading, action, image, secondaryAction, children}){
    return (
        <Card sectioned>
            <EmptyState
                heading={heading}
                action={action}
                image={image?"https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png":null}
                imageContained={image?true:false}
                secondaryAction={secondaryAction}
            >
                {children}
            </EmptyState>
        </Card>
    )
}

export function GetShop(){
    return store("shop");
}