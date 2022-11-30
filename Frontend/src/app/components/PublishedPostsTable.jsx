import { Table, Button, Pagination } from "flowbite-react/lib/cjs/index.js";
import { Link } from "react-router-dom";
import { useUiStore } from "../../hooks/useUiStore";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { usePostStore } from "../../hooks/usePostStore";
import { useEffect, useState } from "react";

export const PublishedPostsTable = () => {

    const {publishedPosts, totalPublishedPosts, setActivePost, startLoadingPublishedPosts, resetPublishedPostsPagination, setResetPublishedPostsPagination} = usePostStore();
    const {openModal} = useUiStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalPublishedPosts/10));
    const [desde, setDesde] = useState(0);
    const [limite, setLimite] = useState(10);

    useEffect(() => {
        //console.log(totalPages);
    }, []);

    useEffect(() => {
      setTotalPages(Math.ceil(totalPublishedPosts/10));
    }, [publishedPosts]);

    useEffect(() => {
        if(resetPublishedPostsPagination){
          setResetPublishedPostsPagination(false);
          setCurrentPage(1);
          setDesde(0);
        }
    }, [resetPublishedPostsPagination]);

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
        startLoadingPublishedPosts(desde+10, limite);
        setDesde(desde+10);
      }else if(page<currentPage){
        
        // console.log(desde-10);
        // console.log(limite);
        startLoadingPublishedPosts(desde-10, limite);
        setDesde(desde-10);
      }

      //console.log(publishedPosts.length);
      setCurrentPage(page);


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
          <Table.HeadCell className="text-center">Created At</Table.HeadCell>
          <Table.HeadCell className="text-center">Published At</Table.HeadCell>
          <Table.HeadCell className="text-center"></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {publishedPosts.map((post) => (
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
                    {new Date(post.createdAt.substring(0,16).replace('T',' ')+" GMT").toString().substring(0,21)}
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                    {post.Post_Type.name === "Instant" ? new Date(post.createdAt.substring(0,16).replace('T',' ')+" GMT").toString().substring(0,21) : 
                    post.Post_Type.name === "Queued" ? new Date(post.updatedAt.substring(0,16).replace('T',' ')+" GMT").toString().substring(0,21) : 
                    post.Post_Type.name === "Scheduled" ? new Date(post.Scheduled_Post.scheduledAt.substring(0,16).replace('T',' ')+" GMT").toString().substring(0,21) : ''} 
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                    <Button gradientMonochrome="info" onClick={() => onViewPost(post)}>
                    View
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
