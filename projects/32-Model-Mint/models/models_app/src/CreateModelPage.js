import React,{useState} from "react";
import classes from './App.module.css';
import resets from './components/_resets.module.css';
import { Create } from './components/Create/Create.tsx';
import { getCurrentUserOpenAIKey, hostAddress} from "./globalVariable";

function CreateModelPage()
{
  const [modelName, setModelName] = useState('');

  const handleNameChange = (nameValue) => {
    setModelName(nameValue);
    console.log(modelName);
  };

  async function handleSetupKey() {
    try {
      // var data;
      var requestadd = `http://${hostAddress}:4003/setkey${getCurrentUserOpenAIKey()}`;
      const response = await fetch(requestadd,{
        method: 'POST'
      });
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error("Error set up key", error);
    }
  }
  
         return (
    <div onClick={handleSetupKey} className={`${resets.clapyResets} ${classes.root}`}>
      <Create onNameChange={handleNameChange} />
    </div>)
}
export default CreateModelPage;

