### `Basic Information`

`project Name：Dynamo`

`Project Initiation Date: June 2023`

### `Project Overview`

`Dynamo is a next-gen Web3 data conversation engine powered by AI.` 

### **`Project introduction`**

**`Painpoints`**

`Web3 data includes both on-chain and off-chain data that can provide valuable insights when effectively processed. In today's business scenarios, Web3 companies rely on this data to make data-driven decisions and gain valuable insights. However, it is common for them to spend an excessive amount of time and resources processing the data before reaching their final goal. For instance, they face the following issues:`

- `Various types of data, such as brand assets and operational metrics, often exist in different locations and can be difficult to source when needed. Examples of brand assets include white papers, websites, social media content, and messages in community channels. Operational metrics may include user growth, retention, campaign engagement, and wallet interactions.`
- `Employees from different departments or professions may have difficulty understanding data from other areas, resulting in a blockage of information exchange.`
- `Community mods can be costly and there may be inaccuracies in user Q&A services.`

**`Our Solutions`**

`An all-in-one chatbot platform based on Web3 data.`

- `For Web3 businesses: train datasets, build and manage chat apps.`
- `For users/developers: interact with AI, enjoy entertainment and education, and explore new credential patterns.`

**`Framework`**

`For Web3 businesses:`

1. `Sign up with a Polkadot wallet and fill in the basic account information.`
2. `Create a dataset for free.`
3. `Create a chat app using the dataset and mint an Admin NFT upon release of the chat app.`

`For users:`

1. `Sign up with a Polkadot wallet and fill in the basic account information.`
2. `Browse the chat app feed and interact with each bot for free (limited usage).`
3. `Claim the SBT as proof of interacting with any specific bot after limited usage for future rewards from the bot owner.`

**`Technical Architecture`**

1. `Frontend Interface:`
    - `Develop a user-friendly frontend interface for users to interact with the AI quiz robot.`
2. `Backend Server:`
    - `Set up a backend server to handle user requests and manage the business logic of the quiz robot. This server will communicate with the Substrate parachain for user registration, off-chain worker, and XCM operations.`
    - `Choose a backend programming language and framework that aligns with your preferences and requirements.`
3. `Substrate Parachain:`
    - `Utilize Substrate to create a custom parachain for user registration, AI information management, and integration with other parachains.`
    - `Define the necessary runtime logic, including modules for user registration, AI information storage, and interaction with the off-chain worker.`
    - `Leverage Substrate's off-chain worker component to periodically query remote AI information and update the parachain's state. Configure the off-chain worker to retrieve AI data from external sources or APIs and store it in the parachain's storage.`
4. `Off-Chain Worker:`
    - `Implement an off-chain worker within the Substrate parachain to perform tasks outside the blockchain's consensus mechanism.`
    - `Configure the off-chain worker to query remote AI information from external sources or APIs. This can involve fetching and processing data, such as retrieving quiz questions or AI model results.`
    - `Store the acquired AI information in the parachain's storage, making it accessible to the backend server and other components.`
5. `Substrate Cross-Chain Messaging (XCM):`
    - `Utilize Substrate's built-in XCM system to facilitate communication and data transfer between different parachains within the Polkadot ecosystem. This enables interoperability between different blockchain networks and allows the AI quiz robot to leverage AI information from other parachains.`
6. `Integration and Communication:`
    - `Establish communication channels between the frontend, backend server, Substrate parachain, off-chain worker, and other parachains using appropriate APIs and protocols for data exchange, such as RESTful APIs or WebSocket.`
    - `Implement the necessary communication protocols to interact with the Substrate parachain, off-chain worker, and other components involved in retrieving and managing AI information.`

### **`Project Demo`**

- `Website: TBD`
- `Project Logo:`

![logo (4).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/14ae662a-6925-4669-abaa-6fc793a107ec/logo_(4).png)

### **`Planned Accomplishments During the Hackathon`**

- [ ]  Website to manage AI bots and customized knowledge datastore.
- [ ]  Slack bot, which can be integrated into the Slack channel.
- [ ]  Bubble widget,  embedding into ordinary websites with just one simple script.

### **`Team Information`**

**`Github:** https://github.com/DynamoTTM`

**`Members:`**

- `Jennie - Product Lead`
- `Minqi - Technical Lead`
- `Yunjian - AI Developer`
- `Cedric - Marketing & Operation`
- `Jamie - Marketing & Operation`