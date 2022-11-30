import { Table, Button } from "flowbite-react/lib/cjs/index.js";
import { Link } from "react-router-dom";
import { useUiStore } from "../../hooks/useUiStore";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { useScheduleStore } from "../../hooks/useScheduleStore";

export const SchedulesTable = ({schedules, day, days}) => {

    const {setActiveSchedule} = useScheduleStore();
    const {openModal} = useUiStore();

    const onEditSchedule = (schedule) => {
        setActiveSchedule(schedule);
        openModal();
    }

  return (
    <>
      <Table hoverable={true} className="border-2 rounded-lg">
        <Table.Head> 
          <Table.HeadCell className="text-center">{days}</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {schedules.map((schedule) => (
            <Table.Row key={schedule.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>
              <div className="flex flex-wrap gap-2">
                <Button 
                  gradientDuoTone={day === "D" ? "purpleToBlue" : 
                  day === "L" ? "cyanToBlue" : 
                  day === "K" ? "greenToBlue" : 
                  day === "M" ? "purpleToPink" : 
                  day === "J" ? "pinkToOrange" : 
                  day === "V" ? "tealToLime" : 
                  day === "S" ? "redToYellow" : ''} 
                  onClick={() => onEditSchedule(schedule)}>
                  {schedule.time?.toString().substring(0,5)}
                  {/* {new Date("2022-11-14 " + schedule.time + " GMT").toString().substring(16,21)} */}
                </Button>
                
              </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
