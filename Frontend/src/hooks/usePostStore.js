import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2";
import mainApi from "../api/mainApi";
import { onAddNewPendingPost, onAddNewPublishedPost, onDeletePendingPost, onLoadPendingPosts, onLoadPendingPostsCount, onLoadPublishedPosts, onLoadPublishedPostsCount, onResetPendingPostsPagination, onResetPublishedPostsPagination, onSetActivePost, onUpdatePendingPost } from "../store/app/postSlice";
import confetti from 'canvas-confetti';

export const usePostStore = () => {

    const dispatch = useDispatch();
  
    const {pendingPosts, publishedPosts, activePost, totalPendingPosts, totalPublishedPosts, resetPendingPostsPagination, resetPublishedPostsPagination} = useSelector(state => state.posts);
    const {user} = useSelector(state => state.auth);

    const setActivePost = (post) => {
        localStorage.setItem('activePost', post.id);
        dispatch(onSetActivePost(post));
    }

    const setResetPendingPostsPagination = (value) => {
        dispatch(onResetPendingPostsPagination(value));
    }

    const setResetPublishedPostsPagination = (value) => {
        dispatch(onResetPublishedPostsPagination(value));
    }

    const startSavingPost = async(post) => {

        try {

            if (post.id){ //Update
                await mainApi.put(`/posts/${post.id}`, post);
                dispatch(onUpdatePendingPost({...post}));
                Swal.fire('Post updated!', 'The post was updated successfully!', 'success');
                return;
            }

            //Create
            //console.log(post);
            const {data} = await mainApi.post('/posts', post);

            if(post.state === undefined || post.state){ //instant
                startLoadingPublishedPosts();
                setResetPublishedPostsPagination(true);
            }else{
                startLoadingPendingPosts();
                setResetPendingPostsPagination(true);
            }
            
            Swal.fire('Post created!', 'The post was created successfully!', 'success');
            
            confetti({
                zIndex: 999,
                particleCount: 500,
                spread: 200,
                angle: -100,
                origin: {
                    x: 1,
                    y: 0
                }
            });
            confetti({
                zIndex: 999,
                particleCount: 500,
                spread: 200,
                angle: -100,
                origin: {
                    x: 0,
                    y: 0
                }
            });
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error while saving post', error.response.data?.message, 'error');
        }
        
    }

    const startDeletingPendingPost = async(post) => {

        try {

            await mainApi.delete(`/posts/${post.id}`);

            dispatch(onDeletePendingPost());

            Swal.fire('Post deleted!', 'The post was deleted successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while deleting post', error.response.data?.message, 'error');
        }
        
    }

    const startLoadingPendingPosts = async (desde = 0, limite = 10) => {
        try {
            
            const {data} = await mainApi.get(`/posts/pending?desde=${desde}&limite=${limite}`);

            //console.log(data);

            dispatch(onLoadPendingPosts(data.pendingPosts));
            dispatch(onLoadPendingPostsCount(data.total));

        } catch (error) {
            //console.log(error);
        }
    }

    const startLoadingPublishedPosts = async (desde = 0, limite = 10) => {
        try {
            
            const {data} = await mainApi.get(`/posts/published?desde=${desde}&limite=${limite}`);

            //console.log(data);

            dispatch(onLoadPublishedPosts(data.publishedPosts));
            dispatch(onLoadPublishedPostsCount(data.total));

        } catch (error) {
            //console.log(error);
        }
    }

    return {
        pendingPosts: pendingPosts,
        publishedPosts: publishedPosts,
        totalPendingPosts: totalPendingPosts,
        totalPublishedPosts: totalPublishedPosts,
        activePost: activePost,
        hasPostSelected: !!activePost, //null = false, object = true
        resetPendingPostsPagination,
        resetPublishedPostsPagination,
        setResetPendingPostsPagination,
        setResetPublishedPostsPagination,
        setActivePost,
        startSavingPost,
        startDeletingPendingPost,
        startLoadingPendingPosts,
        startLoadingPublishedPosts,
    }

}
