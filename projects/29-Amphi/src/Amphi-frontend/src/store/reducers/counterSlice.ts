import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState, AppThunk } from '../index';

// 定义 slice state 的类型
export interface CounterState {
    value: number;
    status: 'idle' | 'loading' | 'failed';
}

// 使用该类型定义初始 state
const initialState: CounterState = {
    value: 0,
    status: 'idle'
};

export const incrementAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
    // const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return amount;
});

// 创建slice
export const counterSlice = createSlice({
    name: 'counter',
    // `createSlice` 将从 `initialState` 参数推断 state 类型
    initialState,
    // 定义action，这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
    reducers: {
        increment: state => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1;
        },
        decrement: state => {
            state.value -= 1;
        },
        // 使用 PayloadAction 类型声明 `action.payload` 的内容
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(incrementAsync.pending, state => {
                state.status = 'loading';
            })
            .addCase(incrementAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value += action.payload;
            })
            .addCase(incrementAsync.rejected, state => {
                state.status = 'failed';
            });
    }
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.counter.value;

// 内置了thunk插件，可以直接处理异步请求
export const incrementIfOdd =
    (amount: number): AppThunk =>
    (dispatch, getState) => {
        const currentValue = selectCount(getState());
        if (currentValue % 2 === 1) {
            dispatch(incrementByAmount(amount));
        }
    };

export default counterSlice.reducer;
