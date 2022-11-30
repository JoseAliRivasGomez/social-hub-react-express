import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2";
import mainApi from "../api/mainApi";
import { onLoadChannels, onSetActiveChannel } from "../store/app/channelSlice";

export const useChannelStore = () => {

    const dispatch = useDispatch();
  
    const {channels, activeChannel} = useSelector(state => state.channels);
    const {user} = useSelector(state => state.auth);

    const setActiveChannel = (channel) => {
        localStorage.setItem('activeChannel', channel.id);
        dispatch(onSetActiveChannel(channel));
    }

    const startLoadingChannels = async () => {
        try {
            
            const {data} = await mainApi.get(`/channels`);

            //console.log(data);

            dispatch(onLoadChannels(data.channels));

        } catch (error) {
            //console.log(error);
        }
    }

    return {
        channels: channels,
        activeChannel: activeChannel,
        hasChannelSelected: !!activeChannel, //null = false, object = true
        setActiveChannel,
        startLoadingChannels,
    }

}
