import {DataSource} from "typeorm";
import {SendEmail,GetCode,IsEmail} from "../../utils";
import {returnResponse} from "../../utils";
import {RedisClient} from "../../config";
import {Users} from "../../entity/User";
import {UserWallets} from "../../entity/user_wallets";

export class WalletService{

    constructor(readonly orm:DataSource) {}

    SendEmail = async(data:any)=> {

        console.log(data.email);

        let resp:any;

        if (!data.email){
            resp = returnResponse("","邮箱不存在!")
            return resp
        }

        if (!IsEmail(data.email)){
            resp = returnResponse("","邮箱格式错误!")
            return resp
        }

        try {
            let status = 0; //0:默认未验证
            let userCount =  await this.orm.getRepository(Users).
            createQueryBuilder("users").where("users.email=:params1",{"params1":data.email}).getCount();
            if (userCount > 0){
                status = 1   //表示已经验证通过
            }

            let uwCount =  await this.orm.createQueryBuilder().from(UserWallets,"uw")
                .leftJoin(Users,"users","users.id = uw.user_id")
                .where("users.email=:params1",{"params1":data.email}).getCount();
            if (uwCount > 0){
                status = 2 //表示已经有绑定钱包和ipfs数据
            }

            let code = GetCode(6)

            await RedisClient.setEx("email_ver:"+data.email, 300, code)

            // SendEmail(data.email,"wallet验证码",code.toString())

            resp = returnResponse({user_status:status},"邮件发送成功!")

        }catch (error){
            resp = returnResponse("",(error as Error).message)
        }

        return resp
    }

    VerifyEmail = async(data:any)=>{

        let resp:any;

        let code = await RedisClient.get("email_ver:"+data.email)

        if (!data.email){
            resp = returnResponse("","邮箱不存在!")
            return resp
        }
        if (!IsEmail(data.email)){
            resp = returnResponse("","邮箱格式错误!")
            return resp
        }

        if (!code){
            resp = returnResponse("","验证码失效!")
            return resp
        }
        if (code != data.code){
            resp = returnResponse("","验证码错误!")
            return resp
        }

        let u:Users | null =  await this.orm.getRepository(Users).
        createQueryBuilder("users").where("users.email=:params1",{"params1":data.email}).getOne();
        if (u!= null && Number(u.id) > 0){
            resp = returnResponse({"id":u.id},"邮箱已存在!");
            return resp
        }

        let user = new Users()
        user.Email = data.email

       let userResp =  await this.orm.manager.insert(Users,user);

        resp = returnResponse({"id":userResp.generatedMaps[0].id,"email":data.email},"邮箱认证成功!")
        return resp
    }

    SaveWalletAddress = async(data:any)=>{

        let code = await RedisClient.get("email_ver:"+data.email)

        let resp:any;

        if (!code){
            resp = returnResponse("","验证码失效!")
            return resp
        }
        if (code != data.code){
            resp = returnResponse("","验证码错误!")
            return resp
        }
        if (!data.user_id){
            resp = returnResponse("","用户不存在!");
            return resp
        }

        if (!data.wallet_address){
            resp = returnResponse("","wallet_address不能为空!");
            return resp
        }
        if (!data.ipfs_address){
            resp = returnResponse("","ipfs_address不能为空!");
            return resp
        }

        let count =  await this.orm.getRepository(Users).
        createQueryBuilder("users").where("users.id=:params1",{"params1":data.user_id}).getCount();
        if (count < 1){
            resp = returnResponse("","用户不存在!");
            return resp
        }

        let userWallet =  new UserWallets()
        userWallet.UserId =data.user_id;
        userWallet.WalletAddress = data.wallet_address;
        userWallet.IpfsAddress = data.ipfs_address;

        let uwResp =  await this.orm.manager.insert(UserWallets,userWallet);

        resp = returnResponse({"id":uwResp.identifiers[0].id},"数据保存成功");
        return resp;
    }

    GetUserAllWallet = async(data:any) =>{

        let code = await RedisClient.get("email_ver:"+data.email)

        let resp:any;

        if (!code){
            resp = returnResponse("","验证码失效!");
            return resp;
        }
        if (code != data.code){
            resp = returnResponse("","验证码错误!");
            return resp;
        }

        let uwResp =  await this.orm.createQueryBuilder().from(UserWallets,"uw")
            .leftJoin(Users,"users","users.id = uw.user_id")
            .where("users.email=:params1",{"params1":data.email}).getRawMany();


        let wallets = []

        for (let i=0;i<uwResp.length;i++){

            let wallet_ipfs = {ipfs_address:uwResp[i].ipfs_address,wallet_address:uwResp[i].wallet_address}
            wallets.push(wallet_ipfs)
        }

        resp = returnResponse(wallets,"success");

        return resp;
    }
}