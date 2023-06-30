import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './ColorfulModelNameLogo_modelD.module.css';
import { Frame11Icon } from './Frame11Icon';

interface Props {
  className?: string;
  swap?: {
    frame11?: ReactNode;
  };
}
/* @figmaId 163:2295 */
export const ColorfulModelNameLogo_modelD: FC<Props> = memo(function ColorfulModelNameLogo_modelD(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame11}>{props.swap?.frame11 || <Frame11Icon className={classes.icon} />}</div>
      <div className={classes.daVinci}>daVinci</div>
    </div>
  );
});
