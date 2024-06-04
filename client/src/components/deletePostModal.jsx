import { IoClose } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import { MdOutlineDelete, MdDelete } from "react-icons/md";
import DeletePost from "../services/index/postServices/deletePost";

const DeletePostModal = ({ setOpenPostDeleteModal, postId }) => {
  const [isSure, setIsSure] = useState(false); // State to manage the checkbox
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(postId);
  }, [postId]);

  const mutation = useMutation({
    mutationFn: () => DeletePost(user.userInfo.token, postId),
    onSuccess: () => {
       toast.success('Post Deleted');
      setOpenPostDeleteModal(false); // Close the modal
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

  const closeModal = () => {
    setOpenPostDeleteModal(false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <>
      <section className="w-dvw h-dvh backdrop-blur-md fixed top-0 left-0 z-[100]">
        <section className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] md:translate-y-[40%]">
            <section className="md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-h-[350px] min-w-[350px] max-w-full md:w-fit rounded-lg">
              <section className="flex justify-between mb-2 items-center w-full">
                <span className="flex gap-4 items-center">
                  <button
                    onClick={closeModal}
                    className="w-fit h-fit rounded-full text-2xl hover:scale-105 transition-all duration-300 ease-linear hover:bg-slate-400 z-20"
                    type="button"
                  >
                    <IoClose />
                  </button>
                  <h1 className="font-bold text-lg">Delete Post</h1>
                </span>
              </section>
              <section className="flex flex-col justify-between gap-[50%] items-center">
                <span className="text-[8rem] dark:hover:text-red-500 hover:text-red-300 transition-all duration-300 ease-linear">
                  <MdDelete />
                </span>
                <form onSubmit={mutation.mutate}>
                  <div className="mt-4 flex gap-1 items-baseline accent-red-500">
                    <input
                      type="checkbox"
                      id="confirmDelete"
                      checked={isSure}
                      onChange={() => setIsSure(prev => !prev)}
                    />
                    <label htmlFor="confirmDelete" className="ml-2 text-justify md:w-[350px]">
                      Are you sure you want to delete your Post?
                    </label>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="disabled:opacity-70 flex gap-2 items-center transition-all duration-300 ease-linear bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      disabled={mutation.isLoading || !isSure}
                    >
                      <span className="text-xl"><MdOutlineDelete /></span>
                      {mutation.isLoading ? "Processing..." : "Delete Post"}
                    </button>
                  </div>
                </form>
              </section>
            </section>
          </div>
        </section>
      </section>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default DeletePostModal;
