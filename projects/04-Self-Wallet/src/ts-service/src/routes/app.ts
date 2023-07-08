import { HttpMethod } from '@dapr/dapr';
import IServerInvoker from '@dapr/dapr/interfaces/Server/IServerInvoker';
import { UserService}  from '../service/user_service';
import { Message } from '../utils';
import { DataSource } from "typeorm"
export class App {
    constructor(private readonly _orm:DataSource,private readonly _invoker: IServerInvoker) { }
    // 路由配置
    routes = async () => {
        const user_service = new UserService(this._orm);
        await this._invoker.listen("user/query", async (data: any) => {
            let body = JSON.parse(data.body);
            return new Message(await user_service.Query(body)).Success();
        }, { method: HttpMethod.POST });

        await this._invoker.listen("user/save", async (data: any) => {
            let body = JSON.parse(data.body);
            return new Message(await user_service.Save(body)).Success();
        }, { method: HttpMethod.POST });

        await this._invoker.listen("user/update", async (data: any) => {
            let body = JSON.parse(data.body);
            return new Message(await user_service.Update(body)).Success();
        }, { method: HttpMethod.POST });

        await this._invoker.listen("user/del", async (data: any) => {
            let body = JSON.parse(data.body);
            return new Message(await user_service.Delete(body)).Success();
        }, { method: HttpMethod.POST });

        await this._invoker.listen("user/list", async (data: any) => {
            let body = JSON.parse(data.body);
            return new Message(await user_service.List(body)).Success();
        }, { method: HttpMethod.POST });
    }
}
