
class payments_table {
  model = "Payments";
  fields = {
    shop: {
      type: String,
      required: true,
      unique: true
    },
    charge_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    test: {
      type: Boolean,
      default: false
    },
    activated_on: {
      type: Date,
      default: null
    },
    cancelled_on: {
      type: Date,
      default: null
    },
    trial_days: {
      type: Number,
      default: 7
    },
    trial_ends_on: {
      type: Date,
      default: null
    },
    updated_at: {
      type: Date,
      default: null
    },
    created_at: {
      type: Date,
      default: new Date()
    }
  };
}

export default new payments_table;