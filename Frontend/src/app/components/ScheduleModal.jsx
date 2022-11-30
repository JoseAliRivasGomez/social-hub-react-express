import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import Modal from 'react-modal';
import { useUiStore } from '../../hooks/useUiStore';
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react/lib/cjs/index.js";
import { useScheduleStore } from '../../hooks/useScheduleStore';
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import es from 'date-fns/locale/es';
registerLocale('es', es)

const customStyles = {
  content: {
    // top: '50%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export function ScheduleModal() {

  const {isModalOpen, closeModal} = useUiStore();

  const {activeSchedule, startSavingSchedule, startDeletingSchedule, startLoadingSchedules} = useScheduleStore();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [modalTitle, setModalTitle] = useState("New Schedule");

  const [formValues, setFormValues] = useState({
      day: 'D',
      time: new Date(),
      //time: new Date(new Date().toISOString().substring(0,19).replace('T',' '))
  });

  useEffect(() => {
    //console.log(formValues);
    if (activeSchedule !== null){
      //setFormValues({...activeSchedule});

      if(activeSchedule.day !== ''){
        setFormValues({day: activeSchedule.day, time: new Date("2022-11-14 " + activeSchedule.time)});
        //setFormValues({day: activeSchedule.day, time: new Date("2022-11-14 " + activeSchedule.time+" GMT")});
        setModalTitle("Edit Schedule");
      }else{
        //console.log(formValues);
        setFormValues({
          day: 'D',
          time: new Date(),
          //time: new Date(new Date().toISOString().substring(0,19).replace('T',' '))
      })
        setModalTitle("New Schedule");
      }
    }

  }, [activeSchedule])


  const onInputChange = ({target}) => {
      setFormValues({
          ...formValues,
          [target.name]: target.value
      })
  }

  const onDateChange = (event, changing) => {
      setFormValues({
          ...formValues,
          [changing]: event
      });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if(formValues.day === '') formValues.day = 'D';

    const time = formValues.time.toString().substring(16,21);
    
    // const newDate = new Date(formValues.time.toISOString().substring(0,19).replace('T',' '));
    // const time = newDate.toString().substring(16,21);

    // console.log(formValues);
    //console.log(time);

    await startSavingSchedule({...activeSchedule, day: formValues.day, time});
    closeModal();
    setFormSubmitted(false);
    //await startLoadingSchedules();
}

  const onDeleteSchedule = () => {
    startDeletingSchedule({...activeSchedule});
    closeModal();
  }

  const onConfirmDeleteSchedule = () => {

    Swal.fire({
      title: 'Are you sure you want to delete this schedule?',
      text: "This action can't be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {

          try {

              onDeleteSchedule();
              
          } catch (error) {
              console.log(error);
              Swal.fire(
                  'Error',
                  'Error while deleting schedule',
                  'error'
                )
          }

      }
    });

  }

  return (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className="modal w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
    >
        <h1 className='text-2xl mt-1 mb-2 px-4'>{modalTitle}</h1>
        <hr />

        <form className="flex flex-col gap-4 w-full mt-3" onSubmit={onSubmit}>
          <div>
            <div className="mb-2 block w-full px-4">
              <Label
                htmlFor="day"
                value="Day"
              />
              <Select
              id="day"
              required={true}
              name="day"
              value={formValues.day}
              onChange={onInputChange}
            >
              <option value="D">
                Sunday
              </option>
              <option value="L">
                Monday
              </option>
              <option value="K">
                Tuesday
              </option>
              <option value="M">
                Wednesday
              </option>
              <option value="J">
                Thursday
              </option>
              <option value="V">
                Friday
              </option>
              <option value="S">
                Saturday
              </option>
            </Select>
            </div>
            
          </div>
          <div>
            <div className="mb-2 block px-4">
              <Label
                htmlFor="time"
                value="Time"
              />
              <DatePicker id="time" selected={formValues.time} className="w-full border-1 border-gray-300 rounded-lg" showTimeSelect
                showTimeSelectOnly
                timeIntervals={1}
                dateFormat="HH:mm"
                locale="es" timeCaption='Time'
                onChange={(event) => onDateChange(event, 'time')} />
            </div>
            
          </div>
          
          <div className="px-4 pb-4">
            <Button type="submit" className="w-full">
              Save schedule
            </Button>
          </div>

          {
            activeSchedule?.day !== '' && (
              <div className="px-4 pb-4">
                <Button color="failure" onClick={() => onConfirmDeleteSchedule()}>
                  Eliminar
                </Button>
              </div>
            )
          }
          
        </form>
                
    </Modal>
  );
}
