// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type AppAdvertiseProps = Omit<AppAdvertise, NonNullable<FunctionPropertyNames<AppAdvertise>>>;

export class AppAdvertise implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public ownerId: string;

    public unionId?: string;

    public assetId?: string;

    public tag: string;

    public area?: string;

    public ver?: number;

    public ext_1?: string;

    public ext_2?: string;

    public body: string;

    public blockHash: string;

    public extrinsicHash: string;

    public blockHeight: number;

    public signer?: string;

    public fee?: string;

    public relatedAccounts?: string[];

    public createDate: Date;

    public updateDate: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AppAdvertise entity without an ID");
        await store.set('AppAdvertise', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AppAdvertise entity without an ID");
        await store.remove('AppAdvertise', id.toString());
    }

    static async get(id:string): Promise<AppAdvertise | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AppAdvertise entity without an ID");
        const record = await store.get('AppAdvertise', id.toString());
        if (record){
            return this.create(record as AppAdvertiseProps);
        }else{
            return;
        }
    }



    static create(record: AppAdvertiseProps): AppAdvertise {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
