import React, { useState } from 'react';
import { Button, Input, Space } from 'antd';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    decrement,
    increment,
    incrementByAmount,
    incrementAsync,
    incrementIfOdd,
    selectCount
} from '@/store/reducers/counterSlice';

export default function Counter() {
    const count = useAppSelector(selectCount);
    const dispatch = useAppDispatch();
    const [incrementAmount, setIncrementAmount] = useState('2');

    const incrementValue = Number(incrementAmount) || 0;

    return (
        <div style={{ margin: '30px 0' }}>
            <div style={{ margin: '15px 0' }}>
                <Button aria-label='Decrement value' onClick={() => dispatch(decrement())}>
                    {' '}
                    -{' '}
                </Button>
                <span>{count}</span>
                <Button aria-label='Increment value' onClick={() => dispatch(increment())}>
                    {' '}
                    +{' '}
                </Button>
            </div>
            <Space direction='horizontal'>
                <Input
                    aria-label='Set increment amount'
                    value={incrementAmount}
                    onChange={e => setIncrementAmount(e.target.value)}
                />
                <Button onClick={() => dispatch(incrementByAmount(incrementValue))}>
                    {' '}
                    Add Amount{' '}
                </Button>
                <Button onClick={() => dispatch(incrementAsync(incrementValue))}>
                    {' '}
                    Add Async{' '}
                </Button>
                <Button onClick={() => dispatch(incrementIfOdd(incrementValue))}>
                    {' '}
                    Add If Odd{' '}
                </Button>
            </Space>
        </div>
    );
}
