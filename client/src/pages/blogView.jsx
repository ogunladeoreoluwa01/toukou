import React, { useState, useEffect } from 'react';
import NavBarComp from '../components/NavBar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TbEditCircle } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import getAPostData from '../services/index/postServices/getablogsdata';
import { useSelector } from 'react-redux';
import PageLoader from '../components/loaders/pageLoader';
import UpdatePostModal from '@/components/updatePostModal';
import { createPortal } from "react-dom";
import DeletePostModal from '@/components/deletePostModal';
import CommentSection from '@/components/commentSection';
import { Toaster, toast } from 'sonner';
import LikeDislikePost from '@/components/likeDislikePostButton';
import Footer from '@/components/footer';
import MakeaPost from '@/components/makeapost';

const Blog = () => {
  const user = useSelector(state => state.user);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [blogData, setBlogData] = useState();
  const [userCheck, setUserCheck] = useState(false);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [openPostDeleteModal, setOpenPostDeleteModal] = useState(false);
  const { blogId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const openEditModalHandler = () => {
    setOpenPostModal(true);
    document.body.classList.add('overflow-hidden');
  }

  const openDeleteModalHandler = () => {
    setOpenPostDeleteModal(true);
    document.body.classList.add('overflow-hidden');
  }

  const blogQuery = useQuery({
    queryFn: () => getAPostData(blogId),
    queryKey: ['post', blogId],
    onError: (error) => {
      try {
        const errormsg = JSON.parse(error.message);
        console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
        toast.error(errormsg.errorMessage);

        if (errormsg.errorCode === 404) {
          navigate("/error404");
        } else if (errormsg.errorCode === 403) {
          navigate("/error403");
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
    }
  });

  useEffect(() => {
    if (blogQuery?.data) {
      setBlogData(blogQuery?.data?.post);
      const dateObj = new Date(blogQuery?.data?.post.createdAt);
      const newYear = dateObj.getFullYear();
      const newMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(dateObj);
      const newDay = dateObj.getDate();
      setYear(newYear);
      setMonth(newMonth);

      // Add date acronyms (st, nd, rd, th) to the day
      let dayAcronym = "th";
      if (newDay === 1 || newDay === 21 || newDay === 31) {
        dayAcronym = "st";
      } else if (newDay === 2 || newDay === 22) {
        dayAcronym = "nd";
      } else if (newDay === 3 || newDay === 23) {
        dayAcronym = "rd";
      }
      setDay(`${newDay}${dayAcronym}`);

    }
  }, [blogQuery]);

  useEffect(() => {
    if (blogQuery?.data?.post?.authorId && user?.userInfo?._id) {
      if (user.userInfo._id === blogQuery.data.post.authorId) {
        setUserCheck(true);
      } else {
        setUserCheck(false);
      }
    } else {
      setUserCheck(false);
    }
  }, [blogQuery, user?.userInfo?._id]);

  if (blogQuery.isLoading) return <PageLoader />;
  if (blogQuery.isError) {
    try {
      const error = JSON.parse(blogQuery.error.message);
      console.error(`Error ${error.errorCode}: ${error.errorMessage}`);
      if (error.errorCode === 404) {
        navigate("/error-404");
      } else if (error.errorCode === 403) {
        navigate("/error-403");
      } else if (error.errorCode === 452) {
        navigate("/user-is-disabled");
      } else if (error.errorCode === 451) {
        navigate("/user-is-ban");
      } else if (error.errorCode === 500) {
        navigate("/oops");
      }
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
    }
  }

  return (
    <>
      {openPostDeleteModal && createPortal(<DeletePostModal setOpenPostDeleteModal={setOpenPostDeleteModal} postId={blogId} />, document.getElementById("portal"))}
      {openPostModal && createPortal(<UpdatePostModal setOpenPostModal={setOpenPostModal} postId={blogId} />, document.getElementById("portal"))}
      <NavBarComp />
      <main className="mx-6">
        <div className="w-full">
          <p className="p-2 text-sm">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            Blog&nbsp;/&nbsp;<Link to={`/user/${blogData?.authorId}`}>{blogData?.authorName}</Link> &nbsp;/&nbsp;{blogData?.title}
          </p>
        </div>

        <section className="flex flex-col items-start justify-between lg:flex-row">
          <section className="flex flex-col w-full">
            <div>
              <img
                loading="lazy"
                decoding="async"
                fetchpriority="high"
                className="h-[200px] lg:h-[350px] lg:w-[85vw] w-full object-cover rounded-lg"
                src={blogData?.postImage.postImgUrl}
                alt={blogData?.postImage.postImgName}
              />
            </div>

            <div className="lg:w-[60vw] w-full flex flex-col justify-start">
              <div className="flex flex-col gap-4 my-4">
                <p className="flex gap-5 text-sm">
                  <span className="flex items-center max-w-[70%] truncate bg-slate-200 w-fit px-4 py-[1.5px] rounded-lg font-bold capitalize text-slate-700">
                    <Link to={`/user/${blogData?.authorId}`} className="flex items-center">{blogData?.authorName}</Link>&nbsp;&#9679;&nbsp;{year}&nbsp;{month}&nbsp;{day}
                  </span>
                  <span className="flex items-center justify-between">
                    {userCheck && (
                      <span onClick={openEditModalHandler} className="mx-1 text-xl transition-all duration-300 ease-linear cursor-pointer hover:scale-105">
                        <TbEditCircle />
                      </span>
                    )}
                    {(userCheck || user?.userInfo?.isAdmin || user?.userInfo?.superAdmin) && (
                      <span onClick={openDeleteModalHandler} className="mx-1 text-xl text-red-500 transition-all duration-300 ease-linear cursor-pointer hover:scale-105 hover:text-red-600">
                        <MdDelete />
                      </span>
                    )}
                  </span>
                </p>

                <div className="min-h-[30vh] lg:w-[85vw] flex flex-col gap-2  border-b">
                  <h1 className="pb-2 text-2xl font-semibold border-b">{blogData?.title}</h1>
                  <p className="text-base text-pretty">{blogData?.content}</p>
                </div>
                {!user ? <div className='my-1 border-b'>
                  <LikeDislikePost postId={blogId} blogsData={blogData} />
                </div>:<></>}
                

                {/* comment section  */}
                <CommentSection postId={blogId} blogsData={blogData} />
              </div>
            </div>
          </section>
        </section>
        <MakeaPost />
      </main>
      <Footer />
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default Blog;
