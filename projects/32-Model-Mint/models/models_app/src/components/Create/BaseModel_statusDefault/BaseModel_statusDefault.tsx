import { memo } from 'react';
import type { FC, ReactNode } from 'react';
import { useState } from "react";
import {  CircleIcon } from "./icons";
import React from 'react';
import resets from '../../_resets.module.css';
import { ColorfulModelNameLogo_modelC } from '../ColorfulModelNameLogo_modelC/ColorfulModelNameLogo_modelC';
import classes from './BaseModel_statusDefault.module.css';
import { FrameIcon } from './FrameIcon';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
interface Props {
  className?: string;
  swap?: {
    colorfulModelNameLogo?: ReactNode;
  };
  text?: {
    veryCapableButFasterAndLowerCo?: ReactNode;
  };
  onNameChange: (nameValue: string) => void;
}
/* @figmaId 163:2237 */
export const BaseModel_statusDefault: FC<Props> = memo(function BaseModel_statusDefault(props = {}) {
  const [iconClicked, setIconClicked] = useState(false);
  const handleClick2 = () => {
    setIconClicked(!iconClicked);
    try{
      // get the last letter of the model name
      const modelName = props.swap.colorfulModelNameLogo.type.type.name;
      const lastLetter = modelName[modelName.length - 1];
      props.onNameChange(lastLetter);

      // console.log(lastLetter);
    }
    catch(err){
      // console.log("C");
      props.onNameChange("C");
    }
    

  };

  const handleClick = () => {
    setIconClicked(!iconClicked);
  };


  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame2663}>
        {props.swap?.colorfulModelNameLogo || <ColorfulModelNameLogo_modelC />}
        <div className={classes.frame}>
        {iconClicked ? (
        <RadioButtonCheckedIcon onClick={handleClick} style={{ color: "white" }} />
      ) : (
        <FrameIcon className={classes.icon} onClick={handleClick2} />
      )}
        </div>
      </div>
      {props.text?.veryCapableButFasterAndLowerCo != null ? (
        props.text?.veryCapableButFasterAndLowerCo
      ) : (
        <div className={classes.veryCapableButFasterAndLowerCo}>
          Very capable, but faster and lower cost than Davinci.
        </div>
      )}
    </div>
  );
});
                