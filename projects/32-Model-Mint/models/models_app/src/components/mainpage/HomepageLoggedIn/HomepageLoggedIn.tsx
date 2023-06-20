import { memo } from 'react';
import type { FC } from 'react';

import resets from '../_resets.module.css';
import { BackupIcon } from './BackupIcon';
import { BackupIcon2 } from './BackupIcon2';
import { BackupIcon3 } from './BackupIcon3';
import { BackupIcon4 } from './BackupIcon4';
import { BackupIcon5 } from './BackupIcon5';
import { BackupIcon6 } from './BackupIcon6';
import { BackupIcon7 } from './BackupIcon7';
import { BackupIcon8 } from './BackupIcon8';
import { BackupIcon9 } from './BackupIcon9';
import { CreateButton_statusDefaultBoug } from './CreateButton_statusDefaultBoug/CreateButton_statusDefaultBoug';
import { CreateButton_statusDefaultSize } from './CreateButton_statusDefaultSize/CreateButton_statusDefaultSize';
import { CreatorSpaceModelCard_walletCo } from './CreatorSpaceModelCard_walletCo/CreatorSpaceModelCard_walletCo';
import { Frame2540Icon } from './Frame2540Icon';
import { Frame2582Icon } from './Frame2582Icon';
import { Frame2624 } from './Frame2624/Frame2624';
import classes from './HomepageLoggedIn.module.css';
import { LayersIcon } from './LayersIcon';
import { LayersIcon2 } from './LayersIcon2';
import { LayersIcon3 } from './LayersIcon3';
import { LayersIcon4 } from './LayersIcon4';
import { LayersIcon5 } from './LayersIcon5';
import { LayersIcon6 } from './LayersIcon6';
import { LayersIcon7 } from './LayersIcon7';
import { LayersIcon8 } from './LayersIcon8';
import { LayersIcon9 } from './LayersIcon9';
import { LayersIcon10 } from './LayersIcon10';
import { LayersIcon11 } from './LayersIcon11';
import { LayersIcon12 } from './LayersIcon12';
import { LayersIcon13 } from './LayersIcon13';
import { LayersIcon14 } from './LayersIcon14';
import { LayersIcon15 } from './LayersIcon15';
import { LayersIcon16 } from './LayersIcon16';
import { LayersIcon17 } from './LayersIcon17';
import { ModelCardFullImage_statusDefau } from './ModelCardFullImage_statusDefau/ModelCardFullImage_statusDefau';
import { Vector_statusDefaultSizeBig } from './Vector_statusDefaultSizeBig/Vector_statusDefaultSizeBig';
import { useHistory } from 'react-router-dom';

