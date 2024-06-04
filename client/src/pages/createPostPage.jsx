import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import createPost from "../services/index/postServices/createPost"; 
import { useState, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import NavBarComp from "../components/NavBar";
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const CreatePost = () => {
 
   
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [postId, setPostId] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            content: "",
        },
        mode: "onChange",
    });

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: (postData) => {
            toast.success(`Post created successfully`);
            setPostId(postData);
            navigate(`/addpostImage/${postData.post._id}`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const submitHandler = (data) => {
        const { title, content } = data;
        const postData = {
            title,
            content,
            token: user.userInfo.token,
        };
        mutation.mutate(postData);
    };


    useEffect(() => {
        if (!user.userInfo) {
            navigate("/login");
        }
    }, [user, navigate]);
 

    return (
        <>
            <main className="h-screen">
                <NavBarComp/>
                <section className="relative flex items-center justify-center h-full">
                    <img
                        loading="lazy"
                        decoding="async"
                        fetchpriority="high"
                        src="https://i.pinimg.com/originals/f1/2a/ad/f12aadea1709f04579d023beed5348b9.gif"
                        className="w-full h-full object-cover object-center opacity-40"
                    />
                    <section className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden">
                        <section className="flex flex-col gap-5 mx-2 w-full md:w-fit rounded-md bg-slate-300/80 dark:bg-slate-800/60 max-h-fit">
                            <form onSubmit={handleSubmit(submitHandler)} className="md:p-3 p-2 md:w-[1000px] w-full rounded-lg">
                                <section className="flex justify-between mb-2 items-center w-full">
                                    <span className="flex gap-4 items-center">
                                        <h1 className="font-bold text-lg md:text-2xl capitalize">Create a Post</h1>
                                    </span>
                                </section>
                                <section>
                                    <div className="flex flex-col gap-2 w-full mb-2">
                                        <label htmlFor="title" className="capitalize">Title</label>
                                        <input
                                            type="text"
                                            {...register("title", { required: "Title is required" })}
                                            placeholder="Enter post title"
                                            className={`mb-2 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                                        />
                                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <label htmlFor="content" className="text-base md:text-lg capitalize">Content</label>
                                        <textarea
                                            {...register("content", { required: "Content is required" })}
                                            placeholder="Enter post content"
                                            className={`mb-2 resize-none h-52 md:h-[50vh] border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                                        ></textarea>
                                        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                                    </div>
                                </section>
                                { mutation.isLoading ? <Button disabled className="w-full px-6 py-2 font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button> :  <Button type="submit" disabled={ mutation.isLoading} className="disabled:opacity-70 px-6 py-2 w-full fontbold   transition-all duration-300   uppercase">
                Create Post
              </Button>}
                            </form>
                        </section>
                    </section>
                </section>
            </main>

            <Toaster richColors position="top-right" expand={true} closeButton />
        </>
    );
};

export default CreatePost;
