import React, { useState, useCallback, createRef, forwardRef, useImperativeHandle } from 'react';
import { Spin, Row, Col, Space, Modal, Descriptions, Avatar, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useClipboard } from 'use-clipboard-copy';
import type { TTokenId, ISlotItem, ITokenURI } from '@/types/ISBT';
// utils
import { getSubStr } from '@/utils/string';
// images
import SBTImage from '@/constants/sbt';
import IconCopy from '@/assets/svg/icon-copy.svg';
import IconFacebook from '@/assets/svg/icon-facebook.svg';
import IconTwitter from '@/assets/svg/icon-twitter.svg';
import IconWorn from '@/assets/svg/icon-worn.svg';

const SBTItemImage = ({ tokenId, isWear }: { tokenId: TTokenId; isWear: boolean }) => (
    <span className='sbt-img-box'>
        <img
            src={SBTImage[tokenId]}
            alt={tokenId?.toString()}
            width='100%'
            style={{ cursor: 'pointer' }}
        />
        {isWear ? <img className='icon-worn' src={IconWorn} alt='worn' /> : null}
    </span>
);

const ModalSBT = forwardRef(
    (
        {
            tokenId,
            workload,
            isHave,
            isWear,
            isCurrentAddress,
            handleWear,
            handleTakeOffBadge
        }: Pick<ITokenURI, 'tokenId' | 'workload'> & {
            isHave: boolean;
            isWear: boolean;
            isCurrentAddress: boolean;
            handleWear: any;
            handleTakeOffBadge: any;
        },
        ref
    ) => {
        const clipboard = useClipboard();
        const [loading, setLoading] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const handleCancel = useCallback(() => {
            setIsModalOpen(false);
        }, []);

        const handleOk = async () => {
            try {
                setLoading(true);
                // if(isHave)
                if (isWear) {
                    Modal.confirm({
                        title: 'Warning！',
                        icon: <ExclamationCircleFilled />,
                        content: (
                            <p
                                className='color-text-sub'
                                style={{ paddingTop: '14px', paddingBottom: '14px' }}
                            >
                                When you remove the badge, it will no longer be displayed publicly.
                                Are you sure you want to remove it?
                            </p>
                        ),
                        okText: 'Confirm',
                        cancelText: 'Cancel',
                        onOk() {
                            return handleTakeOffBadge()
                                .then(() => {
                                    setLoading(false);
                                    setIsModalOpen(false);
                                })
                                .catch(() => {
                                    setLoading(false);
                                    setIsModalOpen(false);
                                });
                        },
                        onCancel() {
                            setLoading(false);
                        }
                    });
                } else {
                    await handleWear(tokenId);
                    setLoading(false);
                    setIsModalOpen(false);
                }
            } catch (error) {
                setLoading(false);
            }
        };

        // 第二步：需要使用useImperativeHandle来将子组件的方法抛给父组件
        useImperativeHandle(ref, () => ({
            setIsModalOpen
        }));

        return (
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{
                    style: isCurrentAddress && isHave ? {} : { display: 'none' }
                }}
                okText={isWear ? 'Unwear' : 'Wear'}
                confirmLoading={loading}
                cancelText='Close'
                width='416px'
            >
                <p
                    style={
                        isHave
                            ? {
                                  textAlign: 'center'
                              }
                            : {
                                  textAlign: 'center',
                                  filter: 'grayscale(100%)'
                              }
                    }
                >
                    <img src={SBTImage[tokenId]} alt='sbt' height={150} />
                </p>
                <Space wrap>
                    <Descriptions column={1} labelStyle={{ width: '100px', textAlign: 'right' }}>
                        {isHave && (
                            <Descriptions.Item label='SBT Address'>
                                <Space
                                    onClick={() => {
                                        clipboard.copy(
                                            import.meta.env.VITE_PUBLIC_SBT_CONTRACT_ADDRESS
                                        );
                                        message.success('Copyed that!');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {getSubStr(import.meta.env.VITE_PUBLIC_SBT_CONTRACT_ADDRESS)}
                                    <Avatar src={IconCopy} size={16} />
                                </Space>
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label='Glory Desc'>
                            When the valid workload reaches {workload} words, this badge will be
                            unlocked.
                        </Descriptions.Item>
                        {isHave && (
                            <Descriptions.Item label='Share to:'>
                                <Space>
                                    <a
                                        target='_blank'
                                        href='https://www.facebook.com/profile.php?id=100079177432699'
                                        rel='noreferrer'
                                    >
                                        <img src={IconFacebook} alt='facebook' height={24} />
                                    </a>
                                    <a
                                        target='_blank'
                                        href='https://twitter.com/globalkoon'
                                        rel='noreferrer'
                                    >
                                        <img src={IconTwitter} alt='twitter' height={24} />
                                    </a>
                                </Space>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                    <Row />
                </Space>
            </Modal>
        );
    }
);

export default ({
    loading,
    slotList,
    ownedList,
    isCurrentAddress,
    getSBTInfo,
    handleWear,
    handleTakeOffBadge
}: any) => {
    const [clickTokenId, setClickTokenId] = useState<TTokenId>();
    const [workload, setWorkload] = useState<string>('');
    const modalRef = createRef<any>();

    const isHave = (tokenId: TTokenId) => {
        // eslint-disable-next-line eqeqeq
        return ownedList.some((item: any) => item.tokenId == tokenId);
    };
    const isWear = useCallback(
        (tokenId: TTokenId) => {
            if (!tokenId) return false;
            // eslint-disable-next-line eqeqeq
            return slotList.some((item: any) => {
                // eslint-disable-next-line eqeqeq
                return item.wordsSbt == tokenId;
            });
        },
        [slotList]
    );

    const handleClick = (tokenId: TTokenId) => {
        // if (!isHave(tokenId)) return;
        setClickTokenId(tokenId);
        getSBTInfo(tokenId).then((res: ITokenURI) => {
            setWorkload(res?.workload);
        });
        modalRef.current.setIsModalOpen(true);
    };

    return (
        <Spin spinning={loading}>
            <ModalSBT
                ref={modalRef}
                tokenId={clickTokenId as number}
                workload={workload}
                isHave={isHave(clickTokenId as number)}
                isWear={isWear(clickTokenId as number)}
                isCurrentAddress={isCurrentAddress}
                handleWear={handleWear}
                handleTakeOffBadge={handleTakeOffBadge}
            />
            <div className='sbt-group-item'>
                <p className='sbt-title'>My Badges</p>
                <Row>
                    {!!slotList?.length &&
                        slotList.map(({ wordsSbt }: ISlotItem) => {
                            if (wordsSbt)
                                return (
                                    <Col
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        className='sbt-col'
                                        key={wordsSbt}
                                        onClick={() => {
                                            handleClick(wordsSbt);
                                        }}
                                    >
                                        <SBTItemImage
                                            tokenId={wordsSbt}
                                            isWear={isWear(wordsSbt)}
                                        />
                                    </Col>
                                );
                            return null;
                        })}
                </Row>
            </div>
            <div className='sbt-group-item'>
                <p className='sbt-title'>Proof of Valid Workload</p>
                <Row>
                    {Object.keys(SBTImage).map(tokenId => (
                        <Col
                            md={6}
                            lg={4}
                            xl={3}
                            className='sbt-col'
                            key={tokenId}
                            onClick={() => {
                                handleClick(tokenId);
                            }}
                            style={isHave(tokenId) ? {} : { filter: 'grayscale(100%)' }}
                        >
                            <SBTItemImage tokenId={tokenId} isWear={isWear(tokenId)} />
                        </Col>
                    ))}
                </Row>
            </div>
        </Spin>
    );
};
