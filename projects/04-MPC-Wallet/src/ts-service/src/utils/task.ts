import {RedisClient,config} from "../config";
import {ethers} from "ethers";

export const TradeTrade = async (entryPoint:ethers.Contract,accountOwnerAddress:string) =>{
    console.log("批量交易定时任务初始化成功!")
    setInterval(async function (){
        //获取redis中所有任务
        let tasks = await RedisClient.lRange("trade_trade",0,-1)

        let taskArr:any[] = []

        if (tasks.length > 0){
            tasks.forEach(function (task){

                let val = JSON.parse(task)

                taskArr.push(val)

                RedisClient.LREM(config.redis.task_trade!,1,task)
            })
        }

        if (taskArr.length > 0){
            let tx = await entryPoint.handleOps(taskArr,accountOwnerAddress);
            console.log("tx.hash = "+ tx.hash);
        }
    },6000)
}
