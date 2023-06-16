import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './FilterIcons_iconMedical.module.css';
import { Medical_servicesIcon } from './Medical_servicesIcon';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    medical_services?: ReactNode;
  };
}
/* @figmaId 209:3122 */
export const FilterIcons_iconMedical: FC<Props> = memo(function FilterIcons_iconMedical(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.medical_services}>
        {props.swap?.medical_services || <Medical_servicesIcon className={classes.icon} />}
      </div>
    </div>
  );
});
