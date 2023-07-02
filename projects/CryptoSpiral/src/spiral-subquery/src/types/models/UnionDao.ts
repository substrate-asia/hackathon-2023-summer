// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type UnionDaoProps = Omit<UnionDao, NonNullable<FunctionPropertyNames<UnionDao>>>;

export class UnionDao implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public myAssetId: string;

    public payAssetId?: string;

    public desp: string;

    public deadline?: number;

    public stakAccountId: string;

    public depositedAccountId: string;

    public min: bigint;

    public max: bigint;

    public keepRate: bigint;

    public fund: bigint;

    public earnAcc: bigint;

    public status?: number;

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
        assert(id !== null, "Cannot save UnionDao entity without an ID");
        await store.set('UnionDao', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove UnionDao entity without an ID");
        await store.remove('UnionDao', id.toString());
    }

    static async get(id:string): Promise<UnionDao | undefined>{
        assert((id !== null && id !== undefined), "Cannot get UnionDao entity without an ID");
        const record = await store.get('UnionDao', id.toString());
        if (record){
            return this.create(record as UnionDaoProps);
        }else{
            return;
        }
    }



    static create(record: UnionDaoProps): UnionDao {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
