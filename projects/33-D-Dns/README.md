## basic information

Project name: D-DNS  

Project approval date (month and year): June 2023

## Project overall introduction
### Logo
![DomainChain-logo](./resource/DDNS.svg)

### Background
The Internet today is increasingly vulnerable to censorship, surveillance, and attacks. The centralization of Domain Name System (DNS) services has made it a prime target for hackers and other malicious entities. The result is an alarming number of DNS spoofing incidents, Distributed Denial of Service (DDoS) attacks, and instances of censorship, among other security threats. 

Existing DNS resolution services are failing to address three major pain points: 

- Single point of failure: A central authority controls traditional DNS services, making them vulnerable to attacks and outages.
- Data integrity issues: DNS entries can be tampered with or manipulated, resulting in DNS spoofing or other cybersecurity threats. 
- Lack of transparency and user control: Users must trust third-party service providers to handle their DNS queries accurately and securely, giving them little control over their internet browsing experience. 

### Introduction
D-DNS is an innovative project designed to overcome these challenges by leveraging blockchain technology and a distributed network of DEP nodes. By decentralizing DNS resolution services, D-DNS empowers users to interact with the Internet safely, efficiently, and reliably. 

Our project introduces several groundbreaking features: 

- Decentralized Domain Resolution: Utilizes a distributed network of DEP nodes to provide stable and flexible DNS resolution services, mitigating the risk of single points of failure.
- Blockchain-Backed Data Integrity: Stores DNS entries on a transparent, tamper-proof blockchain ledger, enhancing data security and integrity during DNS resolution.
- Enhanced User Control: Empowers users with control over their DNS resolution process, promoting an internet environment where privacy is respected, and control is in the hands of users.
- Edge DNS Resolution: Incorporates edge computing to speed up DNS resolution and provide users with accurate and unfiltered DNS resolution with minimal latency.
- Immutable Domain Registration: Guarantees the immutability of domain names on the blockchain, providing a stable and reliable domain registration system.

Technically, D-DNS combines blockchain technology with a distributed network of DEP nodes to build a decentralized DNS resolution system. It leverages edge computing to improve DNS query handling and integrates advanced encryption technology to secure DNS data. These features collectively result in a DNS resolution service that is secure, efficient, and transparent, democratizing the way we interact with the internet.

### Technology Architecture
![D-DNS](./resource/ddns_process.jpg)
### Details
- [Pitch Deck](https://drive.google.com)
- [Demo Video](https://drive.google.com)

My apologies for the misunderstanding. Let's revise and continue the plan:

**Things planned to be done during the hackathon**

**Blockchain**

- On-chain Development
   - [ ] [Domain Name Registration](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L319) (`fn register_domain()`)
   - [ ] [Transfer Domain Ownership](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L343) (`fn transfer_domain()`)
   - [ ] [Update Domain Registration Details](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L376) (`fn update_domain_details()`)
   - [ ] [Renew Domain Registration](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L406) (`fn renew_domain_registration()`)
   - [ ] [Cancel Domain Name](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L429) (`fn cancel_domain_name()`)

- DNS Record Management
   - [ ] [Add New DNS Record](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L450) (`fn add_dns_record()`)
   - [ ] [Update Existing DNS Records](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L475) (`fn update_dns_record()`)
   - [ ] [Delete Old DNS Records](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L500) (`fn delete_dns_record()`)

**On-chain and Off-chain Interaction**

- DNS Resolver
   - [ ] [Query DNS Records From Blockchain](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L525) (`fn query_dns_record()`)
   - [ ] [Caches Frequently Accessed DNS Records](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L550) (`fn cache_dns_record()`)
   - [ ] [Invalidate Stale Cache Entries](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L575) (`fn invalidate_cache_entries()`)

**Off-chain Development**

- Edge DNS Resolution
   - [ ] [Perform Edge DNS Resolution](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L600) (`fn perform_edge_dns_resolution()`)
   - [ ] [Real-time On-chain Data Synchronization](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L625) (`fn sync_on_chain_data()`)

- Edge DNS Service
   - [ ] [Edge DNS Service Deployment](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L650) (`fn deploy_edge_dns_service()`)
   - [ ] [Edge DNS Service Configuration](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L675) (`fn configure_edge_dns_service()`)

- User Interface
   - [ ] [Edge DNS Service Management](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L700) (`fn manage_edge_dns_service()`)
   - [ ] [DNS Query Log](https://github.com/AegisResolve/hackathon-2023-summer/blob/main/teams/AegisResolve/src/aegisresolve-node/pallets/dns/src/lib.rs#L725) (`fn dns_query_log()`)


## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

- 2023年7月4日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## Member Information

**Yu Bo（Blockchain technology expert & back-end engineer）**  
- Over 10+ years in software development and technical management, skilled in Rust, C/C++.
- 7 years in the blockchain industry, familiar with Polkadot and Ethereum.
- github: https://github.com/jerry-yu
- email: huoqiutianyu@gmail.com

**Biguo Xin (Full Stack Engineer & Backend Engineer)**  
- Over 5 years working on Rust
- Chief data scientist of WHU Big Data Instituion
- Author of various GO/Rust libraries
- GitHub https://github.com/FrontMage
- Email xbgxwh@outlook.com

**Windy34-Product Manager/UI Designer**
- Product Manager of Tencent, Kwai and so on
- Director of Design and Operation of Buidler DAO…
- Product Manager of Gabby World…
