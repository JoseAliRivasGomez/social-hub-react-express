import { useSelector, useDispatch } from "react-redux"
import { onCloseModal, onOpenModal } from "../store/ui/uiSlice";

export const useUiStore = () => {

    const dispatch = useDispatch();
  
    const {isModalOpen} = useSelector(state => state.ui);

    const openModal = () => {
        dispatch(onOpenModal());
    }

    const closeModal = () => {
        dispatch(onCloseModal());
    }

    const toggleModal = () => {
        (isModalOpen) ? closeModal() : openModal();
    }

    return {
        isModalOpen,
        openModal,
        closeModal,
        toggleModal,
    }

}
