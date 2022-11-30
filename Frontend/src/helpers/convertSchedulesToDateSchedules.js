import { parseISO } from "date-fns";

export const convertSchedulesToDateSchedules = (schedules = []) => {
  
    return schedules.map(schedule => {

        schedule.time = parseISO(schedule.time);

        return schedule;
    })

}
