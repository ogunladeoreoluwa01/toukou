import React, { useState, useEffect } from 'react';
import NavBarComp from "../components/NavBar";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import PostCard from '../components/normalPost';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbEditCircle } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
const UserProfilePage = () => {
    return ( <>
    <NavBarComp/>
    <main className=''>
        <section className=''>
        <div className="">
          <p className="text-sm p-2">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            Blogger&nbsp;/&nbsp;bloggers Name
          </p>
        </div>
        <div className='relative mb-5'>
        <Link to="" className="bg-slate-400 w-fit px-3 rounded-md font-bold md:font-semibold capitalize text-slate-700 scale-90 absolute right-4 top-4">
                        authorRole
                    </Link>
              <img
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="h-[125px] md:h-[180px] lg:h-[250px]  w-full object-cover rounded-lg"
                src="https://i.pinimg.com/originals/3e/39/ea/3e39ea31fe681926c8c9a5c6afba4791.jpg"
                alt=""
              />
              <div className=' bg-black absolute -bottom-10 md:-bottom-20 left-2 md:left-5  rounded-full '>
              <img
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="h-[100px] w-[100px] md:h-[160px]  md:w-[160px] rounded-full object-cover   "
                src="https://i.pinimg.com/originals/b6/d8/ab/b6d8ab853ebc2bbedab990364332be8b.jpg"
                alt=""
              />
              </div>
               
            </div> 
        </section>
        <div className='flex flex-col gap-1 mt-12 md:mt-24 md:ml-7 border-b '> 
        <span className='flex gap-3'>
        <h1 className='text-base font-semibold'>authorName</h1>
        <p className='bg-slate-600 w-fit p-1 rounded-full font-bold md:font-semibold capitalize text-slate-50 scale-90 '> <RiVerifiedBadgeFill /></p>
        </span>

<h1 className='text-sm text-slate-400 dark:text-slate-500 font-semibold'>author@gmail.com</h1>
 <p className='my-2'>  <span className=''> bio</span><br/> <span className='text-slate-400 dark:text-slate-500 '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ratione assumenda accusamus id, consectetur soluta quo error harum neque sequi praesentium laudantium vero obcaecati rerum fugiat numquam placeat mollitia accusantium!    </span>
 </p>
 <div className='flex gap-10 my-2 justify-between items-center mb-5'>
 <p className='bg-slate-400 w-fit px-3 rounded-md font-bold md:font-semibold capitalize text-slate-700 scale-90 '> joined july 2019</p>

 <span className='flex'>
                  <span className='text-xl hover:scale-105 mx-1 transition-all duration-300 ease-linear' ><TbEditCircle /></span>
                  <span className='text-xl hover:scale-105 text-red-500 hover:text-red-600 mx-1 transition-all duration-300 ease-linear' ><MdDelete /></span>
                  </span>
 </div>
   
    </div> 

<section className='flex flex-col gap-3 my-4 '> 
<h1 className='text-xl font-bold md:mx-6'>Your Posts (0)</h1>
<div className='flex flex-wrap  justify-start items-center gap-4 md:gap-2'>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
<PostCard/>
</div>

</section>



    </main>
    
    
    
    
    
    
    </> );
}
 
export default UserProfilePage;