interface Props {
  className?: string;
}
/* @figmaId 33:1831 */
export const HomepageLoggedIn: FC<Props> = memo(function HomepageLoggedIn(props = {}) {
  const history = useHistory();

  function handleTryModel(){
    history.push('./try-model?id=9K6Q1AJHosMfPgHnPvEj');
  }
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.nikuowwi_large_dark_chamber_wi}></div>
      <div onClick={handleTryModel} className={classes.rectangle346 }></div>
      <div className={classes.nikuowwi_website_UI_background}></div>
      <div className={classes.line161}></div>
      <div className={classes.frame2639}>
        <div className={classes.frame2589}>
          <div className={classes.modelGallery}>Model gallery</div>
        </div>
      </div>
      <div className={classes.frame2634}>
        <div className={classes.frame2632}>
          <Frame2624
            classes={{ rectangle319: classes.rectangle319, openAi1: classes.openAi1 }}
            swap={{
              layers: <LayersIcon className={classes.icon} />,
            }}
            text={{
              chatgpt: <div className={classes.chatgpt}>ImageGPT</div>,
              _1210ETH: <div className={classes._1210ETH}>81.00 ETH </div>,
              _321000: <div className={classes._321000}>981 / 1000</div>,
            }}
          />
          <Frame2624
            classes={{ rectangle319: classes.rectangle3192, openAi1: classes.openAi12 }}
            swap={{
              layers: <LayersIcon2 className={classes.icon2} />,
            }}
            text={{
              _1: <div className={classes._1}>2</div>,
              chatgpt: <div className={classes.chatgpt2}>Image-to-Art </div>,
              openAI: <div className={classes.openAI}>Yuga Labs</div>,
              _1210ETH: <div className={classes._1210ETH2}>67.29 ETH </div>,
              _321000: <div className={classes._3210002}>620 / 1000</div>,
            }}
          />
          <Frame2624
            classes={{ rectangle319: classes.rectangle3193, openAi1: classes.openAi13 }}
            swap={{
              layers: <LayersIcon3 className={classes.icon3} />,
            }}
            text={{
              _1: <div className={classes._12}>3</div>,
              chatgpt: <div className={classes.chatgpt3}>ArtiVox</div>,
              openAI: <div className={classes.openAI2}>RhombusAI</div>,
              _1210ETH: <div className={classes._1210ETH3}>61.82 ETH </div>,
              _321000: <div className={classes._3210003}>599 / 1000</div>,
            }}
          />
          <Frame2624
            classes={{ rectangle319: classes.rectangle3194, openAi1: classes.openAi14 }}
            swap={{
              layers: <LayersIcon4 className={classes.icon4} />,
            }}
            text={{
              _1: <div className={classes._13}>4</div>,
              chatgpt: <div className={classes.chatgpt4}>Text-to-code</div>,
              _1210ETH: <div className={classes._1210ETH4}>52.16 ETH </div>,
              _321000: <div className={classes._3210004}>758 / 1000</div>,
            }}
          />
        </div>
        <div className={classes.frame2633}>
          <Frame2624
            classes={{ rectangle319: classes.rectangle3195, openAi1: classes.openAi15 }}
            swap={{
              layers: <LayersIcon5 className={classes.icon5} />,
            }}
            text={{
              _1: <div className={classes._14}>5</div>,
              chatgpt: <div className={classes.chatgpt5}>MusicLM</div>,
              openAI: <div className={classes.openAI3}>Google</div>,
              _1210ETH: <div className={classes._1210ETH5}>33.14 ETH </div>,
              _321000: <div className={classes._3210005}>345 / 500</div>,
            }}
          />
          <Frame2624
            classes={{ rectangle319: classes.rectangle3196, openAi1: classes.openAi16 }}
            swap={{
              layers: <LayersIcon6 className={classes.icon6} />,
            }}
            text={{
              _1: <div className={classes._15}>6</div>,
              chatgpt: <div className={classes.chatgpt6}>Bing++</div>,
              openAI: <div className={classes.openAI4}>Midjourney</div>,
              _1210ETH: <div className={classes._1210ETH6}>16.87 ETH </div>,
              _321000: <div className={classes._3210006}>132 / 200</div>,
            }}
          />
          <Frame2624
            classes={{ rectangle319: classes.rectangle3197, openAi1: classes.openAi17 }}
            swap={{
              layers: <LayersIcon7 className={classes.icon7} />,
            }}
            text={{
              _1: <div className={classes._16}>7</div>,
              chatgpt: <div className={classes.chatgpt7}>Lyrico AI</div>,
              openAI: <div className={classes.openAI5}>TechNova Analytics</div>,
              _1210ETH: <div className={classes._1210ETH7}>9.77 ETH </div>,
              _321000: <div className={classes._3210007}>51 / 100 </div>,
            }}
          />
          <Frame2624
            classes={{ rectangle319: classes.rectangle3198, openAi1: classes.openAi18 }}
            swap={{
              layers: <LayersIcon8 className={classes.icon8} />,
            }}
            text={{
              _1: <div className={classes._17}>8</div>,
              chatgpt: <div className={classes.chatgpt8}>Algebra Solver</div>,
              openAI: <div className={classes.openAI6}>Wolfram Alpha</div>,
              _1210ETH: <div className={classes._1210ETH8}>20.86 ETH </div>,
              _321000: <div className={classes._3210008}>708 / 1000</div>,
            }}
          />
        </div>
      </div>
      <div className={classes.frame2637}>
        <div className={classes.frame2636}>
          <div className={classes.frame2635}>
            <div className={classes.featuredModels}>Featured models</div>
            <div className={classes.ourRecommendationsForThisWeek}>Our recommendations for this week. </div>
          </div>
        </div>
        <div className={classes.frame2587}>
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi19, rectangle319: classes.rectangle3199 }}
            swap={{
              backup: <BackupIcon className={classes.icon9} />,
              layers: <LayersIcon9 className={classes.icon10} />,
            }}
            text={{
              openAI: <div className={classes.openAI7}>Art Blocks</div>,
              _200ETH: <div className={classes._200ETH}>0.015 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal}>9.77 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned}>51/100 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT3}>Artiful</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren}>
                  Creates multi-dimensional art that transcends traditional boundaries.{' '}
                </div>
              ),
            }}
          />
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi110, rectangle319: classes.rectangle31910 }}
            swap={{
              backup: <BackupIcon2 className={classes.icon11} />,
              layers: <LayersIcon10 className={classes.icon12} />,
            }}
            text={{
              openAI: <div className={classes.openAI8}>RhombusAI</div>,
              _200ETH: <div className={classes._200ETH2}>0.205 ETH</div>,
              modelNameGPT3: <div className={classes.modelNameGPT32}>ArtiVox</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren2}>
                  Blurs the boundaries between creativity and linguistic mastery.{' '}
                </div>
              ),
            }}
          />
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi111, rectangle319: classes.rectangle31911 }}
            swap={{
              backup: <BackupIcon3 className={classes.icon13} />,
              layers: <LayersIcon11 className={classes.icon14} />,
            }}
            text={{
              openAI: <div className={classes.openAI9}>MSync</div>,
              _200ETH: <div className={classes._200ETH3}>0.897 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal2}>14.36 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned2}>266/500 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT33}>Phrasify </div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren3}>
                  Converse on topics from customer support to virtual assistance, and...
                </div>
              ),
            }}
          />
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi112, rectangle319: classes.rectangle31912 }}
            swap={{
              backup: <BackupIcon4 className={classes.icon15} />,
              layers: <LayersIcon12 className={classes.icon16} />,
            }}
            text={{
              openAI: <div className={classes.openAI10}>InnoValley</div>,
              _200ETH: <div className={classes._200ETH4}>0.216 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal3}>41.23 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned3}>812/1000 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT34}>Object Model Factory</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren4}>
                  Tech paradigm shift in understanding objects within images and videos.
                </div>
              ),
            }}
          />
        </div>
      </div>
      <div className={classes.aListOfTheMostPopularModels}>A list of the most popular models </div>
      <div className={classes.frame2641}>
        <div className={classes.frame26362}>
          <div className={classes.frame26352}>
            <div className={classes.greatWritingModels}>Great writing models</div>
            <div className={classes.ourRecommendationsForThisWeek2}>Our recommendations for this week. </div>
          </div>
        </div>
        <div className={classes.frame25872}>
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi113, rectangle319: classes.rectangle31913 }}
            swap={{
              backup: <BackupIcon5 className={classes.icon17} />,
              layers: <LayersIcon13 className={classes.icon18} />,
            }}
            text={{
              openAI: <div className={classes.openAI11}>Mindful</div>,
              _200ETH: <div className={classes._200ETH5}>0.450 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal4}>54.82 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned4}>501/1000 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT35}>Voxella AI</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren5}>
                  Voxella is an advanced AI language model designed to revolutionize the...
                </div>
              ),
            }}
          />
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi114, rectangle319: classes.rectangle31914 }}
            swap={{
              backup: <BackupIcon6 className={classes.icon19} />,
              layers: <LayersIcon14 className={classes.icon20} />,
            }}
            text={{
              openAI: <div className={classes.openAI12}>Quantum Solutions</div>,
              _200ETH: <div className={classes._200ETH6}>0.1 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal5}>4.99 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned5}>63/200 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT36}>Leximind 4.0</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren6}>
                  Leximind processes vast amounts of text and extract meaningful insights...
                </div>
              ),
            }}
          />
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi115, rectangle319: classes.rectangle31915 }}
            swap={{
              backup: <BackupIcon7 className={classes.icon21} />,
              layers: <LayersIcon15 className={classes.icon22} />,
            }}
            text={{
              openAI: <div className={classes.openAI13}>CogniVision</div>,
              _200ETH: <div className={classes._200ETH7}>0.015 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal6}>9.77 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned6}>51/100 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT37}>Ideal Object Interpreter</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren7}>
                  IIO is able to identify and classify objects with unparalleled accuracy...
                </div>
              ),
            }}
          />
          <ModelCardFullImage_statusDefau
            classes={{ openAi1: classes.openAi116, rectangle319: classes.rectangle31916 }}
            swap={{
              backup: <BackupIcon8 className={classes.icon23} />,
              layers: <LayersIcon16 className={classes.icon24} />,
            }}
            text={{
              openAI: <div className={classes.openAI14}>TechNova A.</div>,
              _200ETH: <div className={classes._200ETH8}>0.015 ETH</div>,
              _1210ETHTotal: <div className={classes._1210ETHTotal7}>9.77 ETH total</div>,
              _19200Owned: <div className={classes._19200Owned7}>51/100 owned</div>,
              modelNameGPT3: <div className={classes.modelNameGPT38}>GameSense</div>,
              gPT3IsTheLanguageModelIMCurren: (
                <div className={classes.gPT3IsTheLanguageModelIMCurren8}>
                  GameSense dives deep into sports data, extracting valuable predictions.
                </div>
              ),
            }}
          />
        </div>
      </div>
      <div className={classes.frame2806}>
        <div className={classes.modelMint}>ModelMint</div>
        <div className={classes.worldSFirstNFTMarketplaceForAI}>World&#39;s first NFT marketplace for AI models</div>
      </div>
      <div className={classes.demoModel}>Demo model</div>
      <div className={classes.catalogue}>Catalogue</div>
      <div className={classes.frame2822}>
        <div className={classes.line34}></div>
        <div className={classes.frame2821}>
          <div className={classes.weEnableEveryCreatorsToTrainMo}>
            We enable every creators to train, monetize, manage their AI models in one place.
          </div>
          <div className={classes._202284181742}></div>
          <div className={classes.modelMint2}>ModelMint</div>
        </div>
      </div>
      <CreateButton_statusDefaultSize
        className={classes.createButton}
        classes={{ unnamed: classes.unnamed }}
        text={{
          createAModel: <div className={classes.createAModel}>Launch your models</div>,
        }}
      />
      <div className={classes.rectangle31917}></div>
      <div className={classes.voxellaAI}>Voxella AI</div>
      <div className={classes.frame2715}>
        <div className={classes.frame2714}>
          <div className={classes.frame2582}>
            <Frame2582Icon className={classes.icon26} />
          </div>
          <div className={classes._45ETH}>0.045 ETH</div>
        </div>
        <div className={classes.frame2717}>
          <div className={classes.frame2716}>
            <div className={classes.per1000PromptEntered}>per 1000 prompt entered</div>
          </div>
          <div className={classes.backup}>
            <BackupIcon9 className={classes.icon27} />
          </div>
        </div>
      </div>
      <div className={classes._8518}>$85.18</div>
      <div className={classes.frame2758}>
        <div className={classes.frame2756}>
          <div className={classes.by}>By</div>
          <div className={classes.frame2712}>
            <div className={classes.openAi117}></div>
            <div className={classes.openAI15}>Open AI</div>
          </div>
        </div>
        <div className={classes.voxellaAIIsAnExceptionalBreakt}>
          Voxella AI is an exceptional breakthrough in the field of artificial intelligence designed to provide you with
          a truly immersive and intelligent conversation experience. This advanced model is built upon the cutting-edge
          technology of deep learning and natural language processing, offering a seamless and dynamic interaction that
          mimics human-like conversation.
        </div>
      </div>
      <div className={classes.frame2789}>
        <div className={classes.frame2561}>
          <div className={classes._5011000Owned}>501/1000 owned</div>
          <div className={classes.layers}>
            <LayersIcon17 className={classes.icon28} />
          </div>
        </div>
        <div className={classes.frame2749}>
          <div className={classes.tokenID}>Token ID </div>
          <div className={classes._20}>#20</div>
        </div>
      </div>
      <div className={classes.rectangle341}></div>
      <CreateButton_statusDefaultBoug className={classes.createButton2} classes={{ local_mall: classes.local_mall }} />
      <Vector_statusDefaultSizeBig className={classes.vector} />
      <div className={classes._31}></div>
      <CreatorSpaceModelCard_walletCo
        className={classes.creatorSpaceModelCard}
        classes={{
          _20228418174: classes._20228418174,
          group27: classes.group27,
          search: classes.search,
          send: classes.send,
        }}
        swap={{
          frame2540: <Frame2540Icon className={classes.icon25} />,
        }}
      />
    </div>
  );
});
