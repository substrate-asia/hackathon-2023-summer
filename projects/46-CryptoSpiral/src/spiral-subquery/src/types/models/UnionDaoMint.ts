// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type UnionDaoMintProps = Omit<UnionDaoMint, NonNullable<FunctionPropertyNames<UnionDaoMint>>>;

export class UnionDaoMint implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId: string;

    public myAssetId: string;

    public daoId: string;

    public depositedAccountId: string;

    public amountTotal: bigint;

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
        assert(id !== null, "Cannot save UnionDaoMint entity without an ID");
        await store.set('UnionDaoMint', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove UnionDaoMint entity without an ID");
        await store.remove('UnionDaoMint', id.toString());
    }

    static async get(id:string): Promise<UnionDaoMint | undefined>{
        assert((id !== null && id !== undefined), "Cannot get UnionDaoMint entity without an ID");
        const record = await store.get('UnionDaoMint', id.toString());
        if (record){
            return this.create(record as UnionDaoMintProps);
        }else{
            return;
        }
    }



    static create(record: UnionDaoMintProps): UnionDaoMint {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
