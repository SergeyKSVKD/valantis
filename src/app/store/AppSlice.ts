import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Params } from '../../app/store/ProductSlice'
import md5 from 'md5'


type LoadingProp = 'idle' | 'loading'
type ErrorProp = string

interface AppI {
    activePage: number,
    pageCount: number,
    action: 'get_ids' | 'filter' | 'get_fields',
    params: Params,
    loading: LoadingProp,
    error: ErrorProp,
    brands: string[],
}

const initialState: AppI = {
    loading: 'idle',
    error: '',
    pageCount: 1,
    activePage: 1,
    action: 'get_ids',
    params: {
        "limit": 50,
        "offset": 0,
        "product": '',
        "price": 0,
        "brand": '',
    },
    brands: [],
}

export const getIDS = createAsyncThunk(
    '@products/get-ids',

    async ({ action, params }: any) => {

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const key = md5(`Valantis_${timestamp}`).toString()
        const body: any = {}
        body["action"] = action
        if (params !== undefined) {
            body["params"] = params
        }

        const ids = await fetch(`http://api.valantis.store:40000/`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "X-Auth": key
            },
        })
        const idsList = await ids.json()
        
        if (idsList !== undefined) {
            const formattedIDS = new Set(idsList.result)

            return formattedIDS.size
        }
        else {
            throw new Error(`Неверный запрос! Ошибка сервера`)
        }
    }
)


export const getAllBrands = createAsyncThunk(
    '@products/get-brands',

    async () => {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const key = md5(`Valantis_${timestamp}`).toString()
        const body: any = {}

        const res = await fetch(`http://api.valantis.store:40000/`, {
            method: "POST",
            body: JSON.stringify({
                "action": "get_fields",
                "params": {"field": "brand"}
            }
            ),
            headers: {
                "Content-type": "application/json",
                "X-Auth": key
            },
        })
        const brandsList = await res.json()
        const formattedBrands = new Set(brandsList.result)
        formattedBrands.delete(null)
        const brands: any = Array.from(formattedBrands)
        
        if (brands.length !== 0) {
            return brands
        }
        else {
            throw new Error(`Неверный запрос! Ошибка сервера`)
        }
    }
)


const AppSlice = createSlice({
    name: '@app',
    initialState,
    reducers: {
        changeActivePage: (state, action: PayloadAction<AppI['activePage']>) => {
            state.activePage = action.payload
            state.params.offset = (state.activePage - 1) * 50
        },
        changeAction: (state, action: PayloadAction<AppI['action']>) => {
            state.action = action.payload
        },
        clearFilters: (state) => {
            state.params = initialState.params
            state.action = "get_ids"
        },
        addFilter: (state, action: PayloadAction<AppI['params']>) => {
            state.params = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIDS.pending, (state) => {
                state.loading = 'loading'
            })
            .addCase(getIDS.fulfilled, (state, action) => {
                state.pageCount = Math.ceil(action.payload / 50)
                state.loading = 'idle'
                state.error = ''
            })
            .addCase(getIDS.rejected, (state, action) => {
                state.loading = 'idle'
                if (action.error.message) {
                    console.log(action.error);
                    state.error = action.error.message ? action.error.message : '« Сервис временно недоступен! »'
                }
            })
            .addCase(getAllBrands.fulfilled, (state, action) => {
                state.brands = action.payload
                state.loading = 'idle'
                state.error = ''
            })
    }
})

export const AppReducer = AppSlice.reducer
export const { changeActivePage, changeAction, clearFilters, addFilter } = AppSlice.actions