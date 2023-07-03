# Pshare: A Decentralized Private Social Application

##  Basic Information

Name of our project：Pshare

Project approval date: 7 June, 2023


## Logo
<img src="https://raw.githubusercontent.com/lenny-mo/PictureUploadFolder/main/20230703003712.png" alt="Image" style="width: 600px; height: auto;">

## Pitch Deck

Our presentation link: https://drive.google.com/file/d/188beUW2UVvU__anNZ541j7mWG6tRR6NR/view?pli=1


## Abstract
As the internet and social media landscape currently stands, issues of data privacy and security are becoming increasingly pronounced. Centralized social platforms pose the risk of data exploitation, leaving users bereft of true data sovereignty. Decentralized social platforms, while addressing the issue of data sovereignty to some extent, store data publicly, rendering private data unprotected. Furthermore, the methods of private content sharing in existing Web3 products are not user-friendly, and incentives for content creators are insufficient. In response to these pain points, we have designed a decentralized, private domain social product based on Subsocial. This product aims to overcome the data sovereignty issues prevalent in centralized social media, the privacy protection issues in decentralized platforms, and improve the user experience of privacy content sharing in Web3 products. It also provides an effective incentive mechanism for content creators. Our goal is to enable users to enjoy the convenience of social interaction while having the authority to dictate the use of their data, stimulating content creators' enthusiasm and fostering a healthy and sustainable social ecosystem.


## Introduction


Pshare is a cutting-edge project designed to address the pressing issues plaguing current internet social products. It is rooted in the philosophy of decentralization and privacy protection, offering a robust solution to the significant data privacy concerns present in both centralized and decentralized social products.

### Key Features
The revolutionary features of our project include:

- **Decentralized Private Social Experience:** Leveraging the power of subsocial, we have created a decentralized private social product capable of overcoming the challenges that exist in the current social landscape.

- **Data Privacy and Sovereignty:** Our solution mitigates the risk of data misuse by centralized platforms and provides a secure environment where privacy data is protected and not publicly stored.

- **User-friendly Privacy Content Sharing:** In response to the existing web3 products' unfriendly mechanisms for privacy content sharing, Pshare provides a user-centric approach that respects and prioritizes user convenience.

- **Creator Incentives:** Recognizing the need for a motivating factor for creators in current social products, our platform integrates an incentive mechanism to encourage continuous content creation.

In summary, Pshare is a solution crafted with the vision to empower individuals in the web3 era. It provides a safe and reliable storage platform, reminiscent of the protective stature of the Colossus of Rhodes, ensuring personal data protection and accessibility. Like Helios overlooking Rhodes, we aim to offer a product that watches over your digital social interactions.


## Technology Architecture

![DappArchitecture.jpeg | 800](https://raw.githubusercontent.com/lenny-mo/PictureUploadFolder/main/DappArchitecture.jpeg)

Explanation of the technology architecture of our project

### Application Layer
1. Post management: This function is used to manage content published by creators, such as articles, photos, and videos. With post management, creators can create, edit, and delete their own posts, while subscribers can view and comment on these posts, etc.
2. Subscription Management: This feature is used to manage the relationship between creators and subscribers. Subscription management allows creators to view their subscriber list and manage subscriber access to their data. Subscribers can subscribe to the creator's content through this function, and obtain corresponding permissions and services within the validity period of the subscription.
3. Share: This feature allows users to share the creator's content with others. Through the sharing function, users can send interested posts, subscription links or Dapp links to others, thereby expanding the scope of content dissemination.


### Computation Layer
1. subsocial api and smart contract: It is used to store and process data of decentralized private domain social products. It provides basic functions such as account management, post management, and subscription management; and we also plan to deploy subscription contracts on this blockchain.
2. Proxy Re--encryption: Used to implement subscriber access restrictions on creator data. With proxy re-encryption, creators can share encrypted data with subscribers, with access automatically revoked after the subscription expires.


### Storage Layer 
1. Store encrypted files in decentralized storage devices through subsocial's IPFSapi.

## Things to be done during the hackathon
**Blockchain**

- [x] Implement a smart contract used for implimentation of subscription.
- [ ] Deploy the smart comtract on subsocial.

**Frontend**

- [x] Design and implement user registration and login page. 
- [x] Design and implement user profile page. 
- [x] Design and implement post creation page.
- [x] Design and implement subscription page used to show posts created by creators he or she subscribe. 

**Backend**

- [ ] Design and implement services for user data storage and retrieval.
- [x] Design and implement services for user data encryption and decryption.
- [ ] Design and implement services for user data permissions management.
- [ ] Design and implement services for user data auditing and monitoring.



## Infomation of Team Members

- Frank（Market Research, Product Manager）
  - Blockchain company product manager
  - github: Frank2333333
- Yiko（Smart Contract Engineer, Product Manager）
  - Senior development engineer, with 8 years of experience in the blockchain field
  - github: TecSong
- Lenny（Team Captain, Dapp Development Engineer, Corresponding Author）
  - Graduate student, research on Distributed storage and blockchain
  - contact email: lennymo.work@gmail.com
  - github: lenny-mo


