import { memo, useEffect } from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import React from 'react';
import resets from '../_resets.module.css';
import { Add_photo_alternateIcon } from './Add_photo_alternateIcon';
import { BrushIcon } from './BrushIcon';
import { FilterIcons_iconArt } from './FilterIcons_iconArt/FilterIcons_iconArt';
import { FilterIcons_iconCode } from './FilterIcons_iconCode/FilterIcons_iconCode';
import { FilterIcons_iconLegal } from './FilterIcons_iconLegal/FilterIcons_iconLegal';
import { FilterIcons_iconMedical } from './FilterIcons_iconMedical/FilterIcons_iconMedical';
import { FilterIcons_iconProductivity } from './FilterIcons_iconProductivity/FilterIcons_iconProductivity';
import { FilterIcons_iconSport } from './FilterIcons_iconSport/FilterIcons_iconSport';
import { Frame2680_statusDefault } from './Frame2680_statusDefault/Frame2680_statusDefault';
import { Frame2778Icon } from './Frame2778Icon';
import { Frame_sourceIcon } from './Frame_sourceIcon';
import { IconCollection_iconEthStatusDe } from './IconCollection_iconEthStatusDe/IconCollection_iconEthStatusDe';
import { IconCollection_iconNumberStatu } from './IconCollection_iconNumberStatu/IconCollection_iconNumberStatu';
import { IconCollection_iconStatusDefau } from './IconCollection_iconStatusDefau/IconCollection_iconStatusDefau';
import { Library_add_checkIcon } from './Library_add_checkIcon';
import { Medical_servicesIcon } from './Medical_servicesIcon';
import { MintBottomBar_status2MintingEx } from './MintBottomBar_status2MintingEx/MintBottomBar_status2MintingEx';
import classes from './MintModel.module.css';
import { NftThumbnailImage_uploadedFals } from './NftThumbnailImage_uploadedFals/NftThumbnailImage_uploadedFals';
import { NumbersIcon } from './NumbersIcon';
import { PercentIcon } from './PercentIcon';
import { PolicyIcon } from './PolicyIcon';
import { Sports_basketballIcon } from './Sports_basketballIcon';
import { TextField_statusDefaultProperE } from './TextField_statusDefaultProperE/TextField_statusDefaultProperE';
import { Upload_fileIcon } from './Upload_fileIcon';
import { WarningIcon } from './WarningIcon';
import {useHistory} from 'react-router-dom';
import NFTtokenPairs from '../../../mintedNFT.js';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  className?: string;
  hide?: {
    iconCollection?: boolean;
    iconCollection2?: boolean;
    iconCollection3?: boolean;
  };
  onMint: (token_id: string) => void;
}
/* @figmaId 331:4474 */
export const MintModel: FC<Props> = memo(function MintModel(props = {onMint}) {
  const history = useHistory();
  function handleMintClick(){
    props.onMint('token_id');
  }

  function handleback(){
    window.history.back();
  }
  const [tokenNumber, settokenNumber] = useState('');
  const [creatorEarning, setcreatorEarning] = useState('');
  const [floorPrice, setfloorPrice] = useState('');

  function handletokenNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    settokenNumber(event.target.value);
  }
  function handlecreatorEarningChange(event: React.ChangeEvent<HTMLInputElement>) {
    setcreatorEarning(event.target.value);
  }
  function handlefloorPriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setfloorPrice(event.target.value);
  }

  const [artCate,setartCate] = useState(false);
  const [sportCate,setsportCate] = useState(false);
  const [productivityCate,setproductivityCate] = useState(false);
  const [codingCate,setcodingCate] = useState(false);
  const [medicalCate,setmedicalCate] = useState(false);
  const [legalCate,setlegalCate] = useState(false);

  function handleartCate(){
    setartCate(!artCate);
  }
  function handlesportCate(){
    setsportCate(!sportCate);
  }
  function handleproductivityCate(){
    setproductivityCate(!productivityCate);
  }
  function handlecodingCate(){
    setcodingCate(!codingCate);
  }
  function handlemedicalCate(){
    setmedicalCate(!medicalCate);
  }
  function handlelegalCate(){
    setlegalCate(!legalCate);
  }
  
  const [displayNFT, setdisplayNFT] = useState(false);
  const [loadingNFT, setloadingNFT] = useState(false);


  function handleGenerateImage(){
      // Simulate fetching NFT token pairs

      setTimeout(() => {
        setloadingNFT(true);
      }, 1000);
      console.log(loadingNFT);
      setTimeout(() => {
        setdisplayNFT(true);
        setloadingNFT(false);
      }, 10000);
     
  }

  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame2659}>
        <div className={classes.frame2650}>
          <div className={classes.frame2654}>
            <div className={classes.numberOfTokens}>Number of tokens</div>
          </div>
          {/* <TextField_statusDefaultProperE
            swap={{
              iconCollection: (
                <IconCollection_iconNumberStatu
                  classes={{ numbers: classes.numbers }}
                  swap={{
                    numbers: (
                      <div className={classes.numbers}>
                        <NumbersIcon className={classes.icon} />
                      </div>
                    ),
                  }}
                />
              ),
            }}
            hide={{
              iconCollection: true,
            }}
            text={{
              eGNameGPT: <div className={classes.eGNameGPT}>1 - 10,000</div>,
            }}
          /> */}

          <div className='text-field-input'>
           <input type="text" placeholder="# 1 - 10,000" style={{
                        backgroundColor: 'transparent',
                        width: '500px', borderColor: 'transparent',
                        borderWidth: '0px', fontSize: '16px',
                        color: "white",
                        opacity: "0.7", outline: 'none'
                    }} 
                    value={tokenNumber}
                    onChange={handletokenNumberChange}/>
            </div>
        </div>
        <div className={classes.frame2785}>
          <div className={classes.frame2787}>
            <div className={classes.frame26542}>
              <div className={classes.creatorEarning}>Creator earning %</div>
            </div>
            <div className={classes.percentageOfPaymentYouEarnPerT}>
              Percentage of payment you earn per transaction.{' '}
            </div>
          </div>
          {/* <TextField_statusDefaultProperE
            swap={{
              iconCollection: (
                <IconCollection_iconStatusDefau
                  classes={{ percent: classes.percent }}
                  swap={{
                    percent: (
                      <div className={classes.percent}>
                        <PercentIcon className={classes.icon2} />
                      </div>
                    ),
                  }}
                />
              ),
            }}
            hide={{
              iconCollection: true,
            }}
            text={{
              eGNameGPT: <div className={classes.eGNameGPT2}>1-100</div>,
            }}
          /> */}
                     <input type="text" placeholder="% 1 - 100" style={{
                        backgroundColor: 'transparent',
                        width: '500px', borderColor: 'transparent',
                        borderWidth: '0px', fontSize: '16px',
                        color: "white",
                        opacity: "0.7", outline: 'none'
                    }} 
                    value={creatorEarning}
                    onChange={handlecreatorEarningChange}/>
        </div>
        <div className={classes.frame2660}>
          <div className={classes.frame2786}>
            <div className={classes.frame26543}>
              <div className={classes.floorPrice}>Floor price</div>
            </div>
            <div className={classes.theBasePricePerEveryIndividual}>
              The base price per every individual token. 1 NFT = 100 prompt that the user enters.{' '}
            </div>
          </div>
          {/* <TextField_statusDefaultProperE
            swap={{
              iconCollection: <IconCollection_iconEthStatusDe classes={{ union: classes.union }} />,
            }}
            hide={{
              iconCollection: true,
            }}
            text={{
              eGNameGPT: <div className={classes.eGNameGPT3}>0.00</div>,
            }}
          /> */}
            <input type="text" placeholder="⧫ 0.00" style={{
                        backgroundColor: 'transparent',
                        width: '500px', borderColor: 'transparent',
                        borderWidth: '0px', fontSize: '16px',
                        color: "white",
                        opacity: "0.7", outline: 'none'
                    }} 
                    value={floorPrice}
                    onChange={handlefloorPriceChange}/>
        </div>
        <div className={classes.frame27862}>
          <div className={classes.frame27863}>
            <div className={classes.frame26544}>
              <div className={classes.category}>Category</div>
            </div>
            <div className={classes.chooseATagThatBestDescribesYou}>Choose a tag that best describes your model. </div>
          </div>

          <div className={classes.frame2788}>
            <div onClick={handleartCate}>
            <Frame2680_statusDefault
              clicked={artCate}
              swap={{
                filterIcons: (
                  <FilterIcons_iconArt
                  
                    className={classes.filterIcons}
                    swap={{
                      brush: <BrushIcon className={classes.icon3} />,
                    }}
                  />
                ),
              }}
              text={{
                video: <div className={classes.video}>Art</div>,
              }}
            />
          </div>

          <div onClick={handlesportCate}>
            <Frame2680_statusDefault
              clicked={sportCate}
              swap={{
                filterIcons: (
                  <FilterIcons_iconSport
                    className={classes.filterIcons2}
                    swap={{
                      sports_basketball: <Sports_basketballIcon className={classes.icon4} />,
                    }}
                  />
                ),
              }}
              text={{
                video: <div className={classes.video2}>Sport</div>,
              }}
            />
            </div>
            <div onClick={handleproductivityCate}>
            <Frame2680_statusDefault
            clicked={productivityCate}
              swap={{
                filterIcons: (
                  <FilterIcons_iconProductivity
                    className={classes.filterIcons3}
                    swap={{
                      library_add_check: <Library_add_checkIcon className={classes.icon5} />,
                    }}
                  />
                ),
              }}
              text={{
                video: <div className={classes.video3}>Productivity</div>,
              }}
            />
            </div>
            <div onClick={handlecodingCate}>
            <Frame2680_statusDefault
              clicked={codingCate}

              swap={{
                filterIcons: (
                  <FilterIcons_iconCode
                    className={classes.filterIcons4}
                    swap={{
                      frame_source: <Frame_sourceIcon className={classes.icon6} />,
                    }}
                  />
                ),
              }}
              text={{
                video: <div className={classes.video4}>Coding</div>,
              }}
            />
            </div>
            <div onClick={handlemedicalCate}>
            <Frame2680_statusDefault
              clicked={medicalCate}
              swap={{
                filterIcons: (
                  <FilterIcons_iconMedical
                    className={classes.filterIcons5}
                    swap={{
                      medical_services: <Medical_servicesIcon className={classes.icon7} />,
                    }}
                  />
                ),
              }}
              text={{
                video: <div className={classes.video5}>Medical</div>,
              }}
            />
            </div>
            <div onClick={handlelegalCate}>
            <Frame2680_statusDefault
              clicked={legalCate}
              swap={{
                filterIcons: (
                  <FilterIcons_iconLegal
                    className={classes.filterIcons6}
                    swap={{
                      policy: <PolicyIcon className={classes.icon8} />,
                    }}
                  />
                ),
              }}
              text={{
                video: <div className={classes.video6}>Legal</div>,
              }}
            />
             </div>
          </div>
        </div>
        <div className={classes.frame2784}>
          <div className={classes.nFTThumbnailImage}>NFT thumbnail image</div>
         
         <div onClick={handleGenerateImage}>
          {displayNFT == false ? (<NftThumbnailImage_uploadedFals
            classes={{ add_photo_alternate: classes.add_photo_alternate }}
            swap={{
              upload_file: <Upload_fileIcon className={classes.icon9} />,
              add_photo_alternate: (
                <div className={classes.add_photo_alternate}>
                  <Add_photo_alternateIcon className={classes.icon10} />
                </div>
              ),
            }}
          />) :
            (<img src={NFTtokenPairs[0][0].toString()} style={{ width: '150%', height: '150%' }}></img>)
        
          }

          {loadingNFT && <CircularProgress />}
        </div>

        </div>
      </div>
      <div onClick={handleMintClick}>
      <MintBottomBar_status2MintingEx
        className={classes.mintBottomBar}
        classes={{ union: classes.union2 }}
        swap={{
          warning: <WarningIcon className={classes.icon11} />,
        }}
      />
      </div>

      <div className={classes.modelCard}></div>
      <div className={classes.frame2778}>
        <div className={classes.frame431}>
          <div onClick={handleback} className={classes.frame27782}>
            <Frame2778Icon className={classes.icon12} />
          </div>
        </div>
        <div className={classes.frame2777}>
          <div className={classes.mintYourNFT}>Mint your NFT</div>
          <div className={classes.modelNameGPT3}>Model name GPT3</div>
        </div>
      </div>
    </div>
  );
});

export default MintModel;