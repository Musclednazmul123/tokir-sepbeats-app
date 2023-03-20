
class samples_table {
    model = "Samples";
    fields = {
        pack_id:{
            type: String,
            default: null
        },
        sample_id:{
            type: String,
            default: null
        },
        filesUrl: {
            type: String,
            default: null
        },
        status: {
            type: String,
            default: "active"
        },
        metafield: {
            type: Object,
            default: {}
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
  
  export default new samples_table;