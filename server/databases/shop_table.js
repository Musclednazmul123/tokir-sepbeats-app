
class shops_table {
  model = "Shops";
  fields = {
      shop: {
        type: String,
        required: true,
        unique: true
      },
      info: {
        type: Object,
        default: {}
      },
      session: {
        type: Object,
        default: {}
      },
      access_token: {
        type: String,
        default: null
      },
      access_scope: {
        type: String,
        default: null
      },
      setup_help: {
        type: Boolean,
        default: true
      },
      setup_help_point: {
        type: Number,
        default: 1
      },
      status: {
        type: String,
        default: "active"
      },
      created_at: {
        type: Date,
        default: new Date()
      },
      uninstalled_at: {
        type: Date,
        default: null
      },
      updated_at: {
        type: Date,
        default: null
      }
  };
}

export default new shops_table;