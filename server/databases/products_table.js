
class products_table {
      model = "Products";
      fields = {
          shop: {
            type: String,
            required: true,
          },
          pack_id:{
            type: String,
            default: null
          },
          genre: {
            type: String,
            default: null
          },
          image_src: {
            type: String,
            default: null
          },
          created_at: {
            type: Date,
            default: new Date()
          },
          updated_at: {
            type: Date,
            default: null
          }
      };
    }

    export default new products_table;