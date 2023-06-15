import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconSearchStatu.module.css';
import { SearchIcon } from './SearchIcon';

interface Props {
  className?: string;
  classes?: {
    search?: string;
  };
}
/* @figmaId 336:5361 */
export const IconCollection_iconSearchStatu: FC<Props> = memo(function IconCollection_iconSearchStatu(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.search || ''} ${classes.search}`}>
        <SearchIcon className={classes.icon} />
      </div>
    </div>
  );
});
