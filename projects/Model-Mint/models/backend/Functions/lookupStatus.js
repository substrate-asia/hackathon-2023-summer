
const { Configuration, OpenAIApi } = require("openai");
const { openai_key } = require("../openaiConfig.js");


const configuration = new Configuration({
    apiKey: openai_key,
  });
  const openai = new OpenAIApi(configuration);

async function lookupStatus(model_id) {
    try {
        const response = await openai.listFineTunes();
        const fineTuneData = response.data.data;
        console.log('fineTuneData: ',fineTuneData);
        const modelData = fineTuneData.find((item) => item.id === model_id);
        console.log('modelData: ',modelData);
        if (!modelData) {
          throw new Error(`Model with ID ${model_id} not found`);
        }
        const fineTunedModel = modelData.fine_tuned_model;
        if (!fineTunedModel) {
          throw new Error(`Fine-tuned model not found for model with ID ${model_id}`);
        }
        return fineTunedModel;
      } catch (error) {
        console.error("Error looking up model status:", error);
        return "pending";
        throw error;
      }
}

module.exports = { lookupStatus };
