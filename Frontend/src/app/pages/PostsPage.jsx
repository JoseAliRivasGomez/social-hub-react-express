import { useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useUiStore } from "../../hooks/useUiStore";
import { Button } from "flowbite-react/lib/cjs/index.js";
import { usePostStore } from "../../hooks/usePostStore";
import { PendingPostsTable } from "../components/PendingPostsTable";
import { PostModal } from "../components/PostModal";
import { PublishedPostsTable } from "../components/PublishedPostsTable";
import { useConnectionStore } from "../../hooks/useConnectionStore";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { useNavigate } from "react-router-dom";

export const PostsPage = () => {

    const {user} = useAuthStore();
    const {pendingPosts, publishedPosts, setActivePost, startLoadingPendingPosts, startLoadingPublishedPosts, setResetPendingPostsPagination, setResetPublishedPostsPagination} = usePostStore();
    const {connections, startLoadingConnections} = useConnectionStore();
    const {openModal} = useUiStore();
    const navigate = useNavigate();

    useEffect(() => {
      startLoadingPendingPosts();
      startLoadingPublishedPosts();
      startLoadingConnections();
    }, [])

    const onReloadPosts = () => {
      startLoadingPendingPosts();
      startLoadingPublishedPosts();
      setResetPendingPostsPagination(true);
      setResetPublishedPostsPagination(true);
    }

    const goToChannels = () => {
      
      navigate("/channels");
    }

    const onNewPost = () => {

      if(!connections[0]){

        Swal.fire({
          title: 'Error',
          text: "You can't create a post because you haven't connected any channels yet",
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok, connect a channel!',
          cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
    
              try {
    
                  goToChannels();
                  
              } catch (error) {
                  console.log(error);
                  Swal.fire(
                      'Error',
                      'Error',
                      'error'
                    )
              }
    
          }
        });

      }else{
        setActivePost({
            post: '',
        });
        openModal();
      }

      
    }

  return (
    <div className="App">

      <div className="border-2 rounded-lg mt-4 bg-white body2">

      <h1 className="px-0 py-2.5 text-3xl text-center font-bold text-slate-900">
        My Posts
      </h1>

      <div className="grid grid-cols-1 justify-items-center gap-1">
          <div className="flex flex-wrap gap-2 mb-5">
              <Button gradientMonochrome="purple" onClick={() => onNewPost()}>
                Create Post
              </Button>

              <Button gradientMonochrome="success" onClick={() => onReloadPosts()}>
                Reload Posts
              </Button>
          </div>
        </div>

      <hr className="mt-5 mb-2" />

      <h2 className="px-0 py-2.5 text-2xl text-center font-bold text-slate-900">
        My Pending Posts
      </h2>

      {pendingPosts[0] ? (

        <>
        
        <div className="flex flex-wrap justify-center items-start gap-5 bg-white mb-4">
          {/* <h1 className="px-6 py-2.5 text-5xl text-center font-bold text-slate-900">
            Albums
          </h1> */}

          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-[75%] sm:px-6 lg:px-8">
              <div className="overflow-hidden mb-4">
              <PendingPostsTable />
              </div>
            </div>
          </div>
        </div>

        </>

        
      ) : (
        <>
        <div className="grid grid-cols-1 justify-items-center gap-1">
          <p>You don't have pending posts :|</p>
        </div>
        </>
        
      )}

      <hr className="mt-5 mb-2" />

      <h2 className="px-0 py-2.5 text-2xl text-center font-bold text-slate-900">
        My Published Posts
      </h2>

      {publishedPosts[0] ? (

        <>

        <div className="flex flex-wrap justify-center items-start gap-5 bg-white mb-4">
          {/* <h1 className="px-6 py-2.5 text-5xl text-center font-bold text-slate-900">
            Albums
          </h1> */}

          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-[75%] sm:px-6 lg:px-8">
              <div className="overflow-hidden mb-4">
              <PublishedPostsTable />
              </div>
            </div>
          </div>
        </div>

        </>

      ) : (
        <>
        <div className="grid grid-cols-1 justify-items-center gap-1">
          <p>You haven't published posts yet :|</p>
        </div>
        </>

      )}



      <PostModal />
      </div>
    </div>
  )
}
