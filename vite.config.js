import react from "@vitejs/plugin-react";
import "dotenv/config";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.HOST": JSON.stringify(process.env.HOST),
    "process.env.API_PASSWORD": JSON.stringify(process.env.API_PASSWORD),
  },
  plugins: [react()],
};
