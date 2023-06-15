import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { Frame2583Icon } from './Frame2583Icon';
import classes from './Frame2624.module.css';
import { LayersIcon } from './LayersIcon';

interface Props {
  className?: string;
  classes?: {
    rectangle319?: string;
    openAi1?: string;
  };
  swap?: {
    layers?: ReactNode;
  };
  text?: {
    chatgpt?: ReactNode;
    _1210ETH?: ReactNode;
    _321000?: ReactNode;
    _1?: ReactNode;
    openAI?: ReactNode;
  };
}
/* @figmaId 146:5657 */
export const Frame2624: FC<Props> = memo(function Frame2624(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      {props.text?._1 != null ? props.text?._1 : <div className={classes._1}>1</div>}
      <div className={classes.frame2623}>
        <div className={classes.frame2628}>
          <div className={`${props.classes?.rectangle319 || ''} ${classes.rectangle319}`}></div>
          <div className={classes.frame2618}>
            {props.text?.chatgpt != null ? props.text?.chatgpt : <div className={classes.chatgpt}>Chatgpt</div>}
            <div className={classes.frame2584}>
              <div className={`${props.classes?.openAi1 || ''} ${classes.openAi1}`}></div>
              {props.text?.openAI != null ? props.text?.openAI : <div className={classes.openAI}>Open AI</div>}
            </div>
          </div>
        </div>
        <div className={classes.frame2599}>
          <div className={classes.frame2562}>
            <div className={classes.frame2583}>
              <Frame2583Icon className={classes.icon} />
            </div>
            {props.text?._1210ETH != null ? props.text?._1210ETH : <div className={classes._1210ETH}>12.10 ETH </div>}
          </div>
          <div className={classes.frame25992}>
            <div className={classes.layers}>{props.swap?.layers || <LayersIcon className={classes.icon2} />}</div>
            {props.text?._321000 != null ? props.text?._321000 : <div className={classes._321000}>32/1000</div>}
          </div>
        </div>
      </div>
    </div>
  );
});
