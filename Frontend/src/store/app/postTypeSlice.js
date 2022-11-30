import { createSlice } from '@reduxjs/toolkit';

export const postTypeSlice = createSlice({
    name: 'postType',
    initialState: {
        isLoadingPostTypes: true,
        postTypes: [],
    },
    reducers: {
        onLoadPostTypes: (state, {payload = []} ) => {
            state.isLoadingPostTypes = false;
            //state.postTypes = payload;
            payload.forEach(postType => {
                const exists = state.postTypes.some(dbPostType => dbPostType.id === postType.id);
                if (!exists){
                    state.postTypes.push(postType);
                }
            })
        },
        onLogoutPostTypes: (state) => {
            state.isLoadingPostTypes = true;
            state.postTypes = [];
        },
    }
});

export const { onLoadPostTypes, onLogoutPostTypes } = postTypeSlice.actions;