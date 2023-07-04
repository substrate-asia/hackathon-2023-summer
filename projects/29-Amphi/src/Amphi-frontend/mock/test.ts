import type { MockMethod } from 'vite-plugin-mock';
import type { requestParams } from './_util';
import { resultError, resultSuccess, getRequestToken } from './_util';

export function createFakeUserList() {
    return [
        {
            userId: '1',
            username: 'vben',
            realName: 'Vben Admin',
            avatar: '',
            desc: 'manager',
            password: '123456',
            token: 'fakeToken1',
            homePath: '/dashboard/analysis',
            roles: [
                {
                    roleName: 'Super Admin',
                    value: 'super'
                }
            ]
        },
        {
            userId: '2',
            username: 'test',
            password: '123456',
            realName: 'test user',
            avatar: '',
            desc: 'tester',
            token: 'fakeToken2',
            homePath: '/dashboard/workbench',
            roles: [
                {
                    roleName: 'Tester',
                    value: 'test'
                }
            ]
        }
    ];
}
export default [
    {
        url: '/basic-api/login',
        timeout: 200,
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body;
            const checkUser = createFakeUserList().find(
                item => item.username === username && password === item.password
            );
            if (!checkUser) {
                return resultError('Incorrect account or password！');
            }
            const { userId, username: _username, token, realName, desc, roles } = checkUser;
            return resultSuccess({
                roles,
                userId,
                username: _username,
                token,
                realName,
                desc
            });
        }
    },
    {
        url: '/basic-api/getUserInfo',
        method: 'get',
        response: (request: requestParams) => {
            const token = getRequestToken(request);
            if (!token) return resultError('Invalid token');
            const checkUser = createFakeUserList().find(item => item.token === token);
            if (!checkUser) {
                return resultError('The corresponding user information was not obtained!');
            }
            return resultSuccess(checkUser);
        }
    },
    {
        url: '/basic-api/translator/list',
        method: 'get',
        response: (request: requestParams) => {
            console.log('----request---', request);
            // const token = getRequestToken(request);
            // if (!token) return resultError('Invalid token');
            return resultSuccess({
                rows: [
                    {
                        id: 1,
                        userId: 1,
                        username: 'aaa',
                        address: '0x867f1469356D37313406b75c461fA057c829c749',
                        profile: 'ipfs.nft.io/demo.json',
                        languages: null,
                        orders: 10,
                        score: 9.0,
                        latestAcceptTime: '2023-06-09T14:31:18.000+00:00'
                    }
                ]
            });
        }
    }
] as MockMethod[];
