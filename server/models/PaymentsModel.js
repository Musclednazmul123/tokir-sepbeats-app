import Model from '../app/Model.js';
import table from '../databases/payments_table.js';

class PaymentsModel extends Model{
  constructor(){
    super(table);
  }
}

export default new PaymentsModel;