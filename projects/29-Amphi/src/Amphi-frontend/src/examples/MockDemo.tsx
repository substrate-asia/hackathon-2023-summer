import React, { useCallback, useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import { post } from '@/api/axios';

interface IRoles {
    roleName: string;
    value: string;
}

interface IUserInfo {
    desc: string;
    realName: string;
    roles: IRoles[];
    token: string;
    userId: number;
    username: string;
}

function MockDemo() {
    const [userInfo, setUserInfo] = useState<IUserInfo>({} as IUserInfo);

    const login = useCallback((event: BaseSyntheticEvent) => {
        const formData = new FormData(event.target);

        // 获取表单数据中的 username 和 password 字段
        // const username = formData.get('username');
        // const password = formData.get('password');

        // console.log("username", username)
        // console.log("password", password)

        // 将表单数据转换为 JSON 字符串
        const formJson = Object.fromEntries(formData.entries());
        post('/login', formJson).then((res: any) => {
            console.log('---mock res---', res);
            if (res.code === 200) {
                setUserInfo(res.result);
            }
        });
        event.preventDefault();
    }, []);

    return (
        <>
            <h2>mock demo</h2>
            {userInfo.token ? (
                <>
                    <p>username: {userInfo.username}</p>
                    <p>realName: {userInfo.realName}</p>
                </>
            ) : (
                <form
                    action={`${import.meta.env.VITE_BASE_URL}/login`}
                    method='post'
                    onSubmit={login}
                >
                    username: <input type='text' name='username' />
                    <br />
                    password: <input type='password' name='password' />
                    <br />
                    <input type='submit' value='提交' />
                </form>
            )}
        </>
    );
}

export default MockDemo;
