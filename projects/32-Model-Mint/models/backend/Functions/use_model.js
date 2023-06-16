const { Configuration, OpenAIApi } = require("openai");
const { openai_key } = require("../openaiConfig.js");



async function use_model(my_prompt = "What is the name of the person who wrote the book 'The Hunger Games'?"
, my_model = "text-davinci-002", userOpenaiKey) {

  const configuration = new Configuration({
    apiKey: userOpenaiKey,
  });
  const openai = new OpenAIApi(configuration);
  console.log('usemodelOpenAIkey',userOpenaiKey);
  try{
    console.log('1');
    const response = await openai.createCompletion({
        prompt: my_prompt,
        model: my_model,
      });
    console.log('2');

    console.log(response.data.choices[0].text);
    return response.data.choices[0].text;
  } catch (error) {
    return 'Incorrect API Key';
  }
  }

//   use_model();
  module.exports = { use_model };
