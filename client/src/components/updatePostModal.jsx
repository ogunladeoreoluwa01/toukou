import { useState, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import { updatePost } from "../services/index/postServices/updatePost"; // Correct import statement
import CropEasyPostPic from "./cropped/cropEasyPostUpload";
import { createPortal } from "react-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";


const UpdatePostModal = ({  setOpenPostModal,postId,setReloadData }) => {
  const [openCropPostPic, setOpenCropPostPic] = useState(false);
  const [postPhoto, setPostPhoto] = useState(null);
  const [selectedPostImg, setSelectedPostImg] = useState();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();


  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (postData) => {
      toast.success(`Post updated successfully`);
      
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const closeModal = () => {
     setOpenPostModal(false);
    document.body.classList.remove('overflow-hidden');
    
  };

  const submitHandler = (postData) => {
    const { title, content } = postData;
    mutation.mutate({ postId, postData, token: user.userInfo.token });
  };

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

  const removePostImg = () => {
    setSelectedPostImg(undefined);
  };

  return (
    <>
      {openCropPostPic && createPortal(
        <CropEasyPostPic
          photo={postPhoto}
          postId={postId}
          setOpenCropPostPic={setOpenCropPostPic}
          setSelectedPostImg={setSelectedPostImg}
        />, document.getElementById("portal")
      )}

      <section className="w-dvw h-dvh backdrop-blur-md fixed top-0 left-0 z-[100]">
        <section className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <form onSubmit={handleSubmit(submitHandler)} className="scale-[0.9] md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-w-[400px] max-w-full md:w-fit rounded-lg">
              <section className="flex justify-between mb-2 items-center w-full">
                <span className="flex gap-4 items-center">
                  <button
                    onClick={closeModal}
                    className="w-fit h-fit rounded-full text-2xl hover:scale-105 transition-all duration-300 ease-linear hover:bg-red-500 z-20"
                    type="button"
                  >
                    <IoClose />
                  </button>
                  <h1 className="font-bold text-lg">Edit Post</h1>
                </span>
                {mutation.isLoading ? (
                  <Button disabled className="px-3 py-[0.5px] font-bold">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </Button>
                ) : (
                  <Button type="submit" size="sm" disabled={mutation.isLoading} className="disabled:opacity-70 px-5 py-[0.5px] transition-all duration-300 capitalize">
                    Save
                  </Button>
                )}
              </section>
              <section className="mb-2">
                <section className="relative">
                  <div className="flex items-center justify-center w-full md:w-[400px]">
                    <label
                      htmlFor="dropzone-post"
                      className="flex flex-col items-center justify-center w-full border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">Click to upload post image</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                      <input
                        id="dropzone-post"
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg,.gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setSelectedPostImg(file ? URL.createObjectURL(file) : undefined);
                          setPostPhoto({ url: URL.createObjectURL(file), file });
                          setOpenCropPostPic(true);
                        }}
                      />
                    </label>
                  </div>
                  {selectedPostImg && (
                    <>
                      <button
                        className="absolute w-fit h-fit bg-white rounded-full -top-2 -left-2 text-2xl hover:scale-105 transition-all duration-300 ease-linear text-red-500 z-20"
                        onClick={removePostImg}
                        type="button"
                      >
                        <IoMdCloseCircle />
                      </button>
                      <div className="w-full md:w-[400px] h-[140px] border absolute p-1 bottom-0 rounded-lg">
                        <img
                          loading="lazy"
                          decoding="async"
                          fetchpriority="high"
                          src={selectedPostImg}
                          alt="Selected"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  )}
                </section>
              </section>
              <section>
                <section>
                  <div className="flex flex-col gap-2 md:w-[400px] w-full mb-2">
                    <label htmlFor="title" className="capitalize">Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="Title"
                      className={`mb-2 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2 md:w-[400px] w-full">
                    <label htmlFor="content" className="text-base md:text-lg capitalize">Content</label>
                    <textarea
                      {...register("content")}
                      placeholder="Content"
                      className={`mb-2 resize-none h-24 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                    ></textarea>
                    {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                  </div>
                </section>
              </section>
            </form>
          </div>
        </section>
      </section>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default UpdatePostModal;
