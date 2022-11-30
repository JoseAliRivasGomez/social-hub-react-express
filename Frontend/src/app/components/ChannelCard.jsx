import { Card, Button } from "flowbite-react/lib/cjs/index.js";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useChannelStore } from "../../hooks/useChannelStore";


export const ChannelCard = ({channel}) => {

    const {startSavingConnection} = useAuthStore();
    const {setActiveChannel} = useChannelStore();
    const navigate = useNavigate();

    const onNewChannelConnection = () => {
        if(channel.name === 'Twitter'){
            window.open("http://localhost:4000/api/connections/auth/twitter", "_self");
        }else if(channel.name === 'LinkedIn'){
            window.open("http://localhost:4000/api/connections/auth/linkedin", "_self");
        }
        //setActiveChannel(channel);
        //startSavingConnection(channel);
        //navigate("/channels");
    }

  return (
    <>
    <div className="max-w-sm">
        <Card>
            <div className="flex flex-col items-center pb-0">
            <img
                className="mb-3 h-24 w-24 rounded-full shadow-lg"
                src={'/'+channel.name+'.png'}
                alt={channel.name}
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {channel.name}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Profile
            </span>
            <div className="mt-4 flex space-x-3 lg:mt-6">
            <div>
                <Button onClick={() => onNewChannelConnection()}>
                    Connect
                </Button>
            </div>
            </div>
            </div>
        </Card>
    </div>
    </>
  )
}
