import { v4 as uuidv4 } from 'uuid';

class UUID{
    short(){
        return uuidv4().split("-")[0].replace(/-/g,"");
    }
    uid(){
        return uuidv4();
    }
    id(){
        return uuidv4().replace(/-/g,"");
    }
}

export default new UUID;