import dotenv from 'dotenv'
dotenv.config({ path: '.env' }) //config()中是配置.env文件的位置，如果在根目录，此处括号中可以留空
import { User_address } from "../entity"

export const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  dapr: {
    host: process.env.DAPR_HOST,
    port: process.env.DAPR_PORT,
  },
  node: {
    url: process.env.NODE_URL,
  },
  address: {
    u8a1: [
      188, 189, 185, 2, 104, 42, 154, 185,
      236, 105, 80, 231, 56, 230, 172, 80,
      137, 10, 159, 96, 97, 36, 64, 80,
      254, 91, 110, 152, 185, 58, 226, 59
    ],
    order_prefix: "oasis_ovo_order",
    checkSeed: "oasis-dex", // 使用官方 min erc721 需要验证指纹
  },
  orm: {
    type: process.env.ORM_TYPE,
    host: process.env.ORM_HOST,
    port: process.env.ORM_PORT,
    username: process.env.ORM_USERNAME,
    password: process.env.ORM_PASSWORD,
    database: process.env.ORM_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User_address],
    migrations: [],
    subscribers: [],
  },
  pubsub:{
    pubsubname: process.env.PUBSUBNAME,
    topic_contract: process.env.TOPIC_CONTRACT,
  },
  chain:{
    owner_privateKey: process.env.OWNER_PRIVATEKEY,
    chain_url: process.env.CHAIN_URL
  }
}