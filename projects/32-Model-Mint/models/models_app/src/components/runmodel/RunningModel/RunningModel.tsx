import { memo } from 'react';
import type { FC } from 'react';
import React,{useState} from 'react';
import resets from '../_resets.module.css';
import { Auto_read_playIcon } from './Auto_read_playIcon';
import { Content_copy_statusDefault } from './Content_copy_statusDefault/Content_copy_statusDefault';
import { Frame431Icon } from './Frame431Icon';
import { Frame_statusDefault } from './Frame_statusDefault/Frame_statusDefault';
import { PromptInputComplete_promptDefa } from './PromptInputComplete_promptDefa/PromptInputComplete_promptDefa';
import classes from './RunningModel.module.css';
import { Thumb_up_statusDefault } from './Thumb_up_statusDefault/Thumb_up_statusDefault';
import { UnionIcon } from './UnionIcon';
import { useContext } from 'react';
import { modelInputContext } from '../../../Contexts/modelInputContext';
import {getCurrentUserOpenAIKey, getCurrentUserWalletAddress, hostAddress} from '../../../globalVariable';
import ReadFromfirestore from '../../../firebaseFunctions/ReadFromFirestore.js';
import tempOpenAIKey from '../../../tempOpenAIKey';




interface Props {
  className?: string;
  modelName?: string;
  modelDescription?: string;
  modelId?: string;
  modelcreatedtime?: string;
}
/* @figmaId 487:5630 */
export const RunningModel: FC<Props> = memo(function RunningModel(props = {}) {
  const [postContent, setPostContent] = useState('');
  const [modeloutput, setModelOutput] = useState('Experience the magic of AI unfold before your eyes! Once you enter your prompt in the designated field below, the model will generate a personalized output just for you. Your fascinating results will appear shortly after submitting your prompt. ');
  const [key,setkey]  = useState('');
 
 
async function handleRunModel(url,data){
  try {
    const response = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If the response was ok, retrieve and handle the JSON data
    const json = await response.json();
    console.log(json.response.trim());
    setModelOutput(json.response.trim());
  } catch (error) {
    console.error("There was a problem with the fetch operation: " + error.message);
  }
} 
 
 
  async function handlePostContentChange(newPostContent: string) {
    setPostContent(newPostContent);
    console.log(newPostContent);

    console.log(props.modelId);
    
    console.log('userid', getCurrentUserWalletAddress());
    ReadFromfirestore('Users', getCurrentUserWalletAddress()).
    then((data) => {
      console.log('firebase: ', data.open_ai_key);
      setkey(data.open_ai_key);
      console.log('key: ', key);
      console.log('kedata.open_ai_key: ', data.open_ai_key);
      var mykey = data.open_ai_key.trim();
      if(data.open_ai_key.trim() == ''){
        mykey= tempOpenAIKey;
      }
      handleRunModel(`http://${hostAddress}:4003/trymodel${mykey}`,{
        "model_id": props.modelId, 
        "prompt": newPostContent
      } );
    })
    // const data = {
    //   "model_id": props.modelId, 
    //   "prompt": newPostContent
    // };

   

    
  }
  function handleBack(){
    window.history.back();
  }

  const my_output = modeloutput;
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.nikuowwi_large_dark_chamber_wi}></div>
      <div className={classes.nikuowwi_website_UI_background}></div>
      <div onClick={handleBack} className={classes.frame431}>
        <Frame431Icon className={classes.icon2} />
      </div>
      <div className={classes.rectangle338}></div>
      <div className={classes.union}>
        <UnionIcon className={classes.icon3} />
      </div>
      <div className={classes.prompt}>Prompt</div>
      <div className={classes.rectangle336}></div>
      <div className={classes.anOpenCityIsACityThatHasBeenDe}>

        {my_output}
        
      </div>
      <div className={classes.frame2733}>
        <div className={classes.output}>Output</div>
      </div>
      <div className={classes.frame2742}>
        <Thumb_up_statusDefault classes={{ thumb_up: classes.thumb_up }} />
        <Content_copy_statusDefault classes={{ content_copy: classes.content_copy }} />
        <Frame_statusDefault />
      </div>
      <PromptInputComplete_promptDefa
        className={classes.promptInputComplete}
        classes={{ auto_read_play: classes.auto_read_play }}
        swap={{
          auto_read_play: (
            <div className={classes.auto_read_play}>
              <Auto_read_playIcon className={classes.icon} />
            </div>
          ),
        }}
        onPostContentChange={handlePostContentChange}
      />
      <div className={classes.testRun}>Test run</div>
      <div className={classes.frame2811}>
        <div className={classes.voxellaAI}>{props.modelName}</div>
        <div className={classes.writerAICapableOfAnyTopicGenre}>
          {props.modelDescription}
        </div>
      </div>
      <div className={classes.frame2817}>
        <div className={classes.frame2815}>
          <div className={classes.modelId}>Model id</div>
          <div className={classes.ftAsdhfhsduifhuasdhfodhfiodsjf}>{props.modelId}</div>
        </div>
        <div className={classes.frame2816}>
          <div className={classes.createdTime}>Created time</div>
          <div className={classes._202325233545}>{props.modelcreatedtime}</div>
        </div>
      </div>
      <div className={classes.rectangle345}></div>
    </div>
  );
});
