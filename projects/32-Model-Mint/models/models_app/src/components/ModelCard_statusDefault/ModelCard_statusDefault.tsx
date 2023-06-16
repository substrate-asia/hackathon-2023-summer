import { memo } from 'react';
import type { FC } from 'react';

import resets from '../_resets.module.css';
import { FrameIcon2 } from './FrameIcon2.tsx';
import { FrameIcon } from './FrameIcon.tsx';
import classes from './ModelCard_statusDefault.module.css';
import image_a from './model_images/a.jpg';
import image_b from './model_images/b.jpg';
import image_c from './model_images/c.jpg';
import image_d from './model_images/d.jpg';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import deleteIcon from './icons/delete.png';
import editIcon from './icons/edit.png';
import mintIcon from './icons/mint.png';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { ModelNameLogo_modelVariant2 } from './ModelNameLogo_modelVariant2/ModelNameLogo_modelVariant2.tsx';
import React from 'react';
import { on } from 'process';
interface Props {
  id: string;
  className?: string;
  title: string;
  description: string;
  modelImage: string;
  onDelete: (id:string, data: string) => void;
  onRun : (id:string) => void;
  onMint: (id:string) => void;
}
/* @figmaId 7:288 */
export const ModelCard_statusDefault: FC<Props> = memo(function ModelCard_statusDefault({id,title, description,modelImage, onDelete, onRun, onMint}: Props) {
  
  let imageSrc;
  if (modelImage === 'image-a') {
    imageSrc = image_a;
  } else if (modelImage === 'image-b') {
    imageSrc = image_b;
  } else if (modelImage === 'image-c') {
    imageSrc = image_c;
  } else if (modelImage === 'image-d') {
    imageSrc = image_d;
  } 

function handleClick(){
  console.log('Clicked delete button with id:', id);
  onDelete(id, title);
}

function handleRun(){
  console.log('Clicked run button with id:', id);
  onRun(id);
}

function handleMint(){
  console.log('Clicked mint button with id:', id);
  onMint(id);
}
  return (
    <div>

{/* <button onClick={handleClick}>Delete</button> */}


    <div className={`${resets.clapyResets} ${classes.root}`}>
     
      <div className={classes.rectangle1}></div>
      <div className={classes.gPT3IsTheLanguageModelIMCurren}>
        {description}
      </div>
      <div className={classes.frame5}>
        <div className={classes.frame}>
          {/* <FrameIcon className={classes.icon}/> */}
          {/* <img src={editIcon} alt='edit' width='20' height='20' style={{marginLeft:'20px',marginRight: '10px'}}  / >
        */}
       {/* add some space between two images */}


        <div onClick={handleClick}>
        <img src={deleteIcon} alt='delete' width='20' height='20'  / >
        </div>
       

{/* change the color to blue */}
        <div onClick={handleRun} className={classes.edit} style={{marginLeft:'12px', color: 'rgb(66,110,132)' }}>
      <PlayArrowIcon width='20' height='20' />
      </div>
        </div>
        <div className={classes.frame4}>
          <div className={classes.frame2}>

            {/* <FrameIcon2 className={classes.icon2} /> */}

          </div>
          {/* <div className={classes.run}>Run</div> */}
          <img onClick={handleMint} src={mintIcon} alt='edit' width='80' height='30' style={{marginRight:'10px'}} / >
        </div>
      </div>
      <div style={{marginTop:'-15px'}} className={classes.modelNameGPT3}>{title}</div>

    
      {/* insert image in model_image folder */}
      <div className={classes.modelImage}>
    

      {/* <button onClick={handleClick}>Send Data to Parent</button> */}


      {imageSrc==image_a && <img src={imageSrc} alt='model' width='60' height='60' style={{marginRight: '10px'}} / >}
      {imageSrc==image_b && <img src={imageSrc} alt='model' width='100' height='60'  style={{marginRight: '10px'}}/ >}
      {imageSrc==image_c && <img src={imageSrc} alt='model' width='70' height='60' style={{marginRight: '10px'}} / >}
      {imageSrc==image_d && <img src={imageSrc} alt='model' width='90' height='60' style={{marginRight: '10px'}} / >}
      </div>

    

      {/* <ModelNameLogo_modelVariant2 className={classes.modelNameLogo} /> */}
    </div>
    </div>
  );
});
