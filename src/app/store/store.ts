import { configureStore } from '@reduxjs/toolkit'
import { ProductsReducer } from './ProductSlice'
import { AppReducer } from './AppSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: {
        productsList: ProductsReducer,
        application: AppReducer
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        trace: true,
        serializableCheck: false,
    })
})