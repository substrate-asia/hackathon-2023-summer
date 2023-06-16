import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { IconCollection_iconSearchStatu } from '../IconCollection_iconSearchStatu/IconCollection_iconSearchStatu';
import { IconCollection_iconSendStatusD } from '../IconCollection_iconSendStatusD/IconCollection_iconSendStatusD';
import { SendIcon } from './SendIcon';
import classes from './TextField_statusDefaultProperE.module.css';

interface Props {
  className?: string;
  classes?: {
    search?: string;
    send?: string;
    root?: string;
  };
  text?: {
    eGNameGPT?: ReactNode;
  };
}
/* @figmaId 178:4180 */
export const TextField_statusDefaultProperE: FC<Props> = memo(function TextField_statusDefaultProperE(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame2780}>
        <IconCollection_iconSearchStatu classes={{ search: `${props.classes?.search || ''} ${classes.search}` }} />
        {props.text?.eGNameGPT != null ? props.text?.eGNameGPT : <div className={classes.eGNameGPT}>e.g. nameGPT</div>}
      </div>
      <IconCollection_iconSendStatusD
        classes={{ send: `${props.classes?.send || ''} ${classes.send}` }}
        swap={{
          send: (
            <div className={classes.send}>
              <SendIcon className={classes.icon} />
            </div>
          ),
        }}
      />
    </div>
  );
});
