import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Modal, Carousel, Space, Row, message } from 'antd';
import { useClipboard } from 'use-clipboard-copy';
import IconFireworks from '@/assets/svg/icon-fireworks.svg';
import IconPrev from '@/assets/svg/icon-prev.svg';
import IconNext from '@/assets/svg/icon-next.svg';
import IconCopy from '@/assets/svg/icon-copy.svg';
import IconFacebook from '@/assets/svg/icon-facebook.svg';
import IconTwitter from '@/assets/svg/icon-twitter.svg';
import { useAccount } from 'wagmi';
import SBTImage from '@/constants/sbt';
import { getSubStr } from '@/utils/string';
import useSBT from '@/hooks/useSBT';
import type { IBadgeItem } from '@/types/ISBT';

const NoticeContext = createContext<any>({});

const SBTNoticeContent = (props: any) => {
    const clipboard = useClipboard();
    const { remindList } = useSBT();
    const [currentNum, setCurrentNum] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const [title, setTitle] = useState('Proof of Valid Workload');
    const [total, setTotal] = useState<string | number>('--');
    const { currentSBT, setCurrentSBT } = props;

    useEffect(() => {
        setTotal(remindList.length);
        setCurrentSBT(remindList[0]);
    }, [remindList, setCurrentSBT]);

    const onChange = (currentSlide: number) => {
        setCurrentNum(currentSlide + 1);
        setCurrentSBT(remindList[currentSlide]);
    };
    return (
        <div style={{ textAlign: 'center', margin: '0 auto', padding: '0 24px' }}>
            <Carousel
                dots={false}
                arrows
                prevArrow={<img src={IconPrev} alt='<-' className='swiper-prev' />}
                nextArrow={<img src={IconNext} alt='->' className='swiper-next' />}
                afterChange={onChange}
            >
                {!!remindList?.length &&
                    remindList?.map(({ tokenId }: IBadgeItem) => (
                        <p key={tokenId}>
                            <img
                                src={SBTImage[tokenId]}
                                alt={tokenId.toString()}
                                height={150}
                                style={{ margin: '0 auto' }}
                            />
                        </p>
                    ))}
            </Carousel>
            <Row justify='space-around'>
                <Space
                    className='text-desc'
                    onClick={() => {
                        clipboard.copy(import.meta.env.VITE_PUBLIC_SBT_CONTRACT_ADDRESS);
                        message.success('Copyed that!');
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    SBT Address:{' '}
                    {getSubStr(import.meta.env.VITE_PUBLIC_SBT_CONTRACT_ADDRESS as string)}
                    <Avatar src={IconCopy} size={16} />
                </Space>
                {remindList?.length > 1 && (
                    <p className='text-desc'>
                        {currentNum} / {total}
                    </p>
                )}
            </Row>
            <p className='text-title'>{title}</p>
            <p className='text-sub'>
                You are the <span className='text-strong'>No. {currentSBT?.sbtRanking}</span> user
                to receive this badge
            </p>
        </div>
    );
};

const SBTWearSuccessContent = ({ img }: any) => {
    return (
        <Space wrap style={{ textAlign: 'center', justifyContent: 'center' }}>
            <img src={img} alt='sbt' height={150} />
            <p className='text-sub'>
                Your honor will be displayed next to your name, bringing joy to your friends or
                colleagues as well！
            </p>
            <Space>
                <a
                    target='_blank'
                    href='https://www.facebook.com/profile.php?id=100079177432699'
                    rel='noreferrer'
                >
                    <img src={IconFacebook} alt='facebook' height={24} />
                </a>
                <a target='_blank' href='https://twitter.com/globalkoon' rel='noreferrer'>
                    <img src={IconTwitter} alt='twitter' height={24} />
                </a>
            </Space>
        </Space>
    );
};

const NoticeProvider = (props: any) => {
    const { address } = useAccount();
    const navigate = useNavigate();
    const { slotList, isNeedRemind, handleWear } = useSBT();
    const [currentSBT, setCurrentSBT] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(isNeedRemind);
    const [isWearSuccessModalOpen, setIsWearSuccessModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(isNeedRemind);
    }, [isNeedRemind]);

    const handleOk = () => {
        if (slotList.length > 0) {
            // 有相同的了
            Modal.confirm({
                title: 'Badge Wearing Tips',
                content: 'You are already wearing the same type. Would you like to replace it?',
                // 'You are already wearing the same type of [徽章类型-徽章级别]. Would you like to replace it?',
                okText: 'Confirm',
                cancelText: 'Cancel',
                onOk: async () => {
                    await handleWear(currentSBT?.tokenId);
                    setIsWearSuccessModalOpen(true);
                    setIsModalOpen(false);
                }
            });
        }
        // TODO: 已达到徽章的最大限额
        // if(已达到徽章的最大限额){
        //      Modal.error({
        //             title: 'Failed to wear',
        //             content:
        //                 'You have reached the maximum limit of badges. If you still want to wear this badge, please remove at least one badge from your portfolio page.',
        //             okText: 'Go to Portfolio'
        //      });
        //      return
        // }
    };

    const handleWearSuccessOk = () => {
        setIsWearSuccessModalOpen(false);
        navigate('/portfolio');
    };

    useEffect(() => {
        if (address && isNeedRemind) setIsModalOpen(true); // 弹窗
    }, [address, isNeedRemind]);

    return (
        <NoticeContext.Provider value={props.value}>
            {props.children}
            <Modal
                title={
                    <Space>
                        <img src={IconFireworks} width={20} alt='congratulations' />
                        <p className='sbt-pop-title'>Congratulations on your achievement</p>
                    </Space>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
                okText='Wear'
                cancelText='Cancel'
                width='416px'
            >
                <SBTNoticeContent currentSBT={currentSBT} setCurrentSBT={setCurrentSBT} />
            </Modal>
            {/* share */}
            <Modal
                title={
                    <Space>
                        <img src={IconFireworks} width={20} alt='worn' />
                        You have worn the badge
                    </Space>
                }
                open={isWearSuccessModalOpen}
                onOk={handleWearSuccessOk}
                onCancel={() => {
                    setIsWearSuccessModalOpen(false);
                }}
                okText='Go to Portfolio'
                cancelText='Close'
                width='416px'
            >
                <SBTWearSuccessContent img={SBTImage[currentSBT?.tokenId]} />
            </Modal>
        </NoticeContext.Provider>
    );
};

const useNotice = () => useContext(NoticeContext);

export { NoticeProvider, useNotice };
