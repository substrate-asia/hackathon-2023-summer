import { memo } from 'react';
import type { FC, ReactNode } from 'react';
import React from 'react';
import resets from '../../_resets.module.css';
import { SearchIcon } from './SearchIcon';
import classes from './TextField_statusDefault.module.css';
import { TextField } from "@mui/material";

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  hide?: {
    search?: boolean;
  };
  text?: {
    eGNameGPT?: ReactNode;
  };
  onNameChange?: (nameValue: string) => void;
}
/* @figmaId 178:4180 */
export const TextField_statusDefault: FC<Props> = memo(function TextField_statusDefault(props = {}) {
  let [nameValue, setnameValue] = React.useState('e.g. nameGPT');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setnameValue(event.target.value);
    if (props.onNameChange) {
      props.onNameChange(event.target.value); // Call the callback function with the nameValue state
    }
  };
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setnameValue('');
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (nameValue === '') {
      setnameValue('e.g. nameGPT');
    }
  };
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {!props.hide?.search && (
        <div className={classes.search}>
          <SearchIcon className={classes.icon} />
        </div>
      )}
      {props.text?.eGNameGPT != null ? props.text?.eGNameGPT : <div className={classes.eGNameGPT}>
            
        <div className="name-input-container">
       

        <TextField  value={nameValue}
         onFocus={handleFocus}
         onBlur={handleBlur}
          onChange={handleChange}
         InputProps={{ // Add the InputProps prop
          style: { color: "white" , 
        backgroundColor: "transparent",
        } } }
        id="fullWidth"/>   
        </div>   
        </div>}
    </div>
  );
});
