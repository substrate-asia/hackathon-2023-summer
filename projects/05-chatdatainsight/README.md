## 基本资料

项目名称：ChatData Insight - A tool to analyze blockchain data through chat, using LLM.

项目立项日期 (哪年哪月)：2023.5

website: http://chatdatainsight.com/

## 项目整体简介
### Background

In the rapidly evolving blockchain industry, data is being generated at an unprecedented rate. This data, which includes transaction volumes, token prices, and market trends, holds immense value for various stakeholders, including investors, analysts, and developers. However, the sheer volume and complexity of blockchain data have made it difficult for individuals to access and analyze this information effectively. Traditional data analysis tools are often not tailored to the specific needs of blockchain data and require extensive technical knowledge, which creates a barrier for many users.

ChatDataInsight aims to bridge this gap by introducing a pioneering web3 data analysis project. By leveraging the advanced capabilities of artificial intelligence and conversational chat models, especially GPT, ChatDataInsight is poised to revolutionize the way users access and analyze blockchain data.

### Project Description
ChatDataInsight is designed to be a user-centric platform that democratizes data analysis in the blockchain industry. It allows users to submit queries in natural language through an interactive webpage. The platform's AI-powered engine then processes these queries, connects to multiple databases and service interfaces, and aggregates relevant data. The data is analyzed, and the insights are presented to the users in a variety of formats, including text, tables, and charts.

The platform also features a freemium model, allowing users to access basic features for free. Additionally, it offers a subscription-based membership service with premium features such as faster response times and access to advanced models. Users can pay for membership services through conventional methods as well as blockchain methods.

What sets ChatDataInsight apart is its continuous learning mechanism. The system learns from unanswered or poorly answered questions and improves the quality and accuracy of responses over time. Furthermore, it has the potential for cross-chain data analysis, enabling users to analyze data across multiple blockchain datasets such as Ethereum, BSC, Polkadot, Near, and Solana.

ChatData Insight is a tool to analyze blockchain data through chat, like chatGPT for web3:
1. Seamless user interaction through natural language processing.
2. Highly intelligent data analysis based on generative artificial intelligence.
3. Provide intelligent recommendations based on user preferences and behaviors.
4. Customized dashboards and insight sharing.


### Demo
- TBD

### Technology Architecture
![](./docs/architecture.jpg)

### Logo
![](./docs/logo.png)

## 黑客松期间计划完成的事项

- 请团队在报名那一周 git clone 这个代码库并创建团队目录，在 readme 里列出黑客松期间内打算完成的代码功能点。并提交 PR 到本代码库。例子如下 (这只是一个 nft 项目的例子，请根据团队项目自身定义具体工作)：

**backend**
Function Points:
1. Configuration Setup
    - Import necessary libraries such as os, sys, logging, openai, and json.
    - Set up configurations for OpenAI API key and model name.
    - Initialize custom logger for logging information and errors.

2. Data Acquisition Tools
    - Integrate with third-party services like Quicknode, Airstack, and Google Search for data acquisition.
    - Implement functions to interact with blockchain data through APIs.
    
3. Data Analysis Tools
    a. On-Chain Data Analysis
        - Provide tools for analyzing community activity, token distribution, economic models, and project innovations.
    b. Internet Search
        - Implement a tool to search the internet for information using the Google Search API.
    c. News Analysis
        - Implement a tool to analyze community activity by searching news websites.
    
4. AI-Driven Question Processing
    a. Question Decomposition
        - Implement a function to decompose complex questions into simpler sub-questions.
    b. Sub-Question Analysis
        - Utilize AI models to analyze and answer sub-questions using various tools.
    c. Answer Integration
        - Integrate answers to sub-questions into a coherent response to the original question.
    
5. Error Handling and Validation
    a. Answer Validation
        - Implement functions to check the validity of answers.
    b. Question Validation
        - Implement functions to check the validity of questions.
    c. Exception Handling
        - Handle errors and exceptions gracefully during data acquisition and analysis.
    
