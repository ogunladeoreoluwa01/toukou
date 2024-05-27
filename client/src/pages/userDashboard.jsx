import React, { useState, useEffect } from 'react';
import NavBarComp from "../components/NavBar";
import { Link,useNavigate } from "react-router-dom";
import PostCard from '../components/normalPost';
import { TbEditCircle } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { GiCrownedExplosion, GiCrenelCrown, GiSpikedSnail } from "react-icons/gi";
import { useQuery } from '@tanstack/react-query';
import getPostData from "../services/index/getPostData";
import { Toaster, toast } from 'sonner';
import NormalPostLoader from '../components/loaders/normalPostLoader';

const UserProfile = () => {
  const user = useSelector(state => state.user);
  const navigate =useNavigate()
  const [authorRole, setAuthorRole] = useState("user");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [postData, setPostData] = useState([]);
  const [roleBadge, setRoleBadge] = useState("bg-slate-400 text-slate-700");

  const { isLoading, isError, data } = useQuery({
    queryFn: () => getPostData(user.userInfo.token, user.userInfo._id),
    queryKey: ["post"]
  });

  useEffect(() => {
    setPostData(data)
    console.log(postData)
  }, [data]);

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate,user]);

  useEffect(() => {
    if (isError) {
      toast.error("Error getting posts");
    }
  }, [isError]);

  useEffect(() => {
    const date = new Date(user.userInfo.createdAt);
    const newYear = date.getFullYear();
    const newMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
    const newDay = date.getDate();
    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay.toString());
  }, [user]);

  useEffect(() => {
    if (user.userInfo.superAdmin) {
      setAuthorRole("Lord");
      setRoleBadge("bg-emerald-300 text-emerald-700");
    } else if (user.userInfo.isAdmin) {
      setAuthorRole("admin");
      setRoleBadge("bg-amber-300 text-amber-700");
    } else {
      setAuthorRole("user");
    }
  }, [user]);

  return (
    <>
      <NavBarComp />
      <main className=''>
        <section className=''>
          <div className="">
            <p className="text-sm p-2">
              <Link to="/">Home</Link>&nbsp;/&nbsp;{user.userInfo.username}
            </p>
          </div>
          <div className='relative mb-5'>
            <span className={`${roleBadge} w-fit px-3 rounded-md font-extrabold  capitalize opacity-100 z-50 scale-90 absolute right-4 top-4 flex items-center`}>
              
              <span className='text-3xl font-extrabold'>
              {user.userInfo.isAdmin && <GiSpikedSnail className="pr-2" />}
              {user.userInfo.superAdmin && <GiCrenelCrown className="pr-2" />}
              </span>
              <span>
              {authorRole}
              </span>
              
            </span>
            <div className='h-[125px] md:h-[180px] lg:h-[250px] w-full object-cover rounded-lg bg-white'>
              <img
                loading="lazy"
                decoding="async"
                fetchpriority="high"
                className="h-[125px] md:h-[180px] lg:h-[250px] w-full object-cover rounded-lg opacity-80"
                src={user.userInfo.bannerImage.bannerImgUrl}
                alt={user.userInfo.bannerImage.bannerImgName}
                id={user.userInfo.bannerImage.bannerImgId}
              />
            </div>
            <div className='h-[100px] w-[100px] md:h-[160px] md:w-[160px] absolute -bottom-10 md:-bottom-20 left-2 md:left-5 rounded-full'>
              <img
                loading="lazy"
                decoding="async"
                fetchpriority="high"
                className="h-[100px] w-[100px] md:h-[160px] md:w-[160px] rounded-full object-cover"
                src={user.userInfo.profileImage.profileImgUrl}
                alt={user.userInfo.profileImage.profileImgName}
                id={user.userInfo.profileImage.profileImgId}
              />
            </div>
          </div>
        </section>
        <div className='flex flex-col gap-1 mt-12 md:mt-24 md:pl-7 border-b'>
          <span className='flex gap-3'>
            <h1 className='text-base font-semibold'>{user.userInfo.username}</h1>
            {user.userInfo.verified && <p className={`${roleBadge} w-fit p-1 rounded-full font-bold md:font-semibold capitalize scale-90 `}><GiCrownedExplosion /></p>}
          </span>
          <h1 className='text-sm text-slate-400 dark:text-slate-500 font-semibold'>{user.userInfo.email}</h1>
          <p className='my-2'>
            <span>bio</span><br />
            <span className='text-slate-400 dark:text-slate-500'>{user.userInfo.bio}</span>
          </p>
          <div className='flex gap-10 my-2 justify-between items-center mb-5'>
            <p className='bg-slate-400 w-fit px-3 rounded-md font-bold md:font-semibold capitalize text-slate-700 scale-90'>
              joined&nbsp;{year}&nbsp;{month}&nbsp;{day}
            </p>
            <span className='flex'>
              <span className='text-xl hover:scale-105 mx-1 transition-all duration-300 ease-linear'><TbEditCircle /></span>
              <span className='text-xl hover:scale-105 text-red-500 hover:text-red-600 mx-1 transition-all duration-300 ease-linear'><MdDelete /></span>
            </span>
          </div>
        </div>
        <section className='flex flex-col gap-3 my-4'>
          <h1 className='text-xl font-bold  border-b-2 py-2 md:py-4'>Your Posts</h1>
          <div className='flex flex-wrap justify-start items-center gap-4 md:gap-2'>
            {isLoading ? (
              Array(10).fill(0).map((_, index) => <NormalPostLoader key={index} />)
            ) : isError ? (
              <h1 className='text-center text-xl font-bold md:mx-6'>Error loading posts</h1>
            ) : data && data.posts.length > 0 ? (
              data.posts.map((posts, index) => <PostCard key={index} post={posts} />)
            ) : (
              <h1 className='text-center text-xl font-bold md:mx-6'>No posts here</h1>
            )}
          </div>
        </section>
        <Toaster richColors position="top-right" expand={false} closeButton />
      </main>
    </>
  );
}

export default UserProfile;
