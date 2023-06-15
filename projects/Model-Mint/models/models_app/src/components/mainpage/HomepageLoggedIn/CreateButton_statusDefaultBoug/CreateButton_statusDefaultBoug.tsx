import { memo, useEffect, useRef } from 'react';
import type { FC } from 'react';
import resets from '../../_resets.module.css';
import { CreateButton_statusDefaultSize2 } from '../CreateButton_statusDefaultSize2/CreateButton_statusDefaultSize2';
import { IconCollection_iconBuyStatusDe } from '../IconCollection_iconBuyStatusDe/IconCollection_iconBuyStatusDe';
import classes from './CreateButton_statusDefaultBoug.module.css';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { enableOKXWallet } from './okxIntegration';
import zokshUrl from '../../../../zoksh';
import sponsorImage from './sponsor.png';
import fullsponsorImage from './fullsponsor.png'
import { useHistory } from 'react-router-dom';

interface Props {
  className?: string;
  classes?: {
    local_mall?: string;
    root?: string;
  };
}

export const CreateButton_statusDefaultBoug: FC<Props> = memo(function CreateButton_statusDefaultBoug(props = {}) {
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const history = useHistory();
  function handleBuy() {
    if (window.okxwallet) {
      console.log('Buy button clicked');
      enableOKXWallet(buyButtonRef.current);
    } else {
      alert('OKX Wallet is not installed. Please install it to proceed with the purchase.');
    }
  }

  function handleSqaurePay() {
    console.log('Sqaure Pay button clicked');
    history.push('/payment');

  }

  useEffect(() => {
    if (window.okxwallet) {
      enableOKXWallet(buyButtonRef.current);
    }
  }, []);

  return (
    <>
      <button
        ref={buyButtonRef}
        onClick={handleBuy}
        className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}
      >
        <CreateButton_statusDefaultSize2
          className={classes.createButton}
          swap={{
            iconCollection: (
              <IconCollection_iconBuyStatusDe
                className={classes.iconCollection}
                classes={{ local_mall: classes.local_mall }}
                swap={{
                  local_mall: (
                    <div className={classes.local_mall} style={{ color: 'rgb(22,37,43)' }}>
                      <LocalMallIcon />
                    </div>
                  ),
                }}
              />
            ),
          }}
          text={{
            createAModel: <div className={classes.createAModel}>Buy with ETH</div>,
          }}
        />
      </button>



      <button
        onClick={handleSqaurePay}
        className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root} ${classes.fiatPay}`}
      >
        <CreateButton_statusDefaultSize2
          className={classes.createButton}
          swap={{
            iconCollection: (
              <IconCollection_iconBuyStatusDe
                className={classes.iconCollection}
                classes={{ local_mall: classes.local_mall }}
                swap={{
                  local_mall: (
                    <div className={classes.local_mall} style={{ color: 'rgb(22,37,43)' }}>
                      <LocalMallIcon />
                    </div>
                  ),
                }}
              />
            ),
          }}
          text={{
            createAModel: <div className={`${classes.createAModel} ${classes.fiatPayText}`}>buy ETH through card<br /> powered by Sqaure
            </div>,
          }}
          
        />
      </button>

      <div className={classes.sponsorImageContainer}>
      <img src={sponsorImage} alt="" className={classes.sponsorclass} />
</div>

      <div className={classes.fullsponsorImageContainer}>
      <img src={fullsponsorImage} alt="" className={classes.fullsponsorclass} />
</div>

    </>
  );
});



