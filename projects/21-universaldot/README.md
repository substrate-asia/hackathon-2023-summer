<p align="center">
  <a href="https://universaldot.foundation" title="universaldot">
    <img src="https://raw.githubusercontent.com/UniversalDot/documents/master/logo/universaldot-logo/transparent-small.png" alt="Universaldot" width="344" />
  </a>
</p>

<h3 align="center"><b>UniversalDot | Decentralized Freelancing Platform</b></h3>

<p align="center">
  <b><i>Freelance like a Pro.</i></b>
  <br />
  <br />
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://docs.universaldot.me/">Explore the docs</a>
  ·
  <a href="https://github.com/UniversalDot">GitHub</a>
  ·
  <a href="https://app.universaldot.me">View Demo</a>
  ·
  <a href="https://github.com/UniversalDot/front-end/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml&title=%F0%9F%90%9B+%5BBUG%5D+-+%3Ctitle%3E">Report Bug</a>
  ·
  <a href="https://github.com/UniversalDot/front-end/issues/new?assignees=&labels=question&projects=&template=feature_request.yml&title=%F0%9F%92%A1+%5BREQUEST%5D+-+%3Ctitle%3E">Request Feature/Example</a>
</p>


## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Executive summary](#executive-summary)
  - [Project Description](#project-description)
- [Design and Architecture](#design-and-architecture)
- [Setup Instructions](#setup-instructions)
  - [Docker](#docker)
  - [Ansible](#ansible)
- [Demo](#demo)

## About The Project

### Executive summary

UniversalDot is a decentralized freelancing platform that revolutionizes the way freelancers and clients interact. By leveraging blockchain technology, UniversalDot eliminates the need for intermediaries, ensuring direct and secure transactions between parties. With its transparent reputation system and fair dispute resolution mechanism, UniversalDot creates a trustworthy environment, fostering a global community of freelancers and clients who can collaborate seamlessly and autonomously.

The underlying technology enables the functioning of Decentralized Autonomous Organizations (DAOs). This infrastructure empowers individuals to participate in decentralized decision-making and fosters the creation of autonomous and transparent organizations with no centralized authority.

### Project Description

UniversalDot is an innovative decentralized freelancing application built on the Substrate framework. The platform aims to disrupt the traditional freelancing industry by offering a transparent, secure, and efficient ecosystem for freelancers and clients worldwide.

By leveraging Substrate's modular architecture, UniversalDot brings together a set of custom pallets specifically designed to meet the needs of freelancers. These pallets enable features such as identity verification, reputation management, dispute resolution, and secure payment systems, ensuring a seamless and trustworthy experience for all participants.

With UniversalDot, freelancers can create their profiles, showcase their skills, and offer their services directly to clients without intermediaries. Clients, on the other hand, gain access to a global talent pool and can easily find the right freelancers for their projects based on reputation and expertise.

The decentralized nature of UniversalDot ensures that no single entity has control over the platform, promoting fairness, autonomy, and censorship resistance. Through the use of blockchain technology, all transactions and interactions are recorded immutably, enhancing transparency and accountability.

UniversalDot aims to create a vibrant freelancing community by facilitating direct peer-to-peer collaboration, reducing fees, and allowing freelancers to retain a higher percentage of their earnings. It also encourages the growth of decentralized governance, enabling platform participants to actively participate in decision-making processes.

In summary, UniversalDot is a groundbreaking decentralized freelancing application built on Substrate pallets, offering an inclusive, secure, and transparent ecosystem for freelancers and clients. By leveraging the power of blockchain and decentralized governance, UniversalDot revolutionizes the freelancing landscape, empowering individuals and fostering a truly decentralized and autonomous freelancing economy.


## Design and Architecture

- [Solution Architecture](https://drive.google.com/file/d/13C9IRIX49AjfZEB-MI9dXG3gX-cdTgBp/view?usp=sharing)
- [Software Requirements Document](https://drive.google.com/file/d/1HvYvb7N1A9uT_9UhrAq1mV38RtjyfVv-/view?usp=sharing)
- [IPFS Design Document](https://drive.google.com/file/d/1ov7jfAPMTuotbHRwTMIRvLKomt1c1e3f/view?usp=sharing)
- [Personalized Recommendation System Architecture](https://drive.google.com/file/d/1rscD1VDG8EkaGTh9M7BUa3u7nRoBgcwJ/view?usp=sharing)
  


## Setup Instructions

### Docker

1. Install [docker](https://docs.docker.com/engine/install/)
2. Install [docker compose](https://docs.docker.com/compose/install/)
3. Download this repo via git.

```
git clone https://github.com/UniversalDot/compose-service.git
```

4. Navigate inside the folder...

```
cd compose-service
```
5. Run docker-compose command
```
docker-compose up -d
```
Note: -d flag stands for “detached” mode. When passing the '-d' flag we are running our services in the background.

### Ansible

1. Install Ansible. 
2. Clone the following repository:
```
git clone https://github.com/UniversalDot/ansible.git
```
3. Run the following playbook:
```
ansible-playbook universaldot.yml
```
##  Demo

- [Promo](https://www.youtube.com/watch?v=dADLbKl1P7g)
- [Introduction](https://www.youtube.com/watch?v=QgjvhzC47tA)
- [Solution](https://www.youtube.com/watch?v=YJWPwlWoREc)

Pallet Demonstration through a React Front-end

- [Profile](https://www.youtube.com/watch?v=Gaoo6LoZydg)
- [Task](https://www.youtube.com/watch?v=ssTMk1nGbk8)
- [DAO](https://www.youtube.com/watch?v=K9-v016fGVs)



