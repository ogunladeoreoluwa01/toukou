import React, { useState, useEffect } from 'react';
import NavBarComp from '../components/NavBar';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CommentCard from '../components/commentsCard';
import { TbEditCircle } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getAPostData from '../services/index/postServices/getablogsdata';
import getPostData from '../services/index/postServices/getPostData';
import { useSelector } from 'react-redux';
import PageLoader from '../components/loaders/pageLoader';
// import submitComment from '../services/index/postServices/submitComment';

const Blog = () => {
  const user = useSelector(state => state.user);
  const [showComments, setShowComments] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [blogData, setBlogData] = useState();
  const [userCheck, setUserCheck] = useState(false);
  const { blogId } = useParams();
  const queryClient = useQueryClient();

  const blogQuery = useQuery({
    queryFn: () => getAPostData(blogId),
    queryKey: ['blog', blogId]
  });

  const postQuery = useQuery({
    queryFn: () => getPostData(blogQuery.data?.post.authorId),
    queryKey: ['post', blogQuery.data?.post.authorId],
    enabled: !!blogQuery.data?.post.authorId // Only fetch when authorId is available
  });

  useEffect(() => {
    if (blogQuery.data?.post) {
      setBlogData(blogQuery.data?.post);
      const date = new Date(blogQuery.data.post.createdAt);
      setYear(date.getFullYear());
      setMonth(new Intl.DateTimeFormat('en', { month: 'long' }).format(date));
      setDay(date.getDate().toString());
    }
  }, [blogQuery]);

  useEffect(() => {
    if (user.userInfo._id === blogQuery.data?.post.authorId) {
      setUserCheck(true);
    }
  }, [blogQuery, user.userInfo._id]);

  // const mutation = useMutation(submitComment, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['post', blogId]);
  //   }
  // });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: '',
    }
  });

  const onSubmit = (data) => {
    mutation.mutate({ data, blogId, token: user.token });
    reset();
  };

  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };

  if (blogQuery.isLoading || postQuery.isLoading) return <PageLoader />;
  if (!blogData) return <div>No blog data available</div>;

  const commentsToDisplay = showComments ? blogData.comments : blogData.comments.slice(0, 3);

  // Get the 5 most recent posts by the author
  const recentPosts = postQuery.data?.posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <NavBarComp />
      <main className="mx-6">
        <div className="w-full">
          <p className="text-sm p-2">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            <Link to="/blog">Blog</Link>&nbsp;/&nbsp;{blogData.title}
          </p>
        </div>

        <section className="flex flex-col lg:flex-row justify-between items-start">
          <section className="flex flex-col w-full">
            <div>
              <img
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="h-[200px] lg:h-[350px] lg:w-[60vw] w-full object-cover rounded-lg"
                src={blogData.postImage.postImgUrl}
                alt={blogData.postImage.postImgName}
              />
            </div>

            <div className="lg:w-[60vw] w-full flex flex-col justify-start">
              <div className="flex flex-col gap-4 my-4">
                <p className="text-sm flex gap-5">
                  <span className="flex items-center bg-slate-200 w-fit px-4 py-[1.5px] rounded-lg font-bold capitalize text-slate-700">
                    <Link to="/author" className="flex items-center">{blogData.authorName}</Link>&nbsp;&#9679;&nbsp; {year}&nbsp; {month}&nbsp; {day}
                  </span>

                  {userCheck && (
                    <span className="flex">
                      <span className="text-xl hover:scale-105 mx-1 transition-all duration-300 ease-linear"><TbEditCircle /></span>
                      <span className="text-xl hover:scale-105 text-red-500 hover:text-red-600 mx-1 transition-all duration-300 ease-linear"><MdDelete /></span>
                    </span>
                  )}
                </p>

                <div className="min-h-[30vh]">
                  <h1 className="text-2xl font-semibold">{blogData.title}</h1>
                  <p className="text-base">{blogData.content}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="relative mt-4 w-[100%]">
                  <textarea
                    name="comment"
                    placeholder="Your comment"
                    {...register('comment', { required: true })}
                    className="w-full h-48 placeholder:text-sm rounded-lg placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-[0.35rem] focus:outline-0 transition-all duration-300 ease-linear resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="absolute bottom-[0.45rem] right-0 py-1 px-3 rounded-lg font-semibold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase"
                  >
                    Comment
                  </button>
                </form>

                <section className="lg:w-[60vw] w-full flex flex-col justify-start gap-4 mt-4">
                  <div className="flex justify-between">
                    <h1 className="text-xl font-bold">Comments ({blogData.comments.length})</h1>
                    {blogData.comments.length > 3 && (
                      <button onClick={toggleComments} className="px-2 py-[0.5px] hover:-translate-y-1 duration-300 transition-all ease-linear font-bold text-sm bg-slate-300 text-slate-600 rounded-lg">
                        {showComments ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>

                  {commentsToDisplay.map(comment => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </section>
              </div>
            </div>
          </section>

          <aside className="lg:w-[25vw] w-full min-h-[200px] flex flex-col p-2 lg:p-4 gap-3 bg-slate-200 dark:bg-slate-800 rounded-lg">
            <h1 className="text-sm capitalize font-semibold">Recent Articles by {blogData.authorName}</h1>
            {recentPosts.map(post => (
              <Link key={post.id} to={`/post/${post.id}`} className="flex gap-3 items-center bg-slate-300 dark:bg-slate-600 p-2 rounded-lg hover:-translate-y-1 transition-all duration-300 ease-linear">
                <img src={post.thumbnailUrl} alt={post.title} className="w-20 h-20 rounded-lg scale-90 lg:scale-100" />
                <div className="flex flex-col justify-between h-20 py-2 scale-90 lg:scale-100">
                  <h1 className="text-base font-semibold line-clamp-2 lg:line-clamp-3">{post.title}</h1>
                </div>
              </Link>
            ))}
          </aside>
        </section>
      </main>
    </>
  );
};

export default Blog;
