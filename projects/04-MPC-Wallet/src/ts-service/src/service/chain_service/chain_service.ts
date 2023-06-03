import {BigNumberish, BytesLike, ethers} from "ethers";
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

    GetAccount = async (owner_address:any)=>{

        let resp:any
        try {

            let orm_resp = await this.orm.getRepository(User_address).
            createQueryBuilder("user_address").where("user_address.account_owner_address=:param1",{param1:owner_address.owner_address}).getMany();

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
        class UserOperation{
            sender!: string;
            nonce!: BigNumberish;
            initCode!: BytesLike;
            callData!: BytesLike;
            callGasLimit!: BigNumberish;
            verificationGasLimit!: BigNumberish;
            preVerificationGas!: BigNumberish;
            maxFeePerGas!: BigNumberish;
            maxPriorityFeePerGas!: BigNumberish;
            paymasterAndData!: BytesLike;
            signature!: BytesLike;
        }

        try {
            let userOperation = new UserOperation();

            Object.assign(userOperation,data)

            this.entryPoint.handleOps([data],this.accountOwnerAddress)

            resp = returnResponse("","success")

        }catch (error){

            resp = returnResponse("",(error as Error).message)
        }

        return resp
    }
}