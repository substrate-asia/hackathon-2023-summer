import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { GenerateThumbnail_statusDefaul } from '../GenerateThumbnail_statusDefaul/GenerateThumbnail_statusDefaul';
import { SelectACSVFile_statusDefault } from '../SelectACSVFile_statusDefault/SelectACSVFile_statusDefault';
import { Add_photo_alternateIcon } from './Add_photo_alternateIcon';
import classes from './NftThumbnailImage_uploadedFals.module.css';
import { Upload_fileIcon } from './Upload_fileIcon';

interface Props {
  className?: string;
  classes?: {
    add_photo_alternate?: string;
  };
  swap?: {
    upload_file?: ReactNode;
    add_photo_alternate?: ReactNode;
  };
}
/* @figmaId 342:8197 */
export const NftThumbnailImage_uploadedFals: FC<Props> = memo(function NftThumbnailImage_uploadedFals(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      {/* <SelectACSVFile_statusDefault
        swap={{
          upload_file: props.swap?.upload_file || <Upload_fileIcon className={classes.icon} />,
        }}
        text={{
          selectFileCSV: <div className={classes.selectFileCSV}>Upload from file (.jpg / .png)</div>,
        }}
      /> */}
      {/* <div className={classes.or}>or</div> */}
      <GenerateThumbnail_statusDefaul
        classes={{ add_photo_alternate: `${props.classes?.add_photo_alternate || ''} ${classes.add_photo_alternate}` }}
        swap={{
          add_photo_alternate: props.swap?.add_photo_alternate || (
            <div className={classes.add_photo_alternate}>
              <Add_photo_alternateIcon className={classes.icon2} />
            </div>
          ),
        }}
      />
    </div>
  );
});
