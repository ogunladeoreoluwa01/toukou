import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CommentCard from '../components/commentsCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import createComment from '@/services/index/commentServices/createComment';
import { toast } from 'sonner';

const CommentSection = ({ postId, blogsData }) => {
  const [showComments, setShowComments] = useState(false);
  const [blogData, setBlogData] = useState(null); 
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setBlogData(blogsData);
  }, [blogsData]);

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      toast.success(`Comment added successfully`);
      queryClient.invalidateQueries(['post']);
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

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: '',
    },
  });

  const submitHandler = ({ content }) => {
    mutation.mutate({ content, postId, token: user.userInfo.token });
    reset();
  };

  const toggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  const commentsToDisplay = showComments ? blogData?.comments : blogData?.comments.slice(0, 3);

  return (
    <section>
      <form onSubmit={handleSubmit(submitHandler)} className="relative mt-4 w-[100%]">
        <textarea
          name="comment"
          placeholder="Your comment"
          {...register('content', { required: true })}
          className="w-full h-48 placeholder:text-sm rounded-lg placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-[0.35rem] focus:outline-0 transition-all duration-300 ease-linear resize-none"
        ></textarea>
        <button
          type="submit"
          className="absolute bottom-[0.45rem] right-0 py-1 px-3 rounded-lg font-semibold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase"
        >
          Comment
        </button>
      </form>

      {blogData && (
        <section className="lg:w-[60vw] w-full flex flex-col justify-start gap-4 mt-4 min-h-[200px]">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">Comments ({blogData?.comments.length})</h1>
            {blogData?.comments.length > 3 && (
              <button
                onClick={toggleComments}
                className="px-2 py-[0.5px] hover:-translate-y-1 duration-300 transition-all ease-linear font-bold text-sm bg-slate-300 text-slate-600 rounded-lg"
              >
                {showComments ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {commentsToDisplay.map((comment) => (
            <CommentCard key={comment._id} comment={comment} />
          ))}
        </section>
      )}
    </section>
  );
};

export default CommentSection;
