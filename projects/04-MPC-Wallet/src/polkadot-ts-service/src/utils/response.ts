import { ResultList } from '../entity/vo';

export class Message {
    constructor(private readonly _data: any) { }
    // 普通消息封装
    Success = async () => {
        let res: ResultList = new Object as ResultList;
        // console.log('Message::',this._data);
        if (this._data == null || this._data.error ){
            if (this._data == null ){
                return this.Faild('data is null')
            }else{
                return this.Faild(this._data);
            }
        }
        else if (this._data.count) {
            // list of items
            // console.log('count::',this._data);
            res.extendData = this._data.count;
            res.content = this._data.data;
        }
        else if (this._data.identifiers) {
            // save
            // console.log('identifiers::',this._data);
            res.auto_increment_id = this._data.identifiers[0];
        }
        else if (this._data.affected) {
            // update delete
            // console.log('affected::',this._data);
            res.auto_increment_id = this._data.affected;
        }
        else {
            // query
            console.log('query::',this._data);
            res.content = this._data;
        }
        return res;
    }

    Faild = async (message: any) => {
        let res: ResultList = new Object as ResultList;
        res.errorMsg = message;
        return res;
    }
    // 波卡消息封装
    Polkadot = async () => {
        // console.log(this._data.extrinsic_hash,this._data.output);
        if (this._data.extrinsic_hash || this._data.output){
            let res: ResultList = new Object as ResultList;
            res.content = this._data;
            return res;
        }else{
            return this.Faild(this._data);
        }
    }
}