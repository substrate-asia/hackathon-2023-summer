const { Configuration, OpenAIApi } = require("openai");
const {openai_key} = require('../openaiConfig.js');
const configuration = new Configuration({
  apiKey: openai_key,
});
const openai = new OpenAIApi(configuration);
const response = openai.listFineTunes().then((response) => {
    console.log("*********************************");
    console.log(response.data.data);
}).catch((error) => {
    console.log(error);
}
);
