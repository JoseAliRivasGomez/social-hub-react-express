import { createSlice } from '@reduxjs/toolkit';

export const postSlice = createSlice({
    name: 'post',
    initialState: {
        isLoadingPendingPosts: true,
        isLoadingPublishedPosts: true,
        pendingPosts: [],
        publishedPosts: [],
        totalPendingPosts: 0,
        totalPublishedPosts: 0,
        resetPublishedPostsPagination: false,
        resetPendingPostsPagination: false,
        activePost: null
    },
    reducers: {
        onResetPublishedPostsPagination: (state, {payload} ) => {
            state.resetPublishedPostsPagination = payload;
        },
        onResetPendingPostsPagination: (state, {payload} ) => {
            state.resetPendingPostsPagination = payload;
        },
        onSetActivePost: (state, {payload} ) => {
            state.activePost = payload;
        },
        onAddNewPendingPost: (state, {payload} ) => {
            state.pendingPosts.unshift(payload);
            state.activePost = null;
        },
        onAddNewPublishedPost: (state, {payload} ) => {
            state.publishedPosts.unshift(payload);
            state.activePost = null;
        },
        onUpdatePendingPost: (state, {payload} ) => {
            state.pendingPosts = state.pendingPosts.map( post => {

                if(post.id === payload.id){
                    if(payload.scheduledAt){
                        let x = {...payload.Scheduled_Post};
                        x = {...x, scheduledAt: payload.scheduledAt.toISOString()};
                        return {...payload, Scheduled_Post: x};
                    }else{
                        return payload;
                    }
                }

                return post;
            });
        },
        onDeletePendingPost: (state) => {
            if (state.activePost){
                state.pendingPosts = state.pendingPosts.filter(post => post.id !== state.activePost.id);
                state.activePost = null;
            }
        },
        onLoadPendingPosts: (state, {payload = []} ) => {
            state.isLoadingPendingPosts = false;
            state.pendingPosts = payload;
            // payload.forEach(post => {
            //     const exists = state.pendingPosts.some(dbPost => dbPost.id === post.id);
            //     if (!exists){
            //         state.pendingPosts.push(post);
            //     }
            // });
            state.activePost = null;
        },
        onLoadPendingPostsCount: (state, {payload = []} ) => {
            state.totalPendingPosts = payload;
        },
        onLoadPublishedPosts: (state, {payload = []} ) => {
            state.isLoadingPublishedPosts = false;
            state.publishedPosts = payload;
            // payload.forEach(post => {
            //     const exists = state.publishedPosts.some(dbPost => dbPost.id === post.id);
            //     if (!exists){
            //         state.publishedPosts.push(post);
            //     }
            // });
            state.activePost = null;
        },
        onLoadPublishedPostsCount: (state, {payload = []} ) => {
            state.totalPublishedPosts = payload;
        },
        onLogoutPosts: (state) => {
            state.isLoadingPendingPosts = true;
            state.isLoadingPublishedPosts = true;
            state.pendingPosts = [];
            state.publishedPosts = [],
            state.activePost = null;
        },
    }
});

export const { onSetActivePost, onResetPublishedPostsPagination, onResetPendingPostsPagination, onAddNewPendingPost, onAddNewPublishedPost, onLoadPendingPosts, onLoadPublishedPosts, onLogoutPosts, onUpdatePendingPost, onDeletePendingPost, onLoadPendingPostsCount, onLoadPublishedPostsCount } = postSlice.actions;