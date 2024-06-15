import { IoClose } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import { MdOutlineDelete, MdDelete } from "react-icons/md";
import DeletePost from "../services/index/postServices/deletePost";
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const DeletePostModal = ({ setOpenPostDeleteModal, postId }) => {
  const [isSure, setIsSure] = useState(false); // State to manage the checkbox
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  

  useEffect(() => {
    console.log(postId);
  }, [postId]);

  const mutation = useMutation({
    mutationFn: () => DeletePost(user.userInfo.token, postId),
    onSuccess: () => {
       toast.success('Post Deleted');
      setOpenPostDeleteModal(false); 
      document.body.classList.remove('overflow-hidden');// Close the modal
      navigate("/");
      
    },
    onError: (error) => {
       try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      toast.error(errormsg.errorMessage); // Displaying the error message using toast

     if (errormsg.errorCode === 403) {
        navigate("/error-403");
      } else if (errormsg.errorCode === 452) {
        navigate("/user-is-disabled");
        } else if (errormsg.errorCode === 451) {
        navigate("/user-is-ban");
      } else if (errormsg.errorCode === 500) {
        navigate("/oops");
      } 
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
      toast.error("An unexpected error occurred");
    }
    },
  });



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
              <section className="flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-4">
                  <button
                    onClick={closeModal}
                    className="z-20 text-2xl transition-all duration-300 ease-linear rounded-full w-fit h-fit hover:scale-105 hover:bg-slate-400"
                    type="button"
                  >
                    <IoClose />
                  </button>
                  <h1 className="text-lg font-bold">Delete Post</h1>
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
                      {mutation.isLoading ? <Button disabled size="sm" className="w-full px-6 py-2 font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button> :  <Button type="submit" size="sm" variant="destructive" onClick={mutation.mutate} disabled={ mutation.isLoading} className=" px-6 py-2 w-full uppercase flex items-center gap-2">
              <span className="text-xl"><MdOutlineDelete /></span>
               Delete
              
              </Button>}
                   
                  </div>
                </div>
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
