import { createSlice } from '@reduxjs/toolkit';

export const channelSlice = createSlice({
    name: 'channel',
    initialState: {
        isLoadingChannels: true,
        channels: [],
        activeChannel: null
    },
    reducers: {
        onSetActiveChannel: (state, {payload} ) => {
            state.activeChannel = payload;
        },
        onLoadChannels: (state, {payload = []} ) => {
            state.isLoadingChannels = false;
            //state.channels = payload;
            payload.forEach(channel => {
                const exists = state.channels.some(dbChannel => dbChannel.id === channel.id);
                if (!exists){
                    state.channels.push(channel);
                }
            })
        },
        onLogoutChannels: (state) => {
            state.isLoadingChannels = true;
            state.channels = [];
            state.activeChannel = null;
        },
    }
});

export const { onSetActiveChannel, onLoadChannels, onLogoutChannels } = channelSlice.actions;