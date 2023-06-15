import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { IconCollection_iconPlusStatusD } from '../IconCollection_iconPlusStatusD/IconCollection_iconPlusStatusD';
import classes from './CreateButton_statusDefaultSize2.module.css';
import { Icon } from './Icon';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    iconCollection?: ReactNode;
  };
  text?: {
    createAModel?: ReactNode;
  };
}
/* @figmaId 323:4105 */
export const CreateButton_statusDefaultSize2: FC<Props> = memo(function CreateButton_statusDefaultSize2(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.swap?.iconCollection || (
        <IconCollection_iconPlusStatusD
          className={classes.iconCollection}
          classes={{ unnamed: classes.unnamed }}
          swap={{
            unnamed: (
              <div className={classes.unnamed}>
                <Icon className={classes.icon} />
              </div>
            ),
          }}
        />
      )}
      {props.text?.createAModel != null ? (
        props.text?.createAModel
      ) : (
        <div className={classes.createAModel}>Create a model</div>
      )}
    </div>
  );
});
