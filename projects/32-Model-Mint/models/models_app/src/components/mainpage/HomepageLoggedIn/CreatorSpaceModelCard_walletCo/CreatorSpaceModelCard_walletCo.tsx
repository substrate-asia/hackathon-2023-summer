import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { TextField_statusDefaultProperE } from '../TextField_statusDefaultProperE/TextField_statusDefaultProperE';
import classes from './CreatorSpaceModelCard_walletCo.module.css';
import { Frame2540Icon } from './Frame2540Icon';

interface Props {
  className?: string;
  classes?: {
    _20228418174?: string;
    group27?: string;
    search?: string;
    send?: string;
    root?: string;
  };
  swap?: {
    frame2540?: ReactNode;
  };
}
/* @figmaId 94:11182 */
export const CreatorSpaceModelCard_walletCo: FC<Props> = memo(function CreatorSpaceModelCard_walletCo(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame2541}>
        <div className={classes.frame2791}>
          <div className={classes.frame2542}>
            <div className={`${props.classes?.group27 || ''} ${classes.group27}`}>
              <div className={`${props.classes?._20228418174 || ''} ${classes._20228418174}`}></div>
            </div>
            <div className={classes.modelMint}>ModelMint</div>
          </div>
          <TextField_statusDefaultProperE
            className={classes.textField}
            classes={{
              search: `${props.classes?.search || ''} ${classes.search}`,
              send: `${props.classes?.send || ''} ${classes.send}`,
            }}
            text={{
              eGNameGPT: <div className={classes.eGNameGPT}>Search models</div>,
            }}
          />
        </div>
        <div className={classes.frame2560}>
          <div className={classes.creatorSpace}>Creator Space </div>
          <div className={classes.frame2540}>{props.swap?.frame2540 || <Frame2540Icon className={classes.icon} />}</div>
        </div>
      </div>
      <div className={classes.line34}></div>
    </div>
  );
});
