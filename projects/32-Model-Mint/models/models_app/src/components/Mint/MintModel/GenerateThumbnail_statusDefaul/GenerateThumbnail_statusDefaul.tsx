import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { IconCollection_iconThumbnailSt } from '../IconCollection_iconThumbnailSt/IconCollection_iconThumbnailSt';
import { Add_photo_alternateIcon } from './Add_photo_alternateIcon';
import classes from './GenerateThumbnail_statusDefaul.module.css';

interface Props {
  className?: string;
  classes?: {
    add_photo_alternate?: string;
  };
  swap?: {
    add_photo_alternate?: ReactNode;
  };
}
/* @figmaId 337:5842 */
export const GenerateThumbnail_statusDefaul: FC<Props> = memo(function GenerateThumbnail_statusDefaul(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <IconCollection_iconThumbnailSt
        classes={{ add_photo_alternate: `${props.classes?.add_photo_alternate || ''} ${classes.add_photo_alternate}` }}
        swap={{
          add_photo_alternate: props.swap?.add_photo_alternate || (
            <div className={classes.add_photo_alternate}>
              <Add_photo_alternateIcon className={classes.icon} />
            </div>
          ),
        }}
      />
      <div className={classes.saveToDraft}>Generate thumbnail from AI</div>
    </div>
  );
});
