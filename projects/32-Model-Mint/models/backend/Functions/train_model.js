const fs = require("fs");
const csv = require("csv-parser");
const { Configuration, OpenAIApi } = require("openai");
const { openai_key } = require("../openaiConfig.js");

const { json } = require("body-parser");

// const csvFilePath = "test.csv";
var jsonlFilePath = "test.jsonl";
var model_tyle = "ada";
const configuration = new Configuration({
  apiKey: openai_key,
});
const openai = new OpenAIApi(configuration);

var json_file_name = "";
var model_id = "ft-OMPfGWlC6nlhqLtybBEsRNRf";

async function trainModel(csvFilePath) {
  
  
  console.log("openai_key: ", openai_key);

  function createOutputName() {
      var d = new Date();
      const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

      var n = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}---`;
      var user_id = openai_key.substring(3, 9);
      json_file_name = "output" + n + user_id + ".jsonl";
      console.log(json_file_name);
      jsonlFilePath = json_file_name.trim();
  }

  async function csvToJsonl(){

  const writeStream = fs.createWriteStream(jsonlFilePath);

  await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => {
          writeStream.write(JSON.stringify(data) + "\n");
        })
        .on("end", () => {
          console.log("CSV file successfully converted to JSONL file.");
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });

  }

  async function uploadFile() {
      try {
          const response = await openai.createFile(
              fs.createReadStream(jsonlFilePath),
              "fine-tune"
            );
            console.log(response.data);
              console.log(response.data.id);
              return response.data.id; 
      } catch (error) {
          console.log(error);
          }
        }

  async function createFineTune(file_name) {

  const response = await openai.createFineTune({
    training_file: file_name,
    model : model_tyle,
  }).then((response) => {
      console.log("*********************************");
      console.log(response.data.id);
      // console.log(response.data.fine_tuned_model);
      model_id = response.data.id;
  }).catch((error) => {
      console.log(error);
  }
  );}


  async function lookupStatus(model_id) {
      const response = openai.listFineTunes().then((response) => {
          console.log("*********************************");
          console.log('fine_tuned_model', response.data.data.filter((item) => item.id === model_id)[0].fine_tuned_model);
      }).catch((error) => {
          console.log(error);
      }
      );
  }

      createOutputName();
      await csvToJsonl();
      const file_name = await uploadFile();
      console.log('jsonlFilePath:',jsonlFilePath.trim());
      console.log("fileName: ",file_name);
      await createFineTune(file_name);
      // await lookupStatus(model_id);
      console.log("model_id: ",model_id);
      return model_id;
  
  }

module.exports = { trainModel };
