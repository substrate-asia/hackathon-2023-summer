import React, { useCallback, useEffect, useState } from 'react';
import { Space, Tabs, Avatar, Dropdown, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Jazzicon from 'react-jazzicon';
import { useAccount } from 'wagmi';
import { useClipboard } from 'use-clipboard-copy';
import api from '@/api';
import { socialMedia } from '@/constants/selcet.json';
// utils
import { optionsMap } from '@/utils/array';
// images
import SBTImage from '@/constants/sbt';
import ImgBackground from '@/assets/images/background.png';
import IconCopy from '@/assets/svg/icon-copy.svg';
import IconGloble from '@/assets/svg/icon-globle.svg';
import IconLang from '@/assets/svg/icon-lang.svg';
import IconOrders from '@/assets/svg/icon-orders.svg';
import IconSetting from '@/assets/svg/icon-setting.svg';
import IconShare from '@/assets/svg/icon-share.svg';
import IconDiscord from '@/assets/svg/icon-discord.svg';
import IconEmail from '@/assets/svg/icon-email.svg';
import SBTTag from '@/components/SBTTag';
import ProjectList from '@/pageComponents/portfolio/ProjectList';
import NFTList from '@/pageComponents/portfolio/NFTList';
import BadgeList from '@/pageComponents/portfolio/BadgeList';
import useSBT from '@/hooks/useSBT';
import './index.scss';

const socialMediaMap = optionsMap(socialMedia);

const CopyComponent = ({ clipboard, link }: any) => (
    <Space
        onClick={() => {
            clipboard.copy(link);
            message.success('Copyed that!');
        }}
        style={{ cursor: 'hand' }}
    >
        <Avatar src={IconCopy} size={16} />
        copy link
    </Space>
);
const EmailComponent = () => <img src={IconEmail} alt='email' />;
const DiscordComponent = () => <img src={IconDiscord} alt='discord' />;

export default () => {
    const clipboard = useClipboard();
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const searchAddress = search.get('address');
    const { address } = useAccount();
    const [userInfo, setUserInfo] = useState<any>({});
    const [completedNum, setCompletedNum] = useState<number | undefined>(undefined);
    const [copyLink, setCopyLink] = useState(location.href);
    const {
        loading: sbtLoading,
        slotList,
        ownedList,
        isCurrentAddress,
        getSBTInfo,
        handleWear,
        handleTakeOffBadge
    } = useSBT((searchAddress || address) as string);
    // setCompletedNum(res.data.total)
    // const { username, avatar, backgroundUrl, industry, workLangs, socialMediaList } = userInfo;

    const fetchData = useCallback(async (addr: string) => {
        if (addr) {
            const res = await api.getUserInfo({ address: addr });
            if (res?.code === 200) {
                const {
                    username,
                    profile,
                    backgroundUrl,
                    industry,
                    languageList,
                    socialMediaList
                } = res.data;
                const langs = languageList?.map((item: any) => item.workLang);
                const industrys = industry.length > 0 ? industry.trim().split(';') : [];
                setUserInfo({
                    username: username || 'Unnamed',
                    profile,
                    backgroundUrl: backgroundUrl || ImgBackground,
                    workLangs: langs,
                    industry: industrys || [],
                    socialMediaList: socialMediaList || []
                });
            }
        }
    }, []);
    useEffect(() => {
        const addr = searchAddress || address;
        const link = location.href;
        setCopyLink(searchAddress ? link : `${link}?address=${address}`);
        fetchData(addr);
    }, [searchAddress, address, fetchData]);

    const onClickSetting = useCallback(() => {
        navigate('/preferences');
    }, [navigate]);

    return (
        <>
            <div className='background-box'>
                <img
                    src={userInfo?.backgroundUrl}
                    alt='background'
                    onError={e => {
                        e.target.src = ImgBackground;
                    }}
                />
            </div>
            {/* 个人信息 */}
            <div className='personal-info-box'>
                <div className='personal-info-top-box'>
                    <Space className='left'>
                        <div className='avatar-box'>
                            {userInfo?.profile ? (
                                <img
                                    src={userInfo?.profile}
                                    alt='profile'
                                    width={120}
                                    height={120}
                                    style={{ borderRadius: 60 }}
                                />
                            ) : (
                                <Jazzicon diameter={120} seed={search.get('address')} />
                            )}
                            <Space className='nickname-box'>
                                <p className='nickname'>{userInfo?.username}</p>
                                {!!slotList?.length &&
                                    slotList.map(({ id, wordsSbt }: any) =>
                                        wordsSbt ? (
                                            <SBTTag image={SBTImage[wordsSbt]} key={id} />
                                        ) : null
                                    )}
                            </Space>
                        </div>
                        {/* TODO: 字段不确定 */}
                    </Space>
                    <Space size='middle'>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: '0',
                                        label: (
                                            <CopyComponent clipboard={clipboard} link={copyLink} />
                                        )
                                    },
                                    ...(userInfo?.socialMediaList || []).map(
                                        ({ mediaType, mediaAccount }: any) => ({
                                            key: mediaType,
                                            label: (
                                                <a
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    href={mediaAccount}
                                                    key={mediaType}
                                                >
                                                    {mediaType === 0 ? (
                                                        <EmailComponent />
                                                    ) : (
                                                        <DiscordComponent />
                                                    )}{' '}
                                                    Share on{' '}
                                                    {socialMediaMap.get(mediaType.toString())}
                                                </a>
                                            )
                                        })
                                    )
                                ]
                            }}
                            placement='bottomRight'
                        >
                            <a onClick={e => e.preventDefault()}>
                                <Avatar src={IconShare} size={24} style={{ cursor: 'pointer' }} />
                            </a>
                        </Dropdown>

                        <Avatar
                            src={IconSetting}
                            size={24}
                            onClick={onClickSetting}
                            style={{ cursor: 'pointer' }}
                        />
                    </Space>
                </div>
                <Space wrap className='personal-info-bottom-box'>
                    <Space wrap>
                        <Avatar src={IconLang} size={24} />
                        {userInfo?.workLangs?.length > 0 ? (
                            userInfo?.workLangs.map((value: string) => <p key={value}>{value}</p>)
                        ) : (
                            <p>--</p>
                        )}
                    </Space>
                    <Space wrap>
                        <Avatar src={IconGloble} size={24} />
                        {userInfo?.industry?.length > 0 ? (
                            userInfo?.industry.map((value: string) => <p key={value}>{value}</p>)
                        ) : (
                            <p>--</p>
                        )}
                    </Space>
                    <Space>
                        <Avatar src={IconOrders} size={24} />
                        <p>
                            <span>{completedNum}</span> orders completed
                        </p>
                    </Space>
                </Space>
            </div>
            <div className='personal-tabs-box'>
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            key: '1',
                            label: `projects`,
                            children: <ProjectList setCompletedNum={setCompletedNum} />
                        },
                        {
                            key: '2',
                            label: `NFTs`,
                            children: <NFTList />
                        },
                        {
                            key: '3',
                            label: `Badge`,
                            children: (
                                <BadgeList
                                    loading={sbtLoading}
                                    slotList={slotList}
                                    ownedList={ownedList}
                                    isCurrentAddress={isCurrentAddress}
                                    getSBTInfo={getSBTInfo}
                                    handleWear={handleWear}
                                    handleTakeOffBadge={handleTakeOffBadge}
                                />
                            )
                        }
                    ]}
                />
            </div>
        </>
    );
};
