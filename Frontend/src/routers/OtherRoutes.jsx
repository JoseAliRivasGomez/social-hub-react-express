import { Routes, Route, Navigate } from "react-router-dom";
import {NavbarX} from '../app/components/NavbarX'
import {FooterX} from '../app/components/FooterX'
import { SettingsPage } from "../app/pages/SettingsPage";
import { PostsPage } from "../app/pages/PostsPage";
import { SchedulesPage } from "../app/pages/SchedulesPage";
import { ChannelsPage } from "../app/pages/ChannelsPage";
import { Grid } from '@mui/material'
import { ConnectionsPage } from "../app/pages/ConnectionsPage";

export const OtherRoutes = () => {
  return (
    <>
    

    <div className="body pb-2">
      <div className="content">
          <NavbarX />
          <div className="">
            <Routes>

                <Route path="posts" element={<PostsPage />} />

                <Route path="schedules" element={<SchedulesPage />} />

                <Route path="channels" element={<ConnectionsPage />} />

                <Route path="channels/connect" element={<ChannelsPage />} />

                <Route path="settings" element={<SettingsPage />} />

                <Route path="/*" element={<Navigate to="/posts" />} />
            </Routes>
          </div>
          <FooterX />
      </div>    
    </div>
        
    </>
  )
}
