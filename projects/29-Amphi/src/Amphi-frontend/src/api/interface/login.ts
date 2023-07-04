import { post } from '../axios';

export const getNonce = (data: any) => post('/nonce', data);

export const login = (data: any) => post('/login', data);

export const logout = (data: any) => post('/logout', data);
