import {Message} from "../utils"
import IServerInvoker from '@dapr/dapr/interfaces/Server/IServerInvoker';
import {ChainService} from "../service/chain_service";
import {HttpMethod} from "@dapr/dapr";
import {ethers} from "ethers";
import {DataSource} from "typeorm"

export class Chain{
    constructor(private readonly wallet:ethers.Wallet,
                private readonly accountOwnerAddress :string,
                private readonly tokenPaymaster:ethers.Contract,
                private readonly simpleAccountFactory:ethers.Contract,
                private readonly entryPoint:ethers.Contract,
                private readonly rom:DataSource,
                private readonly _invoker: IServerInvoker) {}

    //路由配置
    router = async () => {
        const chain_service = new ChainService(
            this.wallet,
            this.tokenPaymaster,
            this.simpleAccountFactory,
            this.entryPoint,
            this.rom,
            this.accountOwnerAddress)
        await this._invoker.listen("/createUser",async (data: any)=>{
            let body = JSON.parse(data.body)
            return new Message(await chain_service.CreateAccount(body)).Success();
        },{ method: HttpMethod.POST })

        await this._invoker.listen("chain/getUser",async (data:any) =>{
            let body = JSON.parse(data.body);
            return new Message(await chain_service.GetAccount(body)).Success();
        },{method:HttpMethod.GET})
        await this._invoker.listen("chain/fundsTransfer",async (data:any)=>{
            let body = JSON.parse(data.body)
            return new Message(await chain_service.FundsTransfer(body)).Success();
        },{method:HttpMethod.POST})
    }
}