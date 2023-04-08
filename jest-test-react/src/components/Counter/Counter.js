import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCounterValue} from "../../store/reducers/selector/getCounterValue/getCounterValue";
import {decremented, incremented} from "../../store/reducers/counterReducer";

const Counter = () => {
    const dispatch = useDispatch()
    const value = useSelector(getCounterValue)

    const onIncrement = () => {
        dispatch(incremented())
    }

    const onDecrement = () => {
        dispatch(decremented())
    }
    return (
        <div>
           <h1>value = {value}</h1>
            <button onClick={onIncrement}>Increment</button>
            <button onClick={onDecrement}>Decrement</button>
        </div>
    );
};

export default Counter;