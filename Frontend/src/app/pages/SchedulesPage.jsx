import { useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useUiStore } from "../../hooks/useUiStore";
import { Button } from "flowbite-react/lib/cjs/index.js";
import { useScheduleStore } from "../../hooks/useScheduleStore";
import { ScheduleModal } from "../components/ScheduleModal";
import { SchedulesTable } from "../components/SchedulesTable";

export const SchedulesPage = () => {

    const {user} = useAuthStore();
    const {schedules, setActiveSchedule, startLoadingSchedules} = useScheduleStore();
    const {openModal} = useUiStore();
    const [time, setTime] = useState('Loading...');
    const [day, setDay] = useState('Loading...');

    useEffect(() => {
        startLoadingSchedules();
        const interval = setInterval(() => {
          setTime(new Date().toString().substring(15,24));

          const currentDate = new Date(new Date().toString().substring(0,24));
          const currentDay = currentDate.getDay();

          let currentDayChar;
          if(currentDay === 0 ){
              currentDayChar = 'Sunday';
          }else if(currentDay === 1 ){
              currentDayChar = 'Monday';
          }else if(currentDay === 2 ){
              currentDayChar = 'Tuesday';
          }else if(currentDay === 3 ){
              currentDayChar = 'Wednesday';
          }else if(currentDay === 4 ){
              currentDayChar = 'Thursday';
          }else if(currentDay === 5 ){
              currentDayChar = 'Friday';
          }else if(currentDay === 6 ){
              currentDayChar = 'Saturday';
          }
          setDay(currentDayChar);
        }, 1000);
        return () => clearInterval(interval);
    }, [])

    const onNewSchedule = () => {
        setActiveSchedule({
        day: '',
        time: '',
    })
      openModal();
    }

  return (
    <div className="App">

      <div className="border-2 rounded-lg mt-4 bg-white body2">

      <h1 className="px-0 py-2.5 text-3xl text-center font-bold text-slate-900">
        My Schedules
      </h1>
      <div className="text-lg grid grid-cols-1 justify-items-center gap-1 mb-5 mt-2">
        <h2> Current Day: {day}</h2>
        <h2> Current Time: {time}</h2>
      </div>      

      {schedules[0] ? (

        <>
        <div className="grid grid-cols-1 justify-items-center gap-1">
        <div className="flex flex-wrap gap-2 mb-5">
            <Button gradientMonochrome="purple" onClick={() => onNewSchedule()}>
                Create Schedule
            </Button>
        </div>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-5 bg-white mb-4">
          {/* <h1 className="px-6 py-2.5 text-5xl text-center font-bold text-slate-900">
            Albums
          </h1> */}

        <SchedulesTable schedules={schedules.filter(s => s.day === "D")} day={"D"} days={"Sunday"} />
        <SchedulesTable schedules={schedules.filter(s => s.day === "L")} day={"L"} days={"Monday"} />
        <SchedulesTable schedules={schedules.filter(s => s.day === "K")} day={"K"} days={"Tuesday"} />
        <SchedulesTable schedules={schedules.filter(s => s.day === "M")} day={"M"} days={"Wednesday"} />
        <SchedulesTable schedules={schedules.filter(s => s.day === "J")} day={"J"} days={"Thursday"} />
        <SchedulesTable schedules={schedules.filter(s => s.day === "V")} day={"V"} days={"Friday"} />
        <SchedulesTable schedules={schedules.filter(s => s.day === "S")} day={"S"} days={"Saturday"} />

          {/* <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-[75%] sm:px-6 lg:px-8">
              <div className="overflow-hidden mb-4">
                
              </div>
            </div>
          </div> */}
        </div>
        </>

      ) : (
        <>
        <div className="grid grid-cols-1 justify-items-center gap-1">
        <div className="flex flex-wrap gap-2 m-3">
            <Button gradientMonochrome="purple" onClick={() => onNewSchedule()}>
              Create Schedule
            </Button>
        </div>
        <p>No schedules yet :|</p>
        </div>
        </>
        
      )}
      <ScheduleModal />
      </div>

    </div>
  )
}
