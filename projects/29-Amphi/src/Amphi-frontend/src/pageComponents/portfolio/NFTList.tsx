import React, { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Card, Col, Row, Spin } from 'antd';
import { getAmphiPass } from '@/contracts/contract';
import api from '@/api';
import ImgTranslator from '@/assets/images/translator.png';
import EmptyCom from './EmptyCom';

interface INFTItemProps {
    name: string;
    image: any;
}

const NFTCard = ({ image, name }: any) => (
    <Card
        hoverable
        cover={
            <img
                src={image}
                alt={name}
                style={{ minHeight: '105px' }}
                onError={e => {
                    e.target.src = ImgTranslator;
                }}
            />
        }
    >
        <Card.Meta title={name} description='' />
    </Card>
);
export default () => {
    const [search] = useSearchParams();
    const { address } = useAccount();
    const [loading, setLoading] = useState<boolean>(true);
    const [pageError, setPageError] = useState<boolean>(false);
    const [list, setList] = useState<INFTItemProps[]>([]);
    const searchAddress = search.get('address');

    /**
     * TODO:
     * 合约调用
     * 以下是之前的方法
     */
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fetchList = async (address: string) => {
        setLoading(true);
        try {
            const amphiPass = await getAmphiPass();
            await Promise.all([
                amphiPass.methods.baseURI().call(),
                amphiPass.methods.walletOfOwner(address).call()
            ])
                .then(async ([baseURI, tokenIds]) => {
                    // https://ipfs.io/ipfs/bafybeigdmc4m2zt6dllmzn6ovgvdtawlytmcopb5n5z72mmlozqqb74otm/
                    if (tokenIds.length === 0) {
                        setLoading(false);
                        setList([]);
                        return;
                    }
                    const ipfsHash = baseURI.replace('ipfs://', '').replace('/', '');
                    const uris = tokenIds.map((id: string) => `ipfsUris=${ipfsHash}/${id}.json`);
                    const res = await api.getIpfsJson({ uris });
                    setLoading(false);
                    if (res?.code === 200) {
                        const ipfsList = (res?.data || []).map((item: any) => ({
                            ...item,
                            image: item.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                        }));
                        console.log('----ipfsList----', ipfsList);
                        setList(ipfsList);
                    }
                })
                .catch(error => {
                    setPageError(true);
                    setLoading(false);
                    console.log('nft error=====>', error);
                });
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const addr = searchAddress || address;
        if (addr) fetchList(addr);
    }, [searchAddress, address]);

    return (
        <div className='nft-wrap'>
            <Spin spinning={loading}>
                {list && list.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {!!list.length &&
                            list.map(({ name, image }) => (
                                <Col md={8} lg={6} xxl={4} key={name}>
                                    <NFTCard name={name} image={image} />
                                </Col>
                            ))}
                    </Row>
                ) : (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{pageError ? <EmptyCom text='Load Fail' /> : <EmptyCom />}</>
                )}
            </Spin>
        </div>
    );
};
