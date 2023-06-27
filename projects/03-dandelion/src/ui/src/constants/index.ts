// Dandelion 项目介绍
import {
  FaTwitter as Twitter,
  FaDiscord as Discord,
  FaTelegram as Telegram,
  FaGithub as Github,
  FaYoutube as Youtube,
} from "react-icons/fa";

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

type AirDrop = {
  title: string;
  id: number;
  logo: string;
  desc?: string;
  rules?: string[];
};
const AIRDROPS: AirDrop[] = [
  {
    id: 1,
    title: "Moonbeam 突破 100 万用户,超级空投来袭!",
    logo: "",
    desc: `Moonbeam 作为 Polkadot 生态中的先锋平行链项目,经过不断努力终于在今天达到了 100 万用户这一重要里程碑。这标志着 Moonbeam 社区发展到了一个全新的阶段,更广泛的用户群体将共同见证 Moonbeam 的成长与发展。
  为了感谢社区长期以来的支持与信任,Moonbeam 项目组决定发起一场超级空投活动。本次空投总量高达 10万 glmr 代币,预计将惠及绝大部分 Dandelion 社区成员。
  
  此外, Moonbeam 项目方还准备了社区大奖抽取活动,总奖励高达 10000 glmr 代币!只需要参与本次空投即有机会获得大奖!
  Moonbeam 项目组衷心感谢所有支持者与社区成员长期以来的信任与陪伴。100 万用户只是起点,Moonbeam 将继续努力,推出更多惊喜与价值。让我们共同见证 Moonbeam 社区的快速发展与繁荣!`,
    rules: [
      "质押社区vetoken即可等比例领取glmr空投",
      "每个账号最多可质押1000vetoken",
      "本次共发放10万glmr代币空投，发完为止，先到先得",
    ],
  },
  {
    id: 2,
    title: "Moonbeam 突破 100 万用户,超级空投来袭!",
    logo: "",
    desc: `Moonbeam 作为 Polkadot 生态中的先锋平行链项目,经过不断努力终于在今天达到了 100 万用户这一重要里程碑。这标志着 Moonbeam 社区发展到了一个全新的阶段,更广泛的用户群体将共同见证 Moonbeam 的成长与发展。
  为了感谢社区长期以来的支持与信任,Moonbeam 项目组决定发起一场超级空投活动。本次空投总量高达 10万 glmr 代币,预计将惠及绝大部分 Dandelion 社区成员。
  
  此外, Moonbeam 项目方还准备了社区大奖抽取活动,总奖励高达 10000 glmr 代币!只需要参与本次空投即有机会获得大奖!
  Moonbeam 项目组衷心感谢所有支持者与社区成员长期以来的信任与陪伴。100 万用户只是起点,Moonbeam 将继续努力,推出更多惊喜与价值。让我们共同见证 Moonbeam 社区的快速发展与繁荣!`,
    rules: [
      "质押社区vetoken即可等比例领取glmr空投",
      "每个账号最多可质押1000vetoken",
      "本次共发放10万glmr代币空投，发完为止，先到先得",
    ],
  },
  {
    id: 3,
    title: "Moonbeam 突破 100 万用户,超级空投来袭!",
    logo: "",
    desc: `Moonbeam 作为 Polkadot 生态中的先锋平行链项目,经过不断努力终于在今天达到了 100 万用户这一重要里程碑。这标志着 Moonbeam 社区发展到了一个全新的阶段,更广泛的用户群体将共同见证 Moonbeam 的成长与发展。
  为了感谢社区长期以来的支持与信任,Moonbeam 项目组决定发起一场超级空投活动。本次空投总量高达 10万 glmr 代币,预计将惠及绝大部分 Dandelion 社区成员。
  
  此外, Moonbeam 项目方还准备了社区大奖抽取活动,总奖励高达 10000 glmr 代币!只需要参与本次空投即有机会获得大奖!
  Moonbeam 项目组衷心感谢所有支持者与社区成员长期以来的信任与陪伴。100 万用户只是起点,Moonbeam 将继续努力,推出更多惊喜与价值。让我们共同见证 Moonbeam 社区的快速发展与繁荣!`,
    rules: [
      "质押社区vetoken即可等比例领取glmr空投",
      "每个账号最多可质押1000vetoken",
      "本次共发放10万glmr代币空投，发完为止，先到先得",
    ],
  },
  {
    id: 4,
    title: "Moonbeam 突破 100 万用户,超级空投来袭!",
    logo: "",
    desc: `Moonbeam 作为 Polkadot 生态中的先锋平行链项目,经过不断努力终于在今天达到了 100 万用户这一重要里程碑。这标志着 Moonbeam 社区发展到了一个全新的阶段,更广泛的用户群体将共同见证 Moonbeam 的成长与发展。
  为了感谢社区长期以来的支持与信任,Moonbeam 项目组决定发起一场超级空投活动。本次空投总量高达 10万 glmr 代币,预计将惠及绝大部分 Dandelion 社区成员。
  
  此外, Moonbeam 项目方还准备了社区大奖抽取活动,总奖励高达 10000 glmr 代币!只需要参与本次空投即有机会获得大奖!
  Moonbeam 项目组衷心感谢所有支持者与社区成员长期以来的信任与陪伴。100 万用户只是起点,Moonbeam 将继续努力,推出更多惊喜与价值。让我们共同见证 Moonbeam 社区的快速发展与繁荣!`,
    rules: [
      "质押社区vetoken即可等比例领取glmr空投",
      "每个账号最多可质押1000vetoken",
      "本次共发放10万glmr代币空投，发完为止，先到先得",
    ],
  },
];
// partners
const PARTNERS: string[] = [];
const NavLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "airdrop",
    title: "Airdrop",
  },
  {
    id: "assets",
    title: "Assets",
  },
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

export { PARTNERS, DANDELION_DESC, AIRDROPS, NavLinks, SOCIAL };
export type { AirDrop };
