import { useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Button } from "flowbite-react/lib/cjs/index.js";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { ConnectionsTable } from "../components/ConnectionsTable";

export const ConnectionsPage = () => {

    const {user, activeConnection, setActiveConnection, startSavingConnection} = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {

        startSavingConnection();
        //console.log(user.channels);
    }, [])

    const onNewConnection = () => {
      
      navigate("/channels/connect");
    }

  return (
    <div className="App">

  <div className="border-2 rounded-lg mt-4 bg-white body2">

    <h1 className="px-0 py-2.5 text-3xl text-center font-bold text-slate-900">
      My Channels
    </h1>

      {user.channels?.length > 0 ? (

        <>

          

        {/* <div className="flex flex-wrap gap-2 m-3">
            <Button gradientMonochrome="purple" onClick={() => onNewConnection()}>
              Connect Channel
            </Button>
        </div> */}

        <div className="flex flex-wrap justify-center items-start gap-5 bg-white mb-4">
          {/* <h1 className="px-6 py-2.5 text-5xl text-center font-bold text-slate-900">
            Albums
          </h1> */}

        

          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-[75%] sm:px-6 lg:px-8">
              <div className="overflow-hidden mb-4">
              <ConnectionsTable connections={user.channels}  />
              </div>
            </div>
          </div>
        

        </div>
        </>
      ) : (
        <>
        <div className="grid grid-cols-1 justify-items-center gap-1">
        <div className="flex flex-wrap gap-2 m-3">
            <Button gradientMonochrome="purple" onClick={() => onNewConnection()}>
                Connect Channel
            </Button>
        </div>
        <p>No channels connected yet :|</p>
        </div>
        </>
        
      )}

    </div>
      
    </div>
  )
}
