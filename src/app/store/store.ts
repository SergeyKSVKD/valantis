import { configureStore, createSlice } from '@reduxjs/toolkit'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type CounterState = number

const initialState: CounterState = 0

const CounterSlice = createSlice({
    name: '@counters',
    initialState, 
    reducers: {

    }
})

const CounterReducer =  CounterSlice.reducer
export default CounterReducer

export const store = configureStore({
    reducer: {
       counters: CounterReducer,
    },
})