import React, { useEffect, useState } from 'react';
import type { FormInstance, UploadProps } from 'antd';
import { Button, message, Upload, Space, Avatar } from 'antd';
// import Jazzicon from 'react-jazzicon';
import ImgAvatar from '@/assets/images/default-avatar.png';
import ImgBackground from '@/assets/images/default-background.png';
import { AMPHI_USERTOKEN } from '@/constants/storageKeys';

const action = `${import.meta.env.VITE_BASE_URL}/file/pic/upload`;
const token = localStorage.getItem(AMPHI_USERTOKEN);
const headers = { authorization: 'authorization-text', token: token as string };

const props: UploadProps = {
    name: 'file',
    accept: 'image/*',
    action,
    headers,
    showUploadList: false,
    beforeUpload: (file: any) => {
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            message.error('Image must smaller than 50MB!');
        }
        return isLt50M;
    }
};

interface IProps {
    form: FormInstance;
    formField: string;
    shape?: 'circle' | 'shape';
    size?: number;
    maxCount?: number;
    desc?: string;
}
export default ({ form, formField, shape = 'circle', size = 80, maxCount = 1, desc }: IProps) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const imgUrl = form.getFieldValue(formField);
    useEffect(() => {
        if (imgUrl) {
            if (maxCount === 1) setFileList([{ url: imgUrl }]);
            else {
                /** TODO:
                 * 多图片情况； 若imgUrl是image url数组
                 * setFileList(imgUrl.map((value: string) => ({ url: value })));
                 */
            }
        }
    }, [imgUrl, maxCount]);
    const onChange: UploadProps['onChange'] = (info: any) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }

        if (info.file.status === 'done') {
            if (info.file.response?.code && info.file.response?.code === 200) {
                message.success(`${info.file.name} file uploaded successfully`);
                let newFileList = [...info.fileList];

                // 1. Limit the number of uploaded files
                // Only to show two recent uploaded files, and old ones will be replaced by the new
                newFileList = newFileList.slice(-maxCount);

                // 2. Read from response and show file link
                newFileList = newFileList
                    .filter(file => {
                        if (file.response?.code && file.response?.code === 200) return true;

                        message.error(`${info.file.name} file upload failed.`);
                        return false;
                    })
                    .map(file => {
                        // Component will show file.url as link
                        file.url = file.response.msg;
                        return file;
                    });

                if (maxCount === 1) form.setFieldValue(formField, newFileList[0].url);
                //    else form.setFieldValue(formField, newFileList)   // TODO: 多图上传设置form value
                setFileList(newFileList);
            } else {
                message.error(`${info.file.name} file upload failed.`);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <Space size='large'>
            {fileList.length > 0 ? (
                fileList.map(item => (
                    <Space key={item.url}>
                        {shape === 'circle' ? (
                            <Avatar src={item.url} size={size} />
                        ) : (
                            <img src={item.url} alt='background' height={size} />
                        )}
                    </Space>
                ))
            ) : (
                <Space>
                    {shape === 'circle' ? (
                        // TODO: 获取 address
                        // ?: 是用Jazzicon 还是 <Avatar src={url} size={size} />
                        // <Jazzicon diameter={size} seed='address' />
                        <Avatar src={ImgAvatar} size={size} />
                    ) : (
                        <img src={ImgBackground} alt='background' height={size} />
                    )}
                </Space>
            )}

            <Space wrap>
                <Upload {...props} maxCount={maxCount} onChange={onChange}>
                    <Button>Edit</Button>
                </Upload>
                {/* <p>Image files only, within 50M</p> */}
                <p className='color-text-desc'>
                    {desc || 'Image files only, Recommended 350px x 350px, Max Size: 50MB'}
                </p>
            </Space>
        </Space>
    );
};