6. Utility Functions
    - Implement utility functions such as removing historical images for data cleanup.

7. Logging and Debugging
    - Log information and errors for debugging and monitoring purposes.
    - Implement exception handling and logging for errors during data acquisition and analysis.

This structure represents the functions and sub-functions implemented in the insight.py file, which is likely part of a larger system for blockchain data insights.


General Function Name: AI Chatbot Tools

Function Points:
1. Configuration Setup
    - Import necessary libraries and modules.
    - Set up configurations for OpenAI API key and model name.

2. Chatbot Conversation
    a. Initialize Conversation
        - Define a class `Conversation` to initialize a conversation with a prompt and number of rounds.
    b. Chat with GPT Model
        - Implement a function `chat_with_gpt` to chat with the GPT model.
    c. Conversation Messaging
        - Implement a method `ask` within the `Conversation` class to append user messages and get responses from the GPT model.
    d. Cleanup Old Messages
        - Remove old messages from the conversation to maintain a fixed number of rounds.

3. Stream Output
    - Implement a function `stream_output` to stream output from the chat model with a given prompt.

4. Data Summary
    - Implement a function `data_summary` to analyze and summarize blockchain data and provide investment advice.


General Function Name: Index Creation for Private Dataset

Function Points:
1. Index Creation
    - Convert text materials into an index.
    - Load documents from a directory and create an index from them.
    - Persist the index to a specified directory.


General Function Name: Query Private Dataset Index

Function Points:
1. Query Execution
    - Rebuild the storage context from a specified directory.
    - Load the index from storage.
    - Execute a query on the index using the provided question.
    - Return the query results.


General Function Name: Error Question Database Management

Function Points:
1. Database Configuration
    - Define a Pydantic model for data to be inserted into the database.
    - Initialize a MongoDB collection and create an index on the `question` field.

2. Error Data Insertion
    - Implement a method to insert error data into the MongoDB collection.
    - Handle successful insertion and insertion failures.
**front end**
  - [ ] Ask and show answer
  - [ ] Support chart display


## 黑客松期间所完成的事项 (2023年7月4日上午11:59初审前提交)

- 2023年7月4日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## 队员信息

**Dapeng Lan**
- Serial entrepreneur with experience in web2/3 technologies and AI. Earlier employee in a nordic startup (exit for 60M SEK).
- PhD in Computer Science in a top 100 University in Nordic. 
- Over 9 years experiences in development and project management, engaged in work related to blockchain and artificial intelligence.
- github: https://github.com/DapengLan

**Harry Liu**
- Senior researcher in artificial intelligence a renown Top 500 company. 
- PhD in Computer Science in Nordic.
- Over 9 years experiences in development, engaged in work related to data analytics and artificial intelligence.
- Github: https://github.com/HITliuyu

**Smith Li**
- Blockchain Developer
- Over 9 years of working experience in various aspects of computer programming.
- Worked in the blockchain industry for 3+ years,  a blockchain development engineer, familiar with polkadot, bitshares, fabric, etc.
- Github: https://github.com/baidang201

**yiwei Shi**  
- FULL STACK
- Art and management background, worked for Hearst, MSN, responsible for market and product, more than one year of blockchain development experience, familiar with computer science, cryptography and different economic mechanisms, good at Go and Rust development。Hackathon winner as a team member: Winners of Polkadot Hackathon 2022
- Github : https://github.com/shiyivei
- Email : shiyivei@outlook.com

**Yunfei Li**  
- FRONT END
- Over 8 years of front-end experience,good at vue, react and nodejs，and interested in blockchain and decentralization
- Github: https://github.com/liyunfei22
- Email: liyunfei696@gmail.com

**Youyou Li**
- UI/UX
- Eight years of experience in advertising industry. Provided storyboarding, graphic design, UI design, and other visual content for customers. Worked on projects for Dyson, Sony, Bank of China, Carrefour, Cadillac and other brands. Did graphic and UI design for several web 3 projects out of interest in the area. 
- Github: https://github.com/youyou0921
- Wechat: 18516611762
