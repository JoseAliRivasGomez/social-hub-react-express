import { Table, Button, Pagination } from "flowbite-react/lib/cjs/index.js";
import { Link } from "react-router-dom";
import { useUiStore } from "../../hooks/useUiStore";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { usePostStore } from "../../hooks/usePostStore";
import { useEffect, useState } from "react";

export const PendingPostsTable = () => {

    const {pendingPosts, totalPendingPosts, setActivePost, startDeletingPendingPost, startLoadingPendingPosts, resetPendingPostsPagination, setResetPendingPostsPagination} = usePostStore();
    const {openModal} = useUiStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalPendingPosts/10));
    const [desde, setDesde] = useState(0);
    const [limite, setLimite] = useState(10);

    useEffect(() => {
        
    }, []);

    useEffect(() => {
      setTotalPages(Math.ceil(totalPendingPosts/10));
    }, [pendingPosts]);

    useEffect(() => {
      if(resetPendingPostsPagination){
        setResetPendingPostsPagination(false);
        setCurrentPage(1);
        setDesde(0);
      }
  }, [resetPendingPostsPagination]);

    const onViewPost = (post) => {
      setActivePost(post);
      openModal();
    }

    const onPageChange = (page) => {
      // console.log(page);
      // console.log(currentPage);
      // console.log(totalPages);

      if(page>currentPage){
        
        // console.log(desde+10);
        // console.log(limite);
        startLoadingPendingPosts(desde+10, limite);
        setDesde(desde+10);
      }else if(page<currentPage){
        
        // console.log(desde-10);
        // console.log(limite);
        startLoadingPendingPosts(desde-10, limite);
        setDesde(desde-10);
      }

      //console.log(publishedPosts.length);
      setCurrentPage(page);


    }

    const onDeletePost = async (post) => {
        setActivePost(post);
        await startDeletingPendingPost(post);
        //console.log(desde);
        await startLoadingPendingPosts(desde, limite);
    }

    const onConfirmDeletePost = (post) => {

        Swal.fire({
            title: 'Are you sure you want to delete this post?',
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

                    onDeletePost(post);
                    
                } catch (error) {
                    console.log(error);
                    Swal.fire(
                        'Error',
                        'Error while deleting post',
                        'error'
                    )
                }

            }
        });

    }

  return (
    <>
      {
        totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons={true}
            className="mb-5"
          />  
        )
      }

      <Table hoverable={true} className="border-2 rounded-lg">
        <Table.Head> 
          <Table.HeadCell className="text-center">Post</Table.HeadCell>
          <Table.HeadCell className="text-center">Post Type</Table.HeadCell>
          <Table.HeadCell className="text-center">Channels</Table.HeadCell>
          <Table.HeadCell className="text-center">Scheduled At</Table.HeadCell>
          <Table.HeadCell className="text-center"></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {pendingPosts.map((post) => (
            <Table.Row key={post.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                    {post.post.toString().substring(0,20)}...
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                    {post.Post_Type.name}
                </div>
              </Table.Cell>
              <Table.Cell> 
                {post.Channels.map((channel) => (
                    <div key={channel.id} className="flex flex-wrap gap-2">
                        {channel.name}
                    </div>
                ))}
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                    {post.Post_Type.name === "Instant" ? '' : 
                    post.Post_Type.name === "Queued" ? 'In queue' : 
                    post.Post_Type.name === "Scheduled" ? new Date(post.Scheduled_Post.scheduledAt.substring(0,16).replace('T',' ')+" GMT").toString().substring(0,21) : ''} 
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                    <Button gradientMonochrome="info" onClick={() => onViewPost(post)}>
                        Edit
                    </Button>
                    <Button gradientMonochrome="failure" onClick={() => onConfirmDeletePost(post)}>
                        Delete
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
