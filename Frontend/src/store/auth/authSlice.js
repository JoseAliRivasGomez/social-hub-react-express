import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', //authenticated, not-authenticated, checking
        user: {},
        errorMessage: undefined,
        isLoadingConnections: true,
        activeConnection: null,
        secret2FA: {},
        openModal2FA: false,
    },
    reducers: {
        onSetStatus: (state, {payload} ) => {
            state.status = payload;
        },
        onSetSecret2FA: (state, {payload} ) => {
            state.secret2FA = payload;
        },
        onSetOpenModal2FA: (state, {payload} ) => {
            state.openModal2FA = payload;
        },
        onChecking: (state ) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onLogin: (state, {payload} ) => {
            state.status = 'authenticated';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: (state, {payload} ) => {
            state.status = 'not-authenticated';
            state.user = {};
            state.errorMessage = payload;
            state.isLoadingConnections = true;
            state.activeConnection = null;
        },
        onUpdateUser: (state, {payload} ) => {
            state.user = payload;
        },
        clearErrorMessage: (state ) => {
            state.errorMessage = undefined;
        },
        onSetActiveConnection: (state, {payload} ) => {
            state.activeConnection = payload;
        },
        onDeleteConnection: (state) => {
            if (state.activeConnection){
                state.user.channels = state.user.channels.filter(connection => connection.id !== state.activeConnection.id);
                state.activeConnection = null;
            }
        },
        onLoadUser: (state, {payload = []} ) => {
            state.isLoadingConnections = false;
            state.user = payload;
        },
    }
});

export const { onChecking, onLogin, onLogout, onUpdateUser, clearErrorMessage, onSetActiveConnection, onAddNewConnection, onDeleteConnection, onLoadUser, onSetSecret2FA, onSetOpenModal2FA, onSetStatus } = authSlice.actions;