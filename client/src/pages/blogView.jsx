import React, { useState, useEffect } from 'react';
import NavBarComp from '../components/NavBar';
import { Link, useParams,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CommentCard from '../components/commentsCard';
import { TbEditCircle } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getAPostData from '../services/index/postServices/getablogsdata';
import { useSelector } from 'react-redux';
import PageLoader from '../components/loaders/pageLoader';
import UpdatePostModal from '@/components/updatePostModal';
import { createPortal } from "react-dom";
import DeletePostModal from '@/components/deletePostModal';
import CommentSection from '@/components/commentSection';
import { Toaster, toast } from 'sonner';
// import submitComment from '../services/index/postServices/submitComment';

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
  const navigate =useNavigate()



const openEditModalHandler = () =>{
  setOpenPostModal(true)
  document.body.classList.add('overflow-hidden');
}

const openDeleteModalHandler = () =>{
  setOpenPostDeleteModal(true)
  document.body.classList.add('overflow-hidden');
}


  const blogQuery = useQuery({
    queryFn: () => getAPostData(blogId),
    queryKey: ['post', blogId]
  });

  
  useEffect(() => {
    if (blogQuery.data?.post) {
      setBlogData(blogQuery.data?.post);
      console.log(blogData)
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





  // useEffect(() => {
  //   if (!blogData) {
  //     const timer = setTimeout(() => {
  //       navigate('/notfound');
  //     }, 3000);

  //     return () => clearTimeout(timer); // Cleanup the timer on component unmount
  //   }
  // }, [blogData, navigate]);

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);
  if (blogQuery.isLoading ) return <PageLoader />;
  if (!blogData){
    return <div>No blog data available</div>;} 

 


  return (
    <>
     {openPostDeleteModal && createPortal(<DeletePostModal  setOpenPostDeleteModal={setOpenPostDeleteModal }  postId={blogId}/>,document.getElementById("portal")) }
    {openPostModal && createPortal(<UpdatePostModal   setOpenPostModal={setOpenPostModal} postId={blogId} />,document.getElementById("portal")) }
      <NavBarComp />
      <main className="mx-6">
        <div className="w-full">
          <p className="p-2 text-sm">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            <Link to="/blog">Blog</Link>&nbsp;/&nbsp;{blogData.title}
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
                src={blogData.postImage.postImgUrl}
                alt={blogData.postImage.postImgName}
              />
            </div>

            <div className="lg:w-[60vw] w-full flex flex-col justify-start">
              <div className="flex flex-col gap-4 my-4">
                <p className="flex gap-5 text-sm">
                  <span className="flex items-center bg-slate-200 w-fit px-4 py-[1.5px] rounded-lg font-bold capitalize text-slate-700">
                    <Link to="/author" className="flex items-center">{blogData.authorName}</Link>&nbsp;&#9679;&nbsp; {year}&nbsp; {month}&nbsp; {day}
                  </span>

                  
                    <span className="flex items-center justify-between">
    {userCheck && (
        <span onClick={openEditModalHandler} className="mx-1 text-xl transition-all duration-300 ease-linear cursor-pointer hover:scale-105">
            <TbEditCircle />
        </span>
    )}
    {(userCheck || user.userInfo.isAdmin || user.userInfo.superAdmin) && (
        <span onClick={openDeleteModalHandler} className="mx-1 text-xl text-red-500 transition-all duration-300 ease-linear cursor-pointer hover:scale-105 hover:text-red-600">
            <MdDelete />
        </span>
    )}
</span>

                </p>

                <div className="min-h-[30vh] lg:w-[85vw] flex flex-col gap-2">
                  <h1 className="pb-2 text-2xl font-semibold border-b">{blogData.title}</h1>
                  <p className="text-base text-justify text-pretty ">{blogData.content}</p>
                </div>
{/* comment section  */}
              <CommentSection postId={blogId} blogsData={blogData}/>
              </div>
            </div>
          </section>
        </section>
      </main>
<Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default Blog;
