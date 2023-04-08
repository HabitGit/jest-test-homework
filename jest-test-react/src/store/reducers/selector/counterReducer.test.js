import counterReducer, {decremented, incremented} from "../counterReducer";

describe('getCounterValue', () => {

    test('Increment', () => {
        expect(counterReducer({value: 0}, incremented())).toEqual({value: 1})
    });

    test('Decrement', () => {
        expect(counterReducer({value: 0}, decremented())).toEqual({value: -1})

    });

    test('With empty state', () => {
        expect(counterReducer(undefined, decremented())).toEqual({value: -1})
        expect(counterReducer(undefined, incremented())).toEqual({value: 1})

    });

})