import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './ColorfulModelNameLogo_modelB.module.css';
import { Frame12Icon } from './Frame12Icon';

interface Props {
  className?: string;
}
/* @figmaId 163:2255 */
export const ColorfulModelNameLogo_modelB: FC<Props> = memo(function ColorfulModelNameLogo_modelB(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame12}>
        <Frame12Icon className={classes.icon} />
      </div>
      <div className={classes.babbage}>Babbage</div>
    </div>
  );
});
