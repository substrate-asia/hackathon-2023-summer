import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { FilterIcons_iconVideo } from '../FilterIcons_iconVideo/FilterIcons_iconVideo';
import classes from './Frame2680_statusDefault.module.css';

interface Props {
  className?: string;
  swap?: {
    filterIcons?: ReactNode;
  };
  text?: {
    video?: ReactNode;
  };
  clicked?: boolean;
}
/* @figmaId 207:3217 */
export const Frame2680_statusDefault: FC<Props> = memo(function Frame2680_statusDefault(props = {}) {
  if(props.clicked){
 return (
    <div style={{  backgroundColor: 'rgb(42,62,72)'}} className={`${resets.clapyResets} ${classes.root}`}>
      {props.swap?.filterIcons || <FilterIcons_iconVideo className={classes.filterIcons} />}
      {props.text?.video != null ? props.text?.video : <div className={classes.video}>Video</div>}
    </div>
  );}
  else{
    return (
      <div className={`${resets.clapyResets} ${classes.root}`}>
        {props.swap?.filterIcons || <FilterIcons_iconVideo className={classes.filterIcons} />}
        {props.text?.video != null ? props.text?.video : <div className={classes.video}>Video</div>}
      </div>
    );
  }

});
