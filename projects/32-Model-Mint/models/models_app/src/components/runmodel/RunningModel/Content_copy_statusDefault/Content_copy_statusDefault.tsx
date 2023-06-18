import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './Content_copy_statusDefault.module.css';
import { Content_copyIcon } from './Content_copyIcon';

interface Props {
  className?: string;
  classes?: {
    content_copy?: string;
  };
}
/* @figmaId 342:6690 */
export const Content_copy_statusDefault: FC<Props> = memo(function Content_copy_statusDefault(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.content_copy || ''} ${classes.content_copy}`}>
        <Content_copyIcon className={classes.icon} />
      </div>
    </div>
  );
});
