const QUESTION1 = `list the recent valuable project airdrops and the specific steps to participate in them`;
const QUESTION2 = `generate investment summary for solana`;
const QUESTION3 =
  `Provide me the Total Value Locked (TVL) of the project contract at address 0x7a250d5630b4cf539739df2c5dacb4c659f2488d, its recent inflow and outflow of funds, and any recent news regarding the project`.toLowerCase();
const QUESTION4 = `Provide me with the most active DApps on the Ethereum blockchain in the past month, along with a summary analysis of their activity`.toLowerCase();

const ANSWER1 = `
In the past week, we've identified three notable project airdrops, namely:
* [ ] **Starknet**  \n **Starknet** is set to revolutionize layer 2 solutions on Ethereum.
* [ ] **ZkSync**  \n **ZkSync** is pioneering zkRollups for scalability.
* [ ] **LayerZero**  \n **LayerZero** is creating a cross-chain interoperability protocol.   \n There are few crucial steps to follow:  \n1.Visit the official LayerZero website at www.layerzero.com.  \n2.Create a unique blockchain address through a trusted browser plug-in wallet or a secure script.  \n3.Engage with the LayerZero community by completing at least three transfers and acquiring an NFT from their ecosystem.   \n4.Ensure all these operations are completed before August 30th to be eligible for the snapshot and ultimately, the airdrop.
`;

const ANSWER2 = `
* Extremely cheap fees: (<$0.05)and fast transaction finality when compared to other leading amart contract platforms

* Incredibly well-funded project.

* Easy-to-use wallet and beginner:friendly UI helping to onboard crypto nevices.

* FTW collapse has strong mid-term negative effect on Solana price.

***

- High barrier to become validator due to hardware requirements and ongoing costs to maintain ($40.000-595.000 per year) lead to network centralization.

- "Monolithic laver:one" design, white highly performant now will struggle to seale into the millions of transactions per second.

- Network uptime and reliability suffer, including once shutting down the network completely for 17 hours.
`;
const ANSWER3 = `
The contract address you've provided corresponds to the project **Uniswap**. At present, Uniswap's Total Value Locked (TVL) stands at an impressive **150,000 ETH**. There has been a net inflow of **10,000 ETH** and an outflow of **5,000 ETH** in the past month. Recently, Uniswap has garnered media attention due to their upcoming v3 upgrade which is anticipated to significantly enhance their protocol's performance, and a strategic partnership with 'XYZ' to enable more liquidity options on their platform. You can read more about these events [here](https://etherscan.io) and [here](https://etherscan.io/txs).

\`\`\`chart
{
  "title": ["Uniswap"],
  "subtitle": "Insights into the project",
  "charts": [
    {
      "type": "lineBar",
      "col": 12,
      "data": 15000
    },
    {
        "type": "line",
        "col": 12,
        "data": [
          {
            "x": "2021-01-01",
            "inflow": 100000,
            "outflow": 50000
          },
          {
            "x": "2021-02-01",
            "inflow": 200000,
            "outflow": 100000
          },
          {
            "x": "2021-03-01",
            "inflow": 300000,
            "outflow": 200000
          },
          {
            "x": "2021-04-01",
            "inflow": 400000,
            "outflow": 300000
          },
          {
            "x": "2021-05-01",
            "inflow": 500000,
            "outflow": 400000
          },
          {
            "x": "2021-06-01",
            "inflow": 600000,
            "outflow": 500000
          },
          {
            "x": "2021-07-01",
            "inflow": 700000,
            "outflow": 600000
          }
        ]
      }
  ]
}
\`\`\`
`;

const ANSWER4 = `
> Over the past month, the top three most active DApps were **DApp1**, **DApp2**, and **DApp3**  \n
**DApp1**  \n
Which is a DeFi platform, engaged 5000 users and recorded a trading volume of 1000 ETH.   \n
**DApp2**
A game built on Ethereum, engaged 4000 users and recorded a trading volume of 800 ETH. 
**DApp3**
A decentralized marketplace, engaged 3500 users and recorded a trading volume of 750 ETH.
\`\`\`chart
{
  "title": ["Uniswap"],
  "subtitle": "Insights into the project",
  "charts": [
    {
      "type": "lineBar",
      "col": 12,
      "data": 15000
    },
    {
        "type": "line",
        "col": 12,
        "data": [
          {
            "x": "2021-01-01",
            "inflow": 100000,
            "outflow": 50000
          },
          {
            "x": "2021-02-01",
            "inflow": 200000,
            "outflow": 100000
          },
          {
            "x": "2021-03-01",
            "inflow": 300000,
            "outflow": 200000
          },
          {
            "x": "2021-04-01",
            "inflow": 400000,
            "outflow": 300000
          },
          {
            "x": "2021-05-01",
            "inflow": 500000,
            "outflow": 400000
          },
          {
            "x": "2021-06-01",
            "inflow": 600000,
            "outflow": 500000
          },
          {
            "x": "2021-07-01",
            "inflow": 700000,
            "outflow": 600000
          }
        ]
      }
  ]
}
\`\`\`
`;

export const DEFAULT_ANSWER = `We appreciate your question! Sadly, our system isn't able to provide an answer at the moment. Please be assured, we've recorded your query and our committed team is addressing it. As we refine our system, we'll be equipped to answer such questions in the future. We truly value your patience.

We'd love to invite you to join our lively community at [Website URL]. There, you can help us identify more unanswered questions, or help answer some for the community. As a bonus, you could earn our ecological tokens! Your contribution could greatly impact our services. We'd be thrilled to see you there!`;

export const questionMapping = {
  [QUESTION1]: ANSWER1,
  [QUESTION2]: ANSWER2,
  [QUESTION3]: ANSWER3,
  [QUESTION4]: ANSWER4,
};
