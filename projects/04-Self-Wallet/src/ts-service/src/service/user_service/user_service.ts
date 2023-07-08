import { DataSource } from "typeorm"
import { User_address } from "../../entity"

export class UserService {
    constructor(private readonly _db: DataSource) {}
    Query = async (body: any) => {
        // const users = await this._db.manager.find(User_address)
        const uuid = body.id;
        const users = await this._db
        .getRepository(User_address)
        .createQueryBuilder("user")
        // .select()
        // .from(User_address, "user")
        .where("user.id = :uuid",{ uuid: uuid})
        .getOne();
        return users;
    }

    Save = async (body: any) => {
        const user =new User_address();
        // user.UserName = body.user_name;
        // user.Password = body.password;
        return await this._db.manager.insert(User_address,user);
    }

    Update = async (body: any) => {
        const uuid = body.id;
        const user =new User_address();
        // user.UserName = body.user_name;
        // user.Password = body.password;
        return await this._db.manager.update(User_address, uuid, user);
    }

    Delete = async (body: any) => {
        const ids = body.ids as string[];
        // 假删除
       return await this._db.manager.softDelete(User_address, ids);
    }

    List = async (body: any) => {
        const uuid = body.age;
        const data = await this._db.manager
        .getRepository(User_address)
        .createQueryBuilder("user")
        .where("user.age = :uuid",{ uuid: uuid});
        // 总数
        let count = await data.getCount();
        let user = await data.getMany();
        return { count: count, data: user };
    }
}