import { createSlice } from '@reduxjs/toolkit';

export const connectionSlice = createSlice({
    name: 'connection',
    initialState: {
        isLoadingConnections: true,
        connections: [],
    },
    reducers: {
        onLoadConnections: (state, {payload = []} ) => {
            state.isLoadingConnections = false;
            //state.postTypes = payload;
            payload.forEach(connection => {
                const exists = state.connections.some(dbConnection => dbConnection.id === connection.id);
                if (!exists){
                    state.connections.push(connection);
                }
            })
        },
        onLogoutConnections: (state) => {
            state.isLoadingConnections = true;
            state.connections = [];
        },
    }
});

export const { onLoadConnections, onLogoutConnections } = connectionSlice.actions;