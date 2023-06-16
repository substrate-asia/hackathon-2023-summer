import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { Emoji_flagsIcon } from './Emoji_flagsIcon';
import classes from './Frame2661_statusAvailable.module.css';
import { InfoIcon } from './InfoIcon';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FlagIcon from '@mui/icons-material/Flag';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    emoji_flags?: ReactNode;
    info?: ReactNode;
  };
  currentstatus: string;
  onClick?: () => void;
}
/* @figmaId 178:5993 */
export const Frame2661_statusAvailable: FC<Props> = memo(function Frame2661_statusAvailable(props = { status: 'available'}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame2675}>
        <div className={classes.trainButton} onClick={props.onClick}>
          <div className={classes.frame2647}>
                <div>
                  
            {props.currentstatus === "available" && <FlagIcon />}
            {props.currentstatus === "training" && <HourglassTopIcon />}
            {props.currentstatus === "finished" && <DoneAllIcon />}
          </div>

            {/* <div className={classes.emoji_flags}> */}
              {/* {props.swap?.emoji_flags || <Emoji_flagsIcon className={classes.icon} />} */}
            {/* </div> */}

            {props.currentstatus === "available" &&   <div className={classes.train}>Train</div>}
            {props.currentstatus === "training" &&   <div className={classes.train}>Training</div>}
            {props.currentstatus === "finished" &&   <div className={classes.train}>Done</div>}  
            
          </div>
        </div>
        <div className={classes.frame2677}>
        
            
             
        </div>
        {props.currentstatus === "available" &&   
        <div>
          <div className={classes.info}>{props.swap?.info || <InfoIcon className={classes.icon2} />}</div>
          <div className={classes.usesTheCSVFileAboveToFineTuneT}>
            Uses the CSV file above to fine-tune the selected base model.{' '}
          </div>
          </div>}
            {props.currentstatus === "training" &&  
            <div>
           
            <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
            <div className={classes.usesTheCSVFileAboveToFineTuneT}>
            The training process usually takes about 5 - 10 minutes. 
          </div>
            {/* <LinearProgress color="secondary" />
            <LinearProgress color="success" />
            <LinearProgress color="inherit" /> */}
            <LinearProgress />
          </Stack> 
          </div>}
            {props.currentstatus === "finished" &&   <div className={classes.usesTheCSVFileAboveToFineTuneT}>
            Once you are satisfied with the fine-tuning, save this <br />
            model to  draft. Exit to creator space to test-run the model. {' '}
          </div>}
      
      </div>
    </div>
  );
});
