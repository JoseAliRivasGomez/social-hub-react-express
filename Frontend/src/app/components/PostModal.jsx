import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import Modal from 'react-modal';
import { useUiStore } from '../../hooks/useUiStore';
import { Button, Label, ToggleSwitch, Checkbox, Textarea, Select } from "flowbite-react/lib/cjs/index.js";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addHours, differenceInSeconds, addMinutes } from 'date-fns';

import es from 'date-fns/locale/es';
import { usePostStore } from '../../hooks/usePostStore';
import { usePostTypeStore } from '../../hooks/usePostTypeStore';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useScheduleStore } from '../../hooks/useScheduleStore';
//registerLocale('es', es)

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

const getDate = () => {
    const now = new Date();
    const now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(),
                    now.getUTCDate(), now.getUTCHours(),
                    now.getUTCMinutes(), now.getUTCSeconds());
    
    // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    // console.log(now);
    // console.log(now.toUTCString());
    // console.log(now.toISOString().substring(0,19).replace('T',' ')+" GMT");
    // console.log(new Date(now.toISOString().substring(0,19).replace('T',' ')));
    // console.log(new Date(now.toISOString().substring(0,19).replace('T',' ')+" GMT"));
    // console.log(new Date(now.toISOString().substring(0,19).replace('T',' ')+" GMT").toUTCString());
    // console.log("Mon Nov 14 2022 08:16:52 GMT".substring(0,28));
    // console.log(new Date("Mon Nov 14 2022 08:16:52 GMT".substring(0,28)));
    // console.log(now_utc);
    // console.log(Date.now());

    //return new Date(now.toISOString().substring(0,19).replace('T',' '));
    return now;
  }

