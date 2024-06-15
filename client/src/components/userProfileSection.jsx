import React, { useState, useEffect } from 'react';
import { GiCrenelCrown, GiSpikedSnail, GiCrownedExplosion } from "react-icons/gi";
import { toast } from 'sonner';


const UserProfileSection = ({ userQuery }) => {
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
      try {
      const error = JSON.parse(userQuery.error.message);
      console.error(`Error ${error.errorCode}: ${error.errorMessage}`);
      toast.error(error.errorMessage)
      if (error.errorCode === 403) {
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
  }, [userQuery.data, userQuery.isError]);


  return (
    <>
      
    <section>
      
      <div className='relative mb-5'>
        <span className={`${roleBadge} scale-[0.7] w-fit px-3 rounded-md font-extrabold capitalize opacity-100 z-50 absolute right-1 top-2 flex items-center`}>
          <span className='text-3xl font-extrabold'>
            {userQuery.data?.user.superAdmin ? (
    <GiCrenelCrown className="pr-2" />
  ) : userQuery.data?.user.isAdmin ? (
    <GiSpikedSnail className="pr-2" />
  ) : <></>}
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
          <span className='flex gap-3 items-center '>
            <h1 className={`  rounded-md font-extrabold capitalize opacity-100 text-base   flex items-center`}>{userQuery.data?.user.username}</h1>
            {userQuery.data?.user.verified ? 
              <p className={`${roleBadge} w-fit p-1 rounded-full font-bold md:font-semibold capitalize scale-90`}>
                <GiCrownedExplosion />
              </p>
            :<></>}
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
         
        </div>
      </div>
    </section>
    </>
  );
};

export default UserProfileSection;
