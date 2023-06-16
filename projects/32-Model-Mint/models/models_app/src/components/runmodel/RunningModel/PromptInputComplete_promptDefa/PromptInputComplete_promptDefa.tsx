import { memo } from 'react';
import type { FC, ReactNode } from 'react';
import React,{useState} from 'react';
import resets from '../../_resets.module.css';
import { GenerateOutput_statusDefault } from '../GenerateOutput_statusDefault/GenerateOutput_statusDefault';
import { Auto_read_playIcon } from './Auto_read_playIcon';
import classes from './PromptInputComplete_promptDefa.module.css';
import { Input } from '@mui/material';
import {modelInputContext} from '../../../../../../context/modelInputContext'
interface Props {
  className?: string;
  classes?: {
    auto_read_play?: string;
    root?: string;
  };
  swap?: {
    auto_read_play?: ReactNode;
  };
  onPostContentChange?: (postContent: string) => void;
}
/* @figmaId 456:5381 */
export const PromptInputComplete_promptDefa: FC<Props> = memo(function PromptInputComplete_promptDefa(props = {}) {
  const [postContent, setPostContent] = useState(''); //
 
  function handlePostContentChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPostContent(event.target.value);
  }

  function handleSendDate()
  {
    props.onPostContentChange(postContent);
  }

  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame2810}>
        <div className={classes.youCanAskEGHowDoYouDefineTheTe}>
         
          <textarea  value={postContent}
      onChange={event => handlePostContentChange(event)}
      placeholder="You can ask: e.g. How do you define the term “open city” in a military context?"  
      rows={18}
      style={{ 
            backgroundColor: 'transparent', fontFamily: 'Poppins',
                width: '600px' , borderColor:'transparent', 
                borderWidth:'0px', fontSize:'16px',
                color:"white",
                opacity:"0.7", outline: 'none' }}  />

        </div>
      </div>
      <div onClick={() => handleSendDate()}>

  
      <GenerateOutput_statusDefault
        classes={{ auto_read_play: `${props.classes?.auto_read_play || ''} ${classes.auto_read_play}` }}
        swap={{
          auto_read_play: props.swap?.auto_read_play || (
            <div className={classes.auto_read_play}>
              <Auto_read_playIcon className={classes.icon} />
            </div>
          ),
        }}
      />
          </div>
    </div>
  );
});
