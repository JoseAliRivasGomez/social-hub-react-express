import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2";
import mainApi from "../api/mainApi";
import { onLoadChannels, onSetActiveChannel } from "../store/app/channelSlice";
import { onLoadPostTypes } from "../store/app/postTypeSlice";

export const usePostTypeStore = () => {

    const dispatch = useDispatch();
  
    const {postTypes} = useSelector(state => state.postTypes);
    const {user} = useSelector(state => state.auth);

    const startLoadingPostTypes = async () => {
        try {
            
            const {data} = await mainApi.get(`/postTypes`);

            //console.log(data);

            dispatch(onLoadPostTypes(data.postTypes));

        } catch (error) {
            //console.log(error);
        }
    }

    return {
        postTypes: postTypes,
        startLoadingPostTypes,
    }

}
