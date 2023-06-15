import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { Vector_statusDefaultSizeDefaul } from '../Vector_statusDefaultSizeDefaul/Vector_statusDefaultSizeDefaul';
import { BackupIcon } from './BackupIcon';
import { Frame2582Icon } from './Frame2582Icon';
import { LayersIcon } from './LayersIcon';
import classes from './ModelCardFullImage_statusDefau.module.css';

interface Props {
  className?: string;
  classes?: {
    openAi1?: string;
    rectangle319?: string;
  };
  swap?: {
    backup?: ReactNode;
    layers?: ReactNode;
  };
  text?: {
    openAI?: ReactNode;
    _200ETH?: ReactNode;
    _1210ETHTotal?: ReactNode;
    _19200Owned?: ReactNode;
    modelNameGPT3?: ReactNode;
    gPT3IsTheLanguageModelIMCurren?: ReactNode;
  };
}
/* @figmaId 112:1559 */
export const ModelCardFullImage_statusDefau: FC<Props> = memo(function ModelCardFullImage_statusDefau(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame2573}>
        <div className={classes.frame2584}>
          <div className={`${props.classes?.openAi1 || ''} ${classes.openAi1}`}></div>
          {props.text?.openAI != null ? props.text?.openAI : <div className={classes.openAI}>Open AI</div>}
        </div>
        <div className={classes.frame4}>
          {props.text?._200ETH != null ? props.text?._200ETH : <div className={classes._200ETH}>0.200 ETH</div>}
          <div className={classes.frame2585}>
            <div className={classes._1k}>/ 1k </div>
            <div className={classes.backup}>{props.swap?.backup || <BackupIcon className={classes.icon} />}</div>
          </div>
        </div>
      </div>
      <div className={`${props.classes?.rectangle319 || ''} ${classes.rectangle319}`}></div>
      <div className={classes.frame2563}>
        <div className={classes.frame2562}>
          {props.text?._1210ETHTotal != null ? (
            props.text?._1210ETHTotal
          ) : (
            <div className={classes._1210ETHTotal}>12.10 ETH total</div>
          )}
          <div className={classes.frame2582}>
            <Frame2582Icon className={classes.icon2} />
          </div>
        </div>
        <div className={classes.frame2561}>
          {props.text?._19200Owned != null ? (
            props.text?._19200Owned
          ) : (
            <div className={classes._19200Owned}>19/200 owned</div>
          )}
          <div className={classes.layers}>{props.swap?.layers || <LayersIcon className={classes.icon3} />}</div>
        </div>
      </div>
      <div className={classes.frame2565}>
        <div className={classes.frame2586}>
          {props.text?.modelNameGPT3 != null ? (
            props.text?.modelNameGPT3
          ) : (
            <div className={classes.modelNameGPT3}>Model name GPT3</div>
          )}
          <Vector_statusDefaultSizeDefaul />
        </div>
        {props.text?.gPT3IsTheLanguageModelIMCurren != null ? (
          props.text?.gPT3IsTheLanguageModelIMCurren
        ) : (
          <div className={classes.gPT3IsTheLanguageModelIMCurren}>
            GPT-3 is the language model I’m currently writing a nonsense...
          </div>
        )}
      </div>
    </div>
  );
});
