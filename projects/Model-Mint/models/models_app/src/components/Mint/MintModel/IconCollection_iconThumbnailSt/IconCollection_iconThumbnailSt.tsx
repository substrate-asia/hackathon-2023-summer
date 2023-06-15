import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { Add_photo_alternateIcon } from './Add_photo_alternateIcon';
import classes from './IconCollection_iconThumbnailSt.module.css';

interface Props {
  className?: string;
  classes?: {
    add_photo_alternate?: string;
  };
  swap?: {
    add_photo_alternate?: ReactNode;
  };
}
/* @figmaId 336:5660 */
export const IconCollection_iconThumbnailSt: FC<Props> = memo(function IconCollection_iconThumbnailSt(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.add_photo_alternate || ''} ${classes.add_photo_alternate}`}>
        {props.swap?.add_photo_alternate || <Add_photo_alternateIcon className={classes.icon} />}
      </div>
    </div>
  );
});
