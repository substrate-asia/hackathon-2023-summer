import {Message} from "../utils"
import IServerInvoker from '@dapr/dapr/interfaces/Server/IServerInvoker';
import {HttpMethod} from "@dapr/dapr";
import {DataSource} from "typeorm"
import {WalletService} from "../service/wallet_service";

export class wallet{

    constructor(
                private readonly rom:DataSource,
                private readonly _invoker: IServerInvoker
        ) {}

    router = async () => {

        const walletService = new WalletService(this.rom)

        await this._invoker.listen("wallet/sendEmail",async (data: any)=>{
            let body = JSON.parse(data.body)
            return new Message(await walletService.SendEmail(body)).Success();
        },{ method: HttpMethod.POST })
        await this._invoker.listen("wallet/verifyEmail",async (data: any)=>{
            let body = JSON.parse(data.body)
            return new Message(await walletService.VerifyEmail(body)).Success();
        },{ method: HttpMethod.POST })
        await this._invoker.listen("wallet/saveWallet",async (data: any)=>{
            let body = JSON.parse(data.body)
            return new Message(await walletService.SaveWalletAddress(body)).Success();
        },{ method: HttpMethod.POST })
        await this._invoker.listen("wallet/getUserAllWallet",async (data: any)=>{
            let body = JSON.parse(data.body)
            return new Message(await walletService.GetUserAllWallet(body)).Success();
        },{ method: HttpMethod.POST })
    }


}