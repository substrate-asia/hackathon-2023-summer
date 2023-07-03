// Dandelion 项目介绍
import {
  FaTwitter as Twitter,
  FaDiscord as Discord,
  FaTelegram as Telegram,
  FaGithub as Github,
  FaYoutube as Youtube,
} from "react-icons/fa";
import { Address } from "wagmi";
import AirDrops0 from "./AirDrops0.json";
import AirDrops1 from "./AirDrops1.json";
import AirDrops2 from "./AirDrops2.json";

type AirDrop = {
  id: number;
  type: string;
  airtoken: string;
  logo: string;
  name: string;
  title: string;
  desc: string;
  rules: string[];
  startblock: number;
  endblock: number;
  StakeToken: Address;
  AIToken: Address;
};

const AIR_DROPS_0 = AirDrops0 as unknown as AirDrop[];
const AIR_DROPS_1 = AirDrops1 as unknown as AirDrop[];
const AIR_DROPS_2 = AirDrops2 as unknown as AirDrop[];

const DANDELION_DESC = [
  {
    title: "去中心化空投社区",
    desc: "Dandelion 是一个基于Polkadot构建的去中心化可复用空投发射平台，以优异的链上经济模型为驱动，打造一个高粘性高活跃度的Polkadot社区中心，有效黏合社区用户与项目方，深度挖掘空投模式的潜力，使得各方利益最大化、成本最小化。",
  },
  {
    title: "定制化空投",
    desc: "丰富的空投规则，有助于项目方快速发展自己的用户群，同时将女巫攻击的影响降至最低，更高推广效率、更低推广成本，让优秀的项目顺利出圈。",
  },
  {
    title: "Polkadot原生社区",
    desc: "以优质的Polkadot生态发展内容，丰富多彩的社区活动，激动人心的空投奖励以及优异的链上经济模型，吸引更多忠实用户加入Polkadot生态，热爱Polkadot生态，并最终促进Polkadot生态更加繁荣。",
  },
  {
    title: "活跃度+互动",
    desc: "项目方可不定期在Dandelion社区组织开展丰富链上活动（抽奖、推特互动、NFT发放等），提高用户好感度，打造有温度的项目社群，Dandelion社区用户则可以通过参加各类链上活动，提高社区活跃度，成为社区明星，并增加获取的空投奖励份额。",
  },
];

// partners
const PARTNERS: string[] = [];
const NavLinks = [
  {
    id: "home",
    title: "Home",
    path: "/",
  },
  {
    id: "airdrop",
    title: "Airdrop",
    path: "/list",
  },
  // {
  //   id: "assets",
  //   title: "Assets",
  // },
];

const SOCIAL = [
  {
    name: "Twitter",
    href: "xxx",
    icon: Twitter,
  },
  {
    name: "Discord",
    href: "xxxx",
    icon: Discord,
  },
  {
    name: "Telegram",
    href: "xxxx",
    icon: Telegram,
  },
  {
    name: "GitHub",
    href: "https://github.com/AstarNetwork",
    icon: Github,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/AstarNetwork",
    icon: Youtube,
  },
];

export {
  PARTNERS,
  DANDELION_DESC,
  NavLinks,
  SOCIAL,
  AIR_DROPS_0,
  AIR_DROPS_1,
  AIR_DROPS_2,
};
export type { AirDrop };
