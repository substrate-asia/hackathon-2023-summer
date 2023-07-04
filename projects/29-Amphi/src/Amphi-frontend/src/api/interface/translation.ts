import { post, get } from '../axios';

export const saveOrder = (data: any) => post('/translation/save', data);
export const getOrderDetail = (id: number) => get(`/translation/${id}`);
