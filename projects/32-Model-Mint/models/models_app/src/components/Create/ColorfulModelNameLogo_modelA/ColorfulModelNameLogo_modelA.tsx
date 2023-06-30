import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './ColorfulModelNameLogo_modelA.module.css';
import { Frame9Icon } from './Frame9Icon';

interface Props {
  className?: string;
}
/* @figmaId 163:2253 */
export const ColorfulModelNameLogo_modelA: FC<Props> = memo(function ColorfulModelNameLogo_modelA(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame9}>
        <Frame9Icon className={classes.icon} />
      </div>
      <div className={classes.ada}>Ada</div>
    </div>
  );
});
