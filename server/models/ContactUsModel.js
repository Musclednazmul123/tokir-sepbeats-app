import Model from '../app/Model.js';
import table from '../databases/contact_us_table.js';

class ContactUsModel extends Model{
  constructor(){
    super(table);
  }
}

export default new ContactUsModel;