import { configureStore } from "@reduxjs/toolkit";
import { channelSlice } from "./app/channelSlice";
import { connectionSlice } from "./app/connectionSlice";
import { postSlice } from "./app/postSlice";
import { postTypeSlice } from "./app/postTypeSlice";
import { scheduleSlice } from "./app/scheduleSlice";
import { authSlice } from "./auth/authSlice";
import { uiSlice } from "./ui/uiSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        ui: uiSlice.reducer,
        schedules: scheduleSlice.reducer,
        channels: channelSlice.reducer,
        postTypes: postTypeSlice.reducer,
        posts: postSlice.reducer,
        connections: connectionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})