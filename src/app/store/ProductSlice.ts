import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import md5 from 'md5'

type LoadingProp = 'idle' | 'loading'
type ErrorProp = string

export type Product = {
    brand: string | null
    id: ""
    price: number
    product: ""
}

interface ProductsI {
    products: Product[],
    loading: LoadingProp
    error: ErrorProp,
}

const initialState: ProductsI = {
    products: [],
    loading: 'idle',
    error: '',
}

export type Params = {
    offset: number,
    limit: number,
    price?: number,
    ids?: string[]
    product?: string,
    brand?: string,
}

export type ActionProp = {
    action: 'get_items' | 'get_ids' | 'filter' | 'get_fields',
    params: Params,
}

export const loadProducts = createAsyncThunk(
    '@products/get-all',

    async ({ action = 'get_ids', params }: ActionProp, { dispatch }) => {

        const body: any = {}
        body["action"] = action
        const query: any = {}
        if (params.brand) {
            query["brand"] = params.brand
        }
        if (params.price) {
            query["price"] = params.price
        }
        if (params.product) {
            query["product"] = params.product
        }
        body["params"] = { ...query }

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const key = md5(`Valantis_${timestamp}`).toString()
        const ids = await fetch(`http://api.valantis.store:40000/`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "X-Auth": key
            },
        })
        const idsList = await ids.json()
        const limit = params?.limit
        const offset = params?.offset
        const formattedIDS: any[] = Array.from(new Set(idsList.result)).slice(offset, offset + limit)

        if (idsList === undefined) {
            throw new Error(`Неверный запрос! Ошибка сервера`)
        }
        const res = await fetch(`http://api.valantis.store:40000/`, {
            method: "POST",
            body: JSON.stringify({
                "action": "get_items",
                "params": { "ids": [...formattedIDS] },
            }),
            headers: {
                "Content-type": "application/json",
                "X-Auth": key
            },
        })
        const data = await res.json()
        if (data !== undefined) {
            const formattedResult: Product[] = []
            data.result.filter((item: Product) => {
                const entry = formattedResult.some(el => el.id === item.id)
                if (!entry) {
                    formattedResult.push(item)
                }
            })

            return formattedResult
        }
        else {
            throw new Error(`Неверный запрос! Ошибка сервера`)
        }
    }

)

const productsSlice = createSlice({
    name: '@products',
    initialState,
    reducers: {
        removeProducts: (state) => {
            state.products = initialState.products
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProducts.pending, (state) => {
                state.loading = 'loading'
            })
            .addCase(loadProducts.fulfilled, (state, action) => {
                state.products = action.payload
                state.loading = 'idle'
                state.error = ''
            })
            .addCase(loadProducts.rejected, (state, action) => {
                state.loading = 'idle'
                if (action.error.message) {
                    console.log(action.error);
                    state.error = action.error.message ? action.error.message : '« Сервис временно недоступен! »'
                }
            })
    }
})

export const { removeProducts } = productsSlice.actions
export const ProductsReducer = productsSlice.reducer