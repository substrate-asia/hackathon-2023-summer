import type { ThunkAction, Action } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reducers/counterSlice';
import requestTransReducer from './reducers/requestTransSlice';

// configureStore创建一个redux数据
const store = configureStore({
    reducer: {
        counter: counterReducer,
        requestTrans: requestTransReducer
    },
    // 解决报错：serializableStateInvariantMiddleware.ts:234 A non-serializable value was detected in an action, in the path: `payload.0.lastModifiedDate`. Value: Mon Jun 26 2023 17:06:42 GMT+0800
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;

// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
