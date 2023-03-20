import getRawBody from 'raw-body'
import crypto from "crypto"

export default async function (req, res, next) {
    console.log("Verifying request at", req.originalUrl);
    // We need to await the Stream to receive the complete body Buffer
    const body = await getRawBody(req)
    // Get the header from the request
    const hmacHeader = req.headers['x-shopify-hmac-sha256']
    // Digest the data into a hmac hash
    const digest = crypto
        .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
        .update(body)
        .digest('base64');
    console.log("HMAC", hmacHeader, "digest", digest);
    // Compare the result with the header
    if (digest === hmacHeader) {
        // VALID - continue with your tasks
        console.log("Valid request from shopify server");
        next();
    } else {
        // INVALID - Respond with 401 Unauthorized
        console.log("Invalid request. Seems this is not from shopify endpoint");
        res.status(401).end();
    }
}