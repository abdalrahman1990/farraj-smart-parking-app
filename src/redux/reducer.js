import { createSlice } from '@reduxjs/toolkit'
export const appReducer = createSlice({
    name: 'appReducer',
    initialState: {
        trans: [],
        user: {},
        wallet: {},
        scope: 'b2c',
        links:{},
        isRTL: false,
        theme: 'light',
    },
    reducers: {
        setTrans: (state, action) => {
            state.trans = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setWallet: (state, action) => {
            state.wallet = action.payload
        },
        setScope: (state, action) => {
            state.scope = action.payload
        },
        setLinks: (state, action) => {
            state.links = action.payload
        },
        setRTL: (state, action) => {
            state.isRTL = action.payload
        },
        setTheme: (state, action) => {
            state.theme = action.payload
        },

    }
})
export const { setTrans, setUser, setWallet, setScope,setLinks, setRTL, setTheme } = appReducer.actions

export default appReducer.reducer;