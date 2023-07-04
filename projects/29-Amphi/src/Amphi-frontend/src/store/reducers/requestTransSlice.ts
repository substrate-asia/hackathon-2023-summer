import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { selectMap, dateDiff } from '@/utils/util';
import { currentLanguages, translationTypes } from '@/constants/selcet.json';
import api from '@/api';
import type { RootState } from '../index';

// 定义 slice state 的类型
export interface requestTranState {
    transLang: String;
    serviceType: String;
    workload: number;
    deadline: string;

    amphiServiceCost: Number;
    translatorFee: Number;
    bounty: Number;
    totalCost: number;
}

// 使用该类型定义初始 state
const initialState: requestTranState = {
    transLang: '-',
    serviceType: '',
    workload: 0,
    deadline: '',
    amphiServiceCost: 0,
    translatorFee: 0,
    bounty: 0,
    totalCost: 0
};

export const saveAsync = createAsyncThunk('requestTrans/saveTrans', async (data: {}) => {
    api.saveOrder(data).then((res: any) => {
        console.log(res);
    });
});

// 创建slice
export const counterSlice = createSlice({
    name: 'requestTrans',
    // `createSlice` 将从 `initialState` 参数推断 state 类型
    initialState,
    // 定义action，这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
    reducers: {
        getWorkload: (state, action: PayloadAction<[]>) => {
            state.workload = 0;
            action.payload.forEach((file: { response: { data: { wordCount: any } } }) => {
                state.workload += Number(file?.response?.data?.wordCount || 0);
            });
            state.amphiServiceCost = state.workload * 0.055;
            state.totalCost = Number(state.amphiServiceCost) + Number(state.bounty);
        },
        getTransLang: (state, action: PayloadAction<{ from: string; to: string }>) => {
            state.transLang = action.payload.from
                ? `${selectMap(action.payload.from, currentLanguages)} to ${selectMap(
                      action.payload.to,
                      currentLanguages
                  )}`
                : '-';
        },
        getServiceType: (state, action: PayloadAction<string>) => {
            state.serviceType = selectMap(action.payload, translationTypes);
        },
        getDeadline: (state, action: PayloadAction<string>) => {
            state.deadline = dateDiff(action.payload);
        },
        getBounty: (state, action: PayloadAction<number>) => {
            state.bounty = action.payload;
            state.totalCost = Number(state.amphiServiceCost) + Number(state.bounty);
        }
    }
    // extraReducers: builder => {
    //     builder
    //         .addCase(incrementAsync.pending, state => {
    //             state.status = 'loading';
    //         })
    //         .addCase(incrementAsync.fulfilled, (state, action) => {
    //             state.status = 'idle';
    //             state.value += action.payload;
    //         })
    //         .addCase(incrementAsync.rejected, state => {
    //             state.status = 'failed';
    //         });
    // }
});

// Action creators are generated for each case reducer function
export const { getWorkload, getTransLang, getServiceType, getDeadline, getBounty } =
    counterSlice.actions;

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const summaryWorkload = (state: RootState) => state.requestTrans.workload;
export const summaryTransLang = (state: RootState) => state.requestTrans.transLang;
export const summaryServiceType = (state: RootState) => state.requestTrans.serviceType;
export const summaryDeadline = (state: RootState) => state.requestTrans.deadline;
export const totalCost = (state: RootState) => state.requestTrans.totalCost;
export const amphiServiceCost = (state: RootState) => state.requestTrans.amphiServiceCost;
export const bounty = (state: RootState) => state.requestTrans.bounty;

// 内置了thunk插件，可以直接处理异步请求
// export const incrementIfOdd =(amount: number): AppThunk =>
//     (dispatch, getState) => {
//         const currentValue = selectCount(getState());
//         if (currentValue % 2 === 1) {
//             dispatch(incrementByAmount(amount));
//         }
//     };

export default counterSlice.reducer;
