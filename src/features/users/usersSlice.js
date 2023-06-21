import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchUsers } from './usersApi'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
    }
})

export default usersSlice.reducer

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById
} = usersAdapter.getSelectors(state => state.users)