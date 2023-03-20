import Model from '../app/Model.js';
import table from '../databases/shop_table.js';

class Shops extends Model{
  constructor(){
    super(table);
  }
}

export default new Shops;