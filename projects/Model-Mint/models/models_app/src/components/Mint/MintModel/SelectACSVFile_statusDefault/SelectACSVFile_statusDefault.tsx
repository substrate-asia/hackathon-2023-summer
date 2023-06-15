import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './SelectACSVFile_statusDefault.module.css';
import { Upload_fileIcon } from './Upload_fileIcon';

interface Props {
  className?: string;
  swap?: {
    upload_file?: ReactNode;
  };
  text?: {
    selectFileCSV?: ReactNode;
  };
}
/* @figmaId 163:2514 */
export const SelectACSVFile_statusDefault: FC<Props> = memo(function SelectACSVFile_statusDefault(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.upload_file}>
        {props.swap?.upload_file || <Upload_fileIcon className={classes.icon} />}
      </div>
      {props.text?.selectFileCSV != null ? (
        props.text?.selectFileCSV
      ) : (
        <div className={classes.selectFileCSV}>Select file (.CSV)</div>
      )}
    </div>
  );
});
