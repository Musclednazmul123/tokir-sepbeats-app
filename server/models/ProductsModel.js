import Model from '../app/Model.js';
import table from '../databases/products_table.js';

class ProductsModel extends Model{
  constructor(){
    super(table);
  }
}

export default new ProductsModel;