## 📝 Project Structure

The project CBIndex is composed of both parts to best serve the users. Ideally, users can use the App to build and manage their crypto index funds, analyze the market with index indicators and tools, learn and practice fund management or fund investment with the fund simulator, practice copy-investing with the copy-investing simulator, and then use the DApp to copy-investing or invest in crypto funds in the real market.

https://dapp.cbindex.finance/ is the demo of CBIndex DApp (fully built on the blockchain), which has the copy-investing feature now. The mutual fund (active fund and index fund) investment feature will be added.

https://app.cbindex.finance/ is CBIndex App (mainly built on the centralized server), which has a crypto index fund building and management feature, a mutual fund (active fund and index fund) creation and investment simulator, a copy-investing simulator, and various analysis tools for crypto investment.

## Overall Presentation
- Deck: https://docsend.com/view/wd2hbcfzt7tmw582
- Demo video: https://www.youtube.com/watch?v=m_v9qnvWXXg

## Components
- **Blockchain Infrastructure:** CBIndex leverages blockchain's decentralization, security, and transparency. It is initially built on the Ethereum network and is planned to be deployed on multiple blockchains. As for the hackathon, we are building on **VARA**.
- **Smart Contracts (CBI Protocol):** At the core of the CBIndex platform, a suite of smart contracts collectively referred to as the CBI Protocol powers various on-chain functionalities. These include copy-investing, active and index fund management and investing, and more. The contracts are responsible for the secure and transparent execution of all on-chain operations.
- **DEX Aggregators:** CBIndex integrates with decentralized exchange (DEX) aggregators like 1inch to fetch the best possible trading price from the market. DEX aggregators play a crucial role in facilitating optimal trading strategies.
- **Centralized Infrastructure:** Some features of CBIndex, such as index construction and investment simulators, are built on centralized infrastructure. These features rely on centralized data and business logic, providing users additional tools and resources to aid their investment decision-making.
- **User Interface:** The CBIndex platform also includes a user-friendly interface designed to make complex investment processes simple and intuitive. This component involves everything from user authentication, fund discovery, and investment tracking to the visual representation of complex data.
- **Backend Services:** The backend services of CBIndex include listening to blockchain events, handling off-chain data, sending notifications to users, and more.
- **Security Measures:** Given the sensitive nature of financial data and transactions, robust security measures are in place to ensure the safety of users' funds and information. These include rigorous contract auditing, implementation of secure design principles, and continuous monitoring.

## Build & Test

**Build a contract with `make`:**

```bash
make build
```
**Run tests:**

```bash
make test
```

**deploy contracts to test-net**

Use `gear-js` api upload program or use `https://idea.gear-tech.io/` to upload with `meta.txt`. Steps as follow:
1. Upload storage.wasm or storage.opt.wasm to test-net. and get program hash for next step.
2. Upload `vault.wasm`, fill `storage_code_hash` and `share_code_hash` with storage program hash we got in step 1. get vault program hash for net step.
3. Upload `entry.wasm`, fill  fill `storage_code_hash` and `share_code_hash` with storage program hash in step 1, fill `ft_logic_code_hash` we got in step2. 

Test transactions:
1. Mint some tokens with `Message -> Mint.`
2. Follow this contract with `Message -> Follow,` and you will get a message if any `Invest` event happens.
3. Invest some token to any address with `Message -> Invest.`
4. go to your mailbox to check your message.



## Intraction

The linked videos show how to interact with CBIndex App. 
- Demo video: https://www.youtube.com/watch?v=m_v9qnvWXXg
