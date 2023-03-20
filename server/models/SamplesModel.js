import Model from '../app/Model.js';
import table from '../databases/samples_table.js';

class SamplesModel extends Model{
  constructor(){
    super(table);
  }
}

export default new SamplesModel;