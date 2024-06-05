import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import editComment from "../services/index/commentServices/editComment";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const EditCommentModal = ({ setOpenCommentModal, commentId, initialContent }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }} = useForm({
    defaultValues: {
      content: initialContent || "",
    },
    mode: "onChange",
  });
   const mutation = useMutation({
    mutationFn: editComment,
    onSuccess: (commentData) => {
      toast.success(`Comment updated successfully`);
         queryClient.invalidateQueries(["post"])
            
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

 

  const closeModal = () => {
    setOpenCommentModal(false);
    document.body.classList.remove('overflow-hidden');
  };

  const submitHandler = (commentData) => {
    const { content } = commentData;
    mutation.mutate({ commentId, content, token: user.userInfo.token });
  };

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
    
  }, [navigate, user,]);

  return (
    <>
      <section className="fixed top-0 left-0 w-screen h-screen z-[100] backdrop-blur-md flex items-center justify-center">
        <div className="relative bg-slate-300 dark:bg-slate-800 p-4 rounded-lg min-w-[400px] max-w-full md:w-fit">
          <form onSubmit={handleSubmit(submitHandler)}>
            <section className="flex items-center justify-between w-full mb-2">
              <span className="flex items-center gap-4">
                <button
                  onClick={closeModal}
                  className="z-20 text-2xl transition-all duration-300 ease-linear rounded-full w-fit h-fit hover:scale-105 hover:bg-red-500"
                  type="button"
                >
                  <IoClose />
                </button>
                <h1 className="text-lg font-bold">Edit Comment</h1>
              </span>
              {mutation.isLoading ? (
                <Button disabled className="px-3 py-[0.5px] font-bold">
                  <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button type="submit" size="sm" disabled={mutation.isLoading} className="disabled:opacity-70 px-5 py-[0.5px] transition-all duration-300 capitalize">
                  Save
                </Button>
              )}
            </section>
            <section>
              <div className="flex flex-col gap-2 md:w-[400px] w-full">
                <label htmlFor="content" className="text-base capitalize md:text-lg">Content</label>
                <textarea
                  {...register("content", { required: "Content is required" })}
                  placeholder="Content"
                  className={`mb-2 resize-none h-24 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                ></textarea>
                {errors.content && <p className="text-red-500">{errors.content.message}</p>}
              </div>
            </section>
          </form>
        </div>
      </section>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default EditCommentModal;
