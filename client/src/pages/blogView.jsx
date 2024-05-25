import React, { useState, useEffect } from 'react';
import NavBarComp from "../components/NavBar";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import CommentCard from '../components/commentsCard';
import { FcLikePlaceholder } from "react-icons/fc";
import { FcDislike } from "react-icons/fc";
import { TbEditCircle } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
const Blogs = () => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [noOfComments, setNoOfComments] = useState(0);

  const { blogId } = useParams();
  const [blogData, setBlogData] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: '',
    }
  });

  // Dummy data simulating the API response
  const dummyData = {
    1: {
      authorName: "John Doe",
      date: "2024-05-23",
      title: "Sample Blog Post",
      content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas, impedit fuga deserunt vel labore, officiis suscipit mollitia laborum molestias est in unde repudiandae ducimus voluptatem? Quibusdam sapiente voluptate quas placeat.",
      imageSrc: "https://i.pinimg.com/originals/b6/d8/ab/b6d8ab853ebc2bbedab990364332be8b.jpg",
      comments: [
        { id: 1, text: "Great post!", author: "Alice" },
        { id: 2, text: "Thanks for sharing.", author: "Bob" },
        { id: 3, text: "Very informative.", author: "Charlie" },
        { id: 4, text: "I learned a lot.", author: "Dave" },
        { id: 5, text: "Interesting read.", author: "Eve" }
      ]
    },
    2: {
      authorName: "Jane Smith",
      date: "2024-05-24",
      title: "Another Blog Post",
      content: "This is another example of a blog post. It contains different content and a different author.",
      imageSrc: "https://via.placeholder.com/600x300",
      comments: [
        { id: 6, text: "Very informative.", author: "Charlie" },
        { id: 7, text: "I learned a lot.", author: "Dave" },
        { id: 8, text: "Great insights.", author: "Alice" }
      ]
    }
  };

  useEffect(() => {
    // Simulating an API call with dummy data
    setBlogData(dummyData[blogId]);
  }, [blogId]);

  useEffect(() => {
    if (blogData) {
      setNoOfComments(blogData.comments.length);
    }
  }, [blogData]);

  const onSubmit = (data) => {
    console.log(data);
    // Assuming the comment is added successfully
    const newComment = { id: blogData.comments.length + 1, text: data.comment, author: "New User" };
    setBlogData(prevState => ({
      ...prevState,
      comments: [...prevState.comments, newComment]
    }));
    setNoOfComments(noOfComments + 1);
    // Reset the form after submission
    reset();
  };

  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };

  const commentsToDisplay = showComments ? blogData?.comments : blogData?.comments?.slice(0, 3);

  if (!blogData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBarComp />
      <main className="mx-6">
        <div className="">
          <p className="text-sm p-2">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            <Link to="/blog">Blog</Link>&nbsp;/&nbsp;{blogData.title}
          </p>
        </div>

        <section className="flex flex-col lg:flex-row justify-between items-start">
          <section className="flex flex-col">
            <div>
              <img
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="h-[200px] lg:h-[350px] lg:w-[60vw] w-full object-cover rounded-lg"
                src={blogData.imageSrc}
                alt={blogData.title}
              />
            </div>

            <div className="lg:w-[60vw] w-full flex flex-col justify-start">
              <div className="flex flex-col gap-4 my-4">
                <p className='text-sm flex gap-5'>
                  <span className='flex items-center bg-slate-200 w-fit px-4 py-[1.5px] rounded-lg font-bold capitalize text-slate-700'>
                    <Link to="/author">{blogData.authorName}</Link>&nbsp;  &#9679;&nbsp; {blogData.date}
                  </span>

                  <span className='flex'>
                  <span className='text-xl hover:scale-105 mx-1 transition-all duration-300 ease-linear' ><TbEditCircle /></span>
                  <span className='text-xl hover:scale-105 text-red-500 hover:text-red-600 mx-1 transition-all duration-300 ease-linear' ><MdDelete /></span>
                  </span>
                
                  
                </p>

                <div className="min-h-[30vh]">
                  <h1 className="text-2xl font-semibold">{blogData.title}</h1>
                  <p className="text-base text-pretty">{blogData.content}</p>
                  <div className="flex gap-4 mt-5">
                  <button onClick={() => setLikes(likes + 1)} className="px-4 py-2   rounded flex gap-1 items-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-linear hover:bg-slate-300 hover:bg-slate-600 hover:font-bold"><span><FcLikePlaceholder /> </span><span className='text-xs'>({likes})</span></button>
                  <button onClick={() => setDislikes(dislikes + 1)} className="px-4 py-2   rounded flex gap-1 items-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-linear hover:bg-slate-300 hover:bg-slate-600 hover:font-bold"><span><FcDislike /> </span><span className='text-xs'>({dislikes})</span></button>
                </div>
                </div>

                

                <form onSubmit={handleSubmit(onSubmit)} className="relative mt-4">
                  <textarea
                    name="comment"
                    placeholder="Your comment"
                    {...register('comment', { required: true })}
                    className="w-full h-48 placeholder:text-sm rounded-lg  placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-[0.35rem] focus:outline-0 transition-all duration-300 ease-linear resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="absolute bottom-[0.45rem] right-0 py-1 px-3 rounded-lg font-semibold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase"
                  >
                    Comment
                  </button>
                </form>

                {/* Comments Section */}
                <section className='lg:w-[60vw] w-full flex flex-col justify-start gap-4 mt-4'>
                  <div className='flex justify-between'>
                    <h1 className='text-xl font-bold'>Comments ({noOfComments})</h1>
                    {noOfComments > 3?<button onClick={toggleComments} className="  px-2 py-[0.5px] hover:-translate-y-1 duration-300 transition-all ease-linear font-bold text-sm bg-slate-300 text-slate-600 rounded-lg">
                      {showComments ? 'Hide' : 'Show'}
                    </button>:""}
                  </div>

                  {commentsToDisplay?.map(comment => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </section>
              </div>
            </div>
          </section>

          <div className="lg:w-[25vw] w-full  min-h-[200px] flex flex-col p-2 lg:p-4 gap-3 bg-slate-200 dark:bg-slate-800 rounded-lg">
<h1 className='text-sm capitalize font-semibold'> Articels by {blogData.authorName}</h1>

<Link to="" className='flex gap-3 items-center bg-slate-300  dark:bg-slate-600 p-2 rounded-lg hover:-translate-y-1 transition-all duration-300 ease-linear '>
<img src="https://i.pinimg.com/originals/b6/d8/ab/b6d8ab853ebc2bbedab990364332be8b.jpg" alt="" className=' w-20 h-20 rounded-lg scale-90 lg:scale-100' />
<div className='flex flex-col justify-between h-20 py-2 scale-90 lg:scale-100'>
<h1 className='text-base font-semibold line-clamp-2 lg:line-clamp-3'>Other Articels by {blogData.authorName}</h1>
<p className='text-sm font-semibold text-slate-500 dark:text-slate-300'>time</p>
</div>
</Link>

          </div>
        </section>
      </main>
    </>
  );
};

export default Blogs;
