import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { IconCollection_iconPlusStatusD } from '../IconCollection_iconPlusStatusD/IconCollection_iconPlusStatusD';
import classes from './CreateButton_statusDefaultSize.module.css';
import AddIcon from '@mui/icons-material/Add';
import {useHistory} from 'react-router-dom';

interface Props {
  className?: string;
  classes?: {
    unnamed?: string;
    root?: string;
  };
  text?: {
    createAModel?: ReactNode;
  };
}
/* @figmaId 196:3853 */
export const CreateButton_statusDefaultSize: FC<Props> = memo(function CreateButton_statusDefaultSize(props = {}) {
  const history = useHistory();
  function handleClick(){
    history.push('/models');
  }
  return (
    <button onClick={handleClick} className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {/* <IconCollection_iconPlusStatusD classes={{ unnamed: `${props.classes?.unnamed || ''}
       ${classes.unnamed}` }} /> */}
       <AddIcon className={classes.unnamed }  style={{ color: 'rgb(22,37,43)' }}/>
      {props.text?.createAModel != null ? (
        props.text?.createAModel
      ) : (
        <div className={classes.createAModel}>Create a model</div>
      )}
    </button>
  );
});
