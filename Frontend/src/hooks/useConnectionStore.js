import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2";
import mainApi from "../api/mainApi";
import { onLoadConnections } from "../store/app/connectionSlice";

export const useConnectionStore = () => {

    const dispatch = useDispatch();
  
    const {connections} = useSelector(state => state.connections);
    const {user} = useSelector(state => state.auth);

    const startLoadingConnections = async () => {
        try {
            
            const {data} = await mainApi.get(`/connections`);

            //console.log(data);

            dispatch(onLoadConnections(data.connections));

        } catch (error) {
            //console.log(error);
        }
    }

    return {
        connections: connections,
        startLoadingConnections,
    }

}
