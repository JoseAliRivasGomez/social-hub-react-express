import { Table, Button } from "flowbite-react/lib/cjs/index.js";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { useAuthStore } from "../../hooks/useAuthStore";

export const ConnectionsTable = ({connections}) => {

    const {user, activeConnection, setActiveConnection, startDeletingConnection} = useAuthStore();
    const navigate = useNavigate();
    
    const onNewConnection = () => {
      
      navigate("/channels/connect");
    }

    const onDeleteConnection = (connection) => {
      setActiveConnection(connection);
      startDeletingConnection(connection);
    }
  
    const onConfirmDeleteConnection = (connection) => {
  
      Swal.fire({
        title: 'Are you sure you want to remove this channel?',
        text: "This action can't be undone! Your pending posts for this channel won't be published if you remove the channel!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'No, cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
    
            try {
    
                onDeleteConnection(connection);
                
            } catch (error) {
                console.log(error);
                Swal.fire(
                    'Error',
                    'Error while removing channel',
                    'error'
                  )
            }
    
        }
      })
  
    }

  return (
    <>
      <Table hoverable={true} className="border-2 rounded-lg">
        <Table.Head> 
          <Table.HeadCell className="text-center">Photo</Table.HeadCell>
          <Table.HeadCell className="text-center">Username</Table.HeadCell>
          <Table.HeadCell className="text-center">Channel</Table.HeadCell>
          <Table.HeadCell className="text-center">Connected at</Table.HeadCell>
          <Table.HeadCell>
          <div className="flex flex-wrap gap-2">
            <Button gradientMonochrome="purple" onClick={() => onNewConnection()}>
              Connect Channel
            </Button>
          </div>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {connections.map((connection) => (
            <Table.Row key={connection.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell><img
                src={connection.Channels_Users.photoURL}
                className="mr-3 h-6 sm:h-9"
                alt="User Photo"
              /></Table.Cell>
              <Table.Cell> {connection.Channels_Users.username}</Table.Cell>
              <Table.Cell> {connection.name}</Table.Cell>
              <Table.Cell> {connection.Channels_Users.createdAt.substring(0,16).replace('T',' ')}</Table.Cell>
              <Table.Cell>
              <div className="flex flex-wrap gap-2">
                <Button gradientMonochrome="failure" onClick={() => onConfirmDeleteConnection(connection)}>
                  Remove Channel
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
