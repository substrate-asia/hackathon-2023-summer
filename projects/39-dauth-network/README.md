## Project Introduction

Project Name: DAuth Network

Starting time: Feb 2023

## Project Details

- The Problems

The next billion users who will enter Web3 will have difficulty entering without the empowerment of social accounts. The Web3 ecosystem needs Web2 functionality that keeps the onboarding processes smoothly and seamlessly.

Most of the current authentication is based on the centralized OAuth and SMTP protocol framework. These protocol frameworks will make the authentication service providers become centralized collectors of user Web2-Web3 information (although this is not their intention). This massive collection of user data poses a significant risk of exposing the user's identity and assets, ultimately compromising the security and privacy of Web3.

- Project Introduction

DAuth is a trustless, anonymous protocol for social account authentication. 

DAuth has developed a Hybrid Zero-Knowledge (ZK) architecture that allows for real-time conversion of off-chain social account authentication into fully decentralized and privacy-preserving proofs that can be verified on-chain. This system is pioneering in its proposal of a Web3 native social account login method and two-factor authentication (2FA).

Another key feature of DAuth is the anonymous message relayer, including emails and SMS. Through the DAuth relayer, DApps can send emails or SMSs to Web3 users solely using the user's Web3 address, ensuring privacy and anonymity.

- Demo

https://demo.dauth.network/

- Technical architecture

https://dauthnetwork.medium.com/hybrid-proofs-bridging-the-gap-for-decentralized-social-account-authentication-in-web3-8fc9fc8db51a


- Logo

https://drive.google.com/file/d/1syAYeVKHZoyiQ4g4zOrmjAJUKaftFIwg/view?usp=drive_link

- The first commit


## Tasks to be Completed

**Contract**

- [x] Node register (`fn node_register`)
- [x] Get node list with public keys (`fn get_nodes`)

**Web SDK**

- [x] Onchain Verifiable 2FA
  - [x] Google OAuth
  - [x] Apple ID Login
  - [x] Email 2FA
  - [x] Support Email templete with privacy relayer in enclave

## Tasks Completed

**Contract**

- [x] Node register (`fn node_register`)
- [x] Get node list with public keys (`fn get_nodes`)

**Web SDK**

- [x] Onchain Verifiable 2FA
  - [x] Google OAuth
  - [x] Apple ID Login
  - [x] Email 2FA

**Code Structure**

  - `src/contract` includes functions: node register and get node list with public keys
  - `src/instant-proof/app` includes functions: web api and databaes persistence
  - `src/instant-proof/enclave` includes functions: build secure session, send sms otp, send email opt, invoke google oauth, etc.
  - `src/instant-proof/scripts` includes functions: generate random client id, set up binary structure

**Demo Vedio**
https://www.loom.com/share/f6bcd0e552dc47b38f60a1e1783eec76?sid=80a8760e-c0d9-482c-8f09-dc5ad94ed13d

**Documents**
[SDK Document](https://github.com/DAuth-Network/dauth/tree/main/packages/core)

## Team Members

1. Dean

- Dean is proficient in cryptography, backend technologies, and various decentralized algorithms. He has experience with Web3 protocol projects from scratch.
- Role: Team Leader
- Github: https://github.com/orgs/DAuth-Network/people/yyd106
- Wecaht: wizard336

2. Leo
- Leo is proficient in backend technologies, including various databases, and backend languages such as Java, Rust, and Go. He also has extensive experience in the fields of automated operation and maintenance, and testing. 
- Role: Dev Leaer
- Github: https://github.com/orgs/DAuth-Network/people/ksrust

3. Kai
- Kai is responsible for product strategy and design.
- Role: Product Designer
- Github: https://github.com/orgs/DAuth-Network/people/0xkaic
