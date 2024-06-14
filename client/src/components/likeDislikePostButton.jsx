import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient} from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import likePost from '../services/index/postServices/likeAPost';
import dislikePost from '../services/index/postServices/dislikeAPost';

const LikeDislikePost = ({ postId, blogsData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const [formattedLikes,setFormattedLikes] =useState(0)
const queryClient = useQueryClient()
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (blogsData?.likes.includes(user.userInfo._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    if (blogsData?.dislikes.includes(user.userInfo._id)) {
      setIsDisliked(true);
    } else {
      setIsDisliked(false);
    }
  }, [blogsData, user.userInfo._id]);

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      setIsSubmitting(false);
       queryClient.invalidateQueries(["post"])
      if(isLiked){
         setLikeAnimation(true);
 setTimeout(() => setLikeAnimation(false), 600);
      }
     
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: dislikePost,
    onSuccess: () => {
      setIsSubmitting(false);
        queryClient.invalidateQueries(["post"])
      if(isDisliked){
setDislikeAnimation(true);
      setTimeout(() => setDislikeAnimation(false), 600);
      }
      
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const handleMutationError = (error) => {
    try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      toast.error(errormsg.errorMessage);

      if (errormsg.errorCode === 403) {
        navigate("/error-403");
      } else if (errormsg.errorCode === 404) {
        navigate("/error-404");
      } else if (errormsg.errorCode === 452) {
        navigate("/user-is-disabled");
      } else if (errormsg.errorCode === 451) {
        navigate("/user-is-ban");
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (isLiked) {
      setIsLiked(false);
    } else {
      if (isDisliked) setIsDisliked(false);
      setIsLiked(true);
    }
    likeMutation.mutate({ postId, token: user.userInfo.token });
  };

  const handleDislike = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isDisliked) {
      setIsDisliked(false);
    } else {
      if (isLiked) setIsLiked(false);
      setIsDisliked(true);
    }
    dislikeMutation.mutate({ postId, token: user.userInfo.token });
  };

useEffect(() => {
    if (blogsData?.likes.length >= 1000000) {
      setFormattedLikes((blogsData?.likes.length / 1000000).toFixed(1).replace(/\.0$/, '') + 'm')
    } else if (blogsData?.likes.length >= 10000) {
        setFormattedLikes((blogsData?.likes.length / 1000).toFixed(1).replace(/\.0$/, '') + 'k')
    } else {
      setFormattedLikes(blogsData?.likes.length)
    }
 
}, [blogsData,isLiked,blogsData?.likes.length]);
 


  return (
    <>
    <section className='flex flex-col gap-1 justify-start'>
      <div className="flex gap-2 items-center py-1 px-4 bg-slate-600 w-fit rounded-xl ">
     <span className=' border-r pr-3'>

       <button
        onClick={handleLike}
        className={`flex gap-1 items-center text-xl font-semibold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${likeAnimation ? 'fadeScaleColor' : ''}`}
        disabled={isSubmitting}
      >
        {isLiked ? <AiFillLike /> : <AiOutlineLike />}
      </button>
     </span>
       
    
      
      
      <button
        onClick={handleDislike}
        className={`flex gap-1 items-center text-xl font-semibold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${dislikeAnimation ? 'bounce' : ''}`}
        disabled={isSubmitting}
      >
        {isDisliked ? <AiFillDislike /> : <AiOutlineDislike />}
      </button>
    </div>
     
     <span className=' pl-3 font-light text-sm'>{formattedLikes}&nbsp;{blogsData?.likes.length ===1 ?"like":"likes"}</span>
    </section>
    
    </>
    
    
  );
};

export default LikeDislikePost;
