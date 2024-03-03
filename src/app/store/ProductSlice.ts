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
        body["action"] = "get_items"
        const query: any = {}
        if (params.ids) {
            query["ids"] = params.ids
        }
        body["params"] = { ...query }
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const key = md5(`Valantis_${timestamp}`).toString()
        const res = await fetch(`http://api.valantis.store:40000/`, {
            method: "POST",
            body: JSON.stringify(body),
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
            state.loading = initialState.loading
            state.error = initialState.error
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProducts.pending, (state) => {
                state.loading = 'loading'
                state.error = ''
            })
            .addCase(loadProducts.fulfilled, (state, action) => {
                state.products = action.payload
                state.loading = 'idle'
                state.error = ''
            })
            .addCase(loadProducts.rejected, (state, action) => {
                state.loading = 'idle'
                if (action.error.message) {
                    state.error = action.error.message ? action.error.message : '« Сервис временно недоступен! »'
                }
            })
    }
})

export const { removeProducts } = productsSlice.actions
export const ProductsReducer = productsSlice.reducer