import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { fetchNotifications } from './notificationsApi'

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state, action) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            notificationsAdapter.upsertMany(state, action.payload)
            Object.values(state.entities).forEach(notification => {
              notification.isNew = !notification.read
            })
        })
    }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
    selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)