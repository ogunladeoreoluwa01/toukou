import React, { useState, useEffect } from "react";

import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import {  MdDelete } from "react-icons/md";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import { MdOutlineDelete } from "react-icons/md";
import deleteComment from "../services/index/commentServices/deleteComment";



const DeleteCommentModal = ({setOpenCommentDeleteModal, commentId}) => {


     const [isSure, setIsSure] = useState(false); 
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  
  const mutation = useMutation({
    mutationFn:() => deleteComment({ token:user.userInfo.token, commentId }),
    onSuccess: () => {
      toast.success('comment deleted.')
        setOpenCommentDeleteModal(false);
            document.body.classList.remove('overflow-hidden')
      queryClient.invalidateQueries(["post"]);
      
     
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

 const closeModal = () => {
    setOpenCommentDeleteModal(false);
    document.body.classList.remove('overflow-hidden');
  };

 

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

    return ( <>
    
     <section className="w-dvw h-dvh backdrop-blur-md fixed top-0 left-0 z-[100]">
        <section className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] md:translate-y-[40%]">
            <section className="md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-h-[350px] min-w-[350px] max-w-full md:w-fit rounded-lg">
              <section className="flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-4">
                  <button
                    onClick={closeModal}
                    className="z-20 text-2xl transition-all duration-300 ease-linear rounded-full w-fit h-fit hover:scale-105 hover:bg-slate-400"
                    type="button"
                  >
                    <IoClose />
                  </button>
                  <h1 className="text-lg font-bold">Delete Comments</h1>
                </span>
              </section>
              <section className="flex flex-col justify-between gap-[50%] items-center">
                <span className="text-[8rem] dark:hover:text-red-500 hover:text-red-300 transition-all duration-300 ease-linear">
                  <MdDelete />
                </span>
                <div >
                  <div className="flex items-baseline gap-1 mt-4 accent-red-500">
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
                      onClick={mutation.mutate}
                      className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all duration-300 ease-linear bg-red-500 rounded disabled:opacity-70 hover:bg-red-600"
                      disabled={mutation.isLoading || !isSure}
                    >
                      <span className="text-xl"><MdOutlineDelete /></span>
                      {mutation.isLoading ? "Processing..." : "Delete Post"}
                    </button>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </section>
      </section>
    
    </> );
}
 
export default DeleteCommentModal;