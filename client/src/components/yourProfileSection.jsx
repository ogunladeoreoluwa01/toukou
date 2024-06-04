import React, { useState, useEffect } from 'react';
import { GiCrenelCrown, GiSpikedSnail, GiCrownedExplosion } from "react-icons/gi";
import { TbEditCircle } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { toast } from 'sonner';
import UpdateUserModal from './updateUserModal';
import DeleteUserModal from './DeleteUser';
import { createPortal } from 'react-dom';

const YourProfileSection = ({ userQuery }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [authorRole, setAuthorRole] = useState("User");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [roleBadge, setRoleBadge] = useState("bg-slate-400 text-slate-700");

  useEffect(() => {
    if (userQuery.data) {
      const date = new Date(userQuery.data.user.createdAt);
      const newYear = date.getFullYear();
      const newMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
      const newDay = date.getDate();
      
      // Add date acronyms (st, nd, rd, th) to the day
      let dayAcronym = "th";
      if (newDay === 1 || newDay === 21 || newDay === 31) dayAcronym = "st";
      else if (newDay === 2 || newDay === 22) dayAcronym = "nd";
      else if (newDay === 3 || newDay === 23) dayAcronym = "rd";

      setYear(newYear);
      setMonth(newMonth);
      setDay(`${newDay}${dayAcronym}`);

      // Set role and badge
      if (userQuery.data.user.superAdmin) {
        setAuthorRole("Lord");
        setRoleBadge("bg-emerald-300 text-emerald-700");
      } else if (userQuery.data.user.isAdmin) {
        setAuthorRole("Admin");
        setRoleBadge("bg-amber-300 text-amber-700");
      }
    }

    if (userQuery.isError) {
      toast.error("Error getting user data");
    }
  }, [userQuery.data, userQuery.isError]);

  const openEditModalHandler = () =>{
  setOpenEditModal(true)
  document.body.classList.add('overflow-hidden');
}

const openDeleteModalHandler = () =>{
  setOpenDeleteModal(true)
  document.body.classList.add('overflow-hidden');
}

  return (
    <>
    {openDeleteModal && createPortal(<DeleteUserModal  setOpenDeleteModal={setOpenDeleteModal}  />,document.getElementById("portal")) }
    {openEditModal && createPortal(<UpdateUserModal  setOpenEditModal={setOpenEditModal}  />,document.getElementById("portal")) }
      
    <section>
      
      <div className='relative mb-5'>
        <span className={`${roleBadge} scale-[0.7] w-fit px-3 rounded-md font-extrabold capitalize opacity-100 z-50 absolute right-1 top-2 flex items-center`}>
          <span className='text-3xl font-extrabold'>
            {userQuery.data?.user.isAdmin && <GiSpikedSnail className="pr-2" />}
            {userQuery.data?.user.superAdmin && <GiCrenelCrown className="pr-2" />}
          </span>
          <span>{authorRole}</span>
        </span>
        <div className='h-[125px] md:h-[180px] lg:h-[250px] w-full object-cover rounded-lg bg-white'>
          <img
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            className="h-[125px] md:h-[180px] lg:h-[250px] w-full object-cover rounded-lg opacity-80"
            src={userQuery.data.user.bannerImage.bannerImgUrl}
            alt={userQuery.data.user.bannerImage.bannerImgName}
            id={userQuery.data.user.bannerImage.bannerImgId}
          />
        </div>
        <div className='h-[100px] w-[100px] md:h-[160px] md:w-[160px] absolute -bottom-10 md:-bottom-20 left-2 md:left-5 rounded-full'>
          <img
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            className="h-[100px] w-[100px] md:h-[160px] md:w-[160px] rounded-full object-cover"
            src={userQuery.data.user.profileImage.profileImgUrl}
            alt={userQuery.data.user.profileImage.profileImgName}
            id={userQuery.data.user.profileImage.profileImgId}
          />
        </div>
      </div>
      <div className='flex flex-col gap-1 mt-12 md:mt-24 md:pl-7 pb-2 md:pb-5 border-b'>
        <div className='flex justify-between items-center'>
          <span className='flex gap-3'>
            <h1 className='text-base font-semibold'>{userQuery.data?.user.username}</h1>
            {userQuery.data?.user.verified && (
              <p className={`${roleBadge} w-fit p-1 rounded-full font-bold md:font-semibold capitalize scale-90`}>
                <GiCrownedExplosion />
              </p>
            )}
          </span>
          <span onClick={openEditModalHandler} className='scale-[0.7] cursor-pointer text-2xl hover:scale-[0.75] mx-1 transition-all duration-300 ease-linear flex items-center gap-2 justify-center px-2 py-[0.5px] rounded-md font-bold dark:bg-slate-100 dark:hover:bg-slate-200 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50'>
            <TbEditCircle />
            <span className="text-lg">Edit</span>
          </span>
        </div>
        <h1 className='text-sm text-slate-400 dark:text-slate-500 font-semibold'>{userQuery.data?.user.email}</h1>
        <p className='my-2'>
          <span>bio</span><br />
          <span className='text-slate-400 dark:text-slate-500'>{userQuery.data?.user.bio}</span>
        </p>
        <div className='flex gap-10 my-2 justify-between items-center mb-5'>
          <p className='bg-slate-400 w-fit px-3 rounded-md font-bold md:font-semibold capitalize text-slate-700 scale-90'>
            joined {year} {month} {day}
          </p>
          <span className='flex'>
            <span onClick={openDeleteModalHandler} className='cursor-pointer text-3xl hover:scale-90 scale-[0.8] text-red-500 hover:text-red-600 mx-1 transition-all duration-300 ease-linear'>
              <MdDelete />
            </span>
          </span>
        </div>
      </div>
    </section>
    </>
  );
};

export default YourProfileSection;
