import { post } from '../axios';

export const getFileDownloadPath = (data: any) => post('/file/createGetUrl', data);

export const other = [];