export function PostModal() {

  const {schedules, startLoadingSchedules} = useScheduleStore();

  const {postTypes, startLoadingPostTypes} = usePostTypeStore();
  const {user} = useAuthStore();
  const [currentDate, setCurrentDate] = useState(addMinutes(getDate(), 1));
  const {isModalOpen, closeModal} = useUiStore();

  const {activePost, startSavingPost} = usePostStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [postState, setPostState] = useState(false);

  const [modalTitle, setModalTitle] = useState("New Post");

  const [formValues, setFormValues] = useState({
      post: '',
      ChannelIds: [],
      postType: '',
      scheduledAt: addMinutes(getDate(), 5),
  });

  useEffect(() => {
    startLoadingPostTypes();
    startLoadingSchedules();
  }, []);

  useEffect(() => {
    //console.log(formValues);
    
    if (activePost !== null){
        //setFormValues({...activePost});
        setCurrentDate(addMinutes(getDate(), 1));
  
        if(activePost.post !== ''){

          //console.log(activePost);
  
          setFormValues({
              post: '',
              ChannelIds: [],
              postType: '',
              scheduledAt: addMinutes(getDate(), 5),
          });
  
        //   activePost.Channels?.forEach(channel => {
        //       formValues[channel.name] = 1;
        //   });
  
          setPostState(activePost.state);
  
          //console.log(activePost.Scheduled_Post?.scheduledAt.substring(0,19).replace('T',' '));
          setFormValues({ post: activePost.post, 
            postType: activePost.Post_Type.name, 
            //scheduledAt: (activePost.Scheduled_Post ? new Date(activePost.Scheduled_Post?.scheduledAt.substring(0,19).replace('T',' ')) : addMinutes(getDate(), 5)), 
            scheduledAt: (activePost.Scheduled_Post ? new Date(activePost.Scheduled_Post?.scheduledAt.substring(0,19).replace('T',' ')+" GMT") : addMinutes(getDate(), 5)), 
            ChannelIds: []
          });
          
          //console.log(formValues);

          if(activePost.state){
              setModalTitle("View Post");
          }else{
              setModalTitle("Edit Post");
          }
          
        }else{
          //console.log(formValues);
          setPostState(false);
          setFormValues({
              post: '',
              ChannelIds: [],
              postType: '',
              scheduledAt: addMinutes(getDate(), 5),
          })
          setModalTitle("New Post");
        }
      }else{
        setFormValues({
            post: '',
            ChannelIds: [],
            postType: '',
            scheduledAt: addMinutes(getDate(), 5),
        })
      }

  }, [activePost])



  const onInputChange = ({target}) => {
    //console.log(target);
      setFormValues({
          ...formValues,
          [target.name]: target.value
      })
  }

  const onInputChangeCheckbox = ({target}) => {
    //console.log(target);
      setFormValues({
          ...formValues,
          [target.name]: target.checked ? 1 : 0
      });
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

    setCurrentDate(addMinutes(getDate(), 1));

    if(formValues.postType === '') formValues.postType = postTypes[0]?.name;

    if(formValues.post.length < 1){
        Swal.fire('Error', "The post is empty", 'error'); 
        return;
    }

    if(activePost?.post.length === 0){
        //if((!formValues.Twitter || formValues.Twitter === 0) && (!formValues.Facebook || formValues.Facebook === 0) && (!formValues.Instagram || formValues.Instagram === 0)){
        if((!formValues.Twitter || formValues.Twitter === 0) && (!formValues.LinkedIn || formValues.LinkedIn === 0)){
            Swal.fire('Error', "Please select at least 1 channel", 'error'); 
            return;
        }
    }

    formValues.ChannelIds = [];
    if(formValues.Twitter && formValues.Twitter === 1){
        const channel = user.channels.find(channel => channel.name === "Twitter");
        formValues.ChannelIds.push(channel.id.toString());

        if(formValues.post.length > 280){
          Swal.fire('Error', "Tweets can't be more than 280 characters long", 'error'); 
          return;
        }
    }
    // if(formValues.Instagram && formValues.Instagram === 1){
    //     const channel = user.channels.find(channel => channel.name === "Instagram");
    //     formValues.ChannelIds.push(channel.id.toString());

    //     if(formValues.post.length > 2200){
    //       Swal.fire('Error', "Instagram posts can't be more than 2200 characters long", 'error'); 
    //       return;
    //     }
    // }
    // if(formValues.Facebook && formValues.Facebook === 1){
    //     const channel = user.channels.find(channel => channel.name === "Facebook");
    //     formValues.ChannelIds.push(channel.id.toString());

    //     if(formValues.post.length > 5000){
    //       Swal.fire('Error', "Facebook posts can't be more than 5000 characters long", 'error'); 
    //       return;
    //     }
    // }
    if(formValues.LinkedIn && formValues.LinkedIn === 1){
      const channel = user.channels.find(channel => channel.name === "LinkedIn");
      formValues.ChannelIds.push(channel.id.toString());

      if(formValues.post.length > 3000){
        Swal.fire('Error', "LinkedIn posts can't be more than 3000 characters long", 'error'); 
        return;
      }
  }

    //console.log(formValues);

    if(formValues.postType === 'Instant'){

        await startSavingPost({...activePost, post: formValues.post, ChannelIds: formValues.ChannelIds, state: true});
        closeModal();
        setFormSubmitted(false);

    }else if(formValues.postType === 'Queued'){

        if(!schedules[0]){
          Swal.fire('Error', "You need to have schedules to create queued posts", 'error'); 
          return;
        }
        
        await startSavingPost({...activePost, post: formValues.post, ChannelIds: formValues.ChannelIds, state: false});
        closeModal();
        setFormSubmitted(false);

    }else if(formValues.postType === 'Scheduled'){

        const difference = differenceInSeconds(formValues.scheduledAt, currentDate);
        // console.log(currentDate);
        // console.log(difference);
        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Error', 'The schedule date must be at least 1 minute from now', 'error');
            return;
        };

        //await startSavingPost({...activePost, post: formValues.post, ChannelIds: formValues.ChannelIds, state: false, scheduledAt: new Date(formValues.scheduledAt.toString().substring(0,28))});
        await startSavingPost({...activePost, post: formValues.post, ChannelIds: formValues.ChannelIds, state: false, scheduledAt: formValues.scheduledAt});
        closeModal();
        setFormSubmitted(false);
    }
    
  }



  return (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className="modal w-11/12 sm:w-11/12 md:w-3/4 lg:w-4/6 xl:w-1/2 2xl:w-1/3"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
    >
        <h1 className='text-2xl mt-1 mb-2 px-4'>{modalTitle}</h1>
        <hr />

        <form className="flex flex-col gap-4 w-full mt-3" onSubmit={onSubmit}>
          <div>
            <div className="mb-2 block px-4">
              <Label
                htmlFor="post"
                value="Post"
              />
              <Textarea
              sizing="lg"
              id="post"
              type="text"
              placeholder="My post"
              rows={10}
              name="post"
              value={formValues.post}
              onChange={onInputChange}
              className="textareaF"
              disabled={postState ? true: false}
            />
            </div>
            
          </div>

          <div>
            <div className="mb-2 block w-full px-4">
                <Label
                htmlFor="channels"
                value="Channels"
                />
                {
                    user.channels && activePost?.post.length === 0 && (
                        user.channels.map((channel, i) => (
                            
                            <div key={channel.id} className="flex items-center gap-2 my-2">
                                <Checkbox 
                                    id={channel.name} 
                                    name={channel.name}
                                    value={formValues[channel.name]}
                                    defaultChecked={formValues[channel.name] === 1 ? true : false}
                                    onChange={onInputChangeCheckbox} disabled={postState ? true: false} />
                                <Label htmlFor={channel.name}>
                                    {channel.name}
                                </Label>
                            </div>
                        ))
                    )
                }
                {
                    activePost?.post.length > 0 && (
                        activePost.Channels.map((channel, i) => (
                            <div key={channel.id} className="flex flex-wrap gap-2">
                                {channel.name}
                            </div>
                        ))
                    )
                }
 
            </div>
            
          </div>

          <div>
            <div className="mb-2 block w-full px-4">
                <Label
                htmlFor="postType"
                value="Post Type"
                />
                <Select
                id="postType"
                required={true}
                name="postType"
                value={formValues.postType}
                onChange={onInputChange}
                disabled={postState || activePost?.post.length > 0 ? true: false}
            >
                {
                    postTypes[0] && (
                        postTypes.map((postType) => (
                            <option value={postType.name} key={postType.id}>
                                {postType.name}
                            </option>
                        ))
                    )
                }
              
            </Select>
            </div>
            
          </div>


          <div>
            <div className={formValues.postType === 'Scheduled' ? "mb-2 block px-4" : "mb-2 px-4 hidden"}>
              <Label
                htmlFor="scheduledAt"
                value="Schedule At"
              />
              <DatePicker id="scheduledAt" selected={formValues.scheduledAt} className="w-full border-1 border-gray-300 rounded-lg" showTimeSelect timeIntervals={1} 
                // locale="es" timeCaption='Hora'
                dateFormat="MM/dd/yyyy HH:mm" timeFormat='HH:mm'
                onChange={(event) => onDateChange(event, 'scheduledAt')} minDate={currentDate} disabled={postState ? true: false} />
            </div>
            
          </div>
          
          <div className={!postState ? "px-4 pb-4" : "px-4 pb-4 hidden"}>
            <Button type="submit" className="w-full">
              Save Post
            </Button>
          </div>


          
        </form>
                
    </Modal>
  );
}
