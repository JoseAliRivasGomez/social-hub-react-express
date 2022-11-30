import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2";
import mainApi from "../api/mainApi";
import { convertSchedulesToDateSchedules } from "../helpers/convertSchedulesToDateSchedules";
import { onAddNewSchedule, onDeleteSchedule, onLoadSchedules, onSetActiveSchedule, onUpdateSchedule } from "../store/app/scheduleSlice";

export const useScheduleStore = () => {

    const dispatch = useDispatch();
  
    const {schedules, activeSchedule} = useSelector(state => state.schedules);
    const {user} = useSelector(state => state.auth);

    const setActiveSchedule = (schedule) => {
        localStorage.setItem('activeSchedule', schedule.id);
        dispatch(onSetActiveSchedule(schedule));
    }

    const startSavingSchedule = async(schedule) => {

        try {

            if (schedule.id){ //Update
                await mainApi.put(`/schedules/${schedule.id}`, schedule);
                dispatch(onUpdateSchedule({...schedule}));
                Swal.fire('Schedule updated!', 'The schedule was updated successfully!', 'success');
                return;
            }

            //Create
            const {data} = await mainApi.post('/schedules', schedule);
            dispatch(onAddNewSchedule({...schedule, id: data.schedule.id}));
            Swal.fire('Schedule created!', 'The schedule was created successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while saving schedule', error.response.data?.message, 'error');
        }
        
    }

    const startDeletingSchedule = async(schedule) => {

        try {

            await mainApi.delete(`/schedules/${schedule.id}`);

            dispatch(onDeleteSchedule());

            Swal.fire('Schedule deleted!', 'The schedule was deleted successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while deleting schedule', error.response.data?.message, 'error');
        }
        
    }

    const startLoadingSchedules = async () => {
        try {
            
            const {data} = await mainApi.get(`/schedules`);

            //console.log(data);

            //const schedules = convertSchedulesToDateSchedules(data.schedules);

            //console.log(schedules);

            dispatch(onLoadSchedules(data.schedules));

        } catch (error) {
            //console.log(error);
        }
    }

    return {
        schedules: schedules,
        activeSchedule: activeSchedule,
        hasScheduleSelected: !!activeSchedule, //null = false, object = true
        setActiveSchedule,
        startSavingSchedule,
        startDeletingSchedule,
        startLoadingSchedules,
    }

}
