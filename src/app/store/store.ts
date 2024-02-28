import { configureStore } from '@reduxjs/toolkit'
import { ProductsReducer } from './ProductSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: {
        productsList: ProductsReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        trace: true,
        serializableCheck: false,
    })
})