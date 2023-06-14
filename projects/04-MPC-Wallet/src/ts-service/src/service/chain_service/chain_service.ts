import {BigNumberish, Bytes, BytesLike, ethers} from "ethers";
import { DataSource } from "typeorm"
import {User_address} from "../../entity";
import {returnResponse} from "../../utils";

export class ChainService{
    constructor(readonly wallet:ethers.Wallet,
                readonly tokenPaymaster:ethers.Contract,
                readonly simpleAccountFactory:ethers.Contract,
                readonly entryPoint:ethers.Contract,
                readonly orm:DataSource,
                private readonly accountOwnerAddress:string,
                ) {}

    CreateAccount = async (owner_address:any)=>{

        let resp:any

        try {

            let count = await this.orm.getRepository(User_address).createQueryBuilder("user_address").
            where("user_address.account_owner_address=:param1",{param1:owner_address.owner_address}).getCount()
            if (count >= 1){
                resp = returnResponse("","该账号已经创建了子账号,无法重复创建")
                return  resp
            }

            await this.simpleAccountFactory.createAccount(owner_address.owner_address,123456);
            let address = await this.simpleAccountFactory.getAddress(owner_address.owner_address, 2);

            let userAddress = new User_address();
            userAddress.AccountOwnerAddress = owner_address.owner_address;
            userAddress.AccountChildAddress = address;

           let orm_resp = await this.orm.manager.insert(User_address,userAddress);


            resp = returnResponse(orm_resp.generatedMaps[0],"success")

        }catch (error){

            resp = returnResponse("",(error as Error).message)
        }

        return resp;
    }

    GetAccount = async (data:any)=>{

        let resp:any
        try {

            let query:string = data.query
            let params:string[] = query.split("?")
            let ownerAddress:string[] = params[1].split("=")

            let orm_resp = await this.orm.getRepository(User_address).
            createQueryBuilder("user_address").where("user_address.account_owner_address=:param1",{param1:ownerAddress[1]}).getMany();

            resp = returnResponse(orm_resp,"success")

        }catch (error){
            resp = returnResponse("",(error as Error).message)
        }
        return resp;
    }

    FundsTransfer  = async (data:string) =>{
         // from: 0x845AFB6c116532b5e5b7223819dA1746A00175E4
         //to: 0xaE17e14F70fE91C1374ff9f779F393051c17268C

        let resp:any;

        try {

            console.log(data)

           let tx = await this.entryPoint.handleOps([data],this.accountOwnerAddress)

            resp = returnResponse(tx.hash,"success")

        }catch (error){

            resp = returnResponse("",(error as Error).message)
        }

        return resp
    }
}