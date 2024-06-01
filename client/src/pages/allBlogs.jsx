import NavBarComp from "../components/NavBar";
import SectionHeader from '../components/SectionHeader';
import FeaturedPost from '../components/FeaturedPost';
import NormalPost from '../components/normalPost'
import NormalPostLoader from '../components/loaders/normalPostLoader';
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams,useParams } from "react-router-dom";

import { Toaster, toast } from 'sonner';

import getBlogs from "../services/index/postServices/getAllBlog";
import { useQuery ,useInfiniteQuery} from '@tanstack/react-query';

const AllBlogs = () => {
    const [filter, setFilter] = useState("");
    const [searchParams,setSearchParam] = useSearchParams()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
      } = useForm({
        defaultValues: {
          title: "",
        },
        mode: "onChange",
      });
      
      const submitHandler = (data) => {
        const { title } = data;
        // console.log('Submitted title:', title);
        setSearchParam({title:title})

      };

      useEffect(() => {
        let  title = searchParams.get('title') || '';

        setFilter(title);
        console.log(title);

        
      }, [searchParams]);
      let allBlogsQuery = useInfiniteQuery({
        queryFn: () => getBlogs(filter),
        queryKey: ["allBlogs"], 
      })
    
     
    
    

      
      useEffect(() => {
        if (allBlogsQuery.data) {
          console.log(allBlogsQuery.data);
        }
      }, [allBlogsQuery]);
    
     
    







    return (  <>
    <main className="px-4">

    <form className="" onSubmit={handleSubmit(submitHandler)}>  

    <div className="flex items-center  mx-auto ">
    <label for="simple-search" className="sr-only">Search</label>
    <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
            </svg>
        </div>
        <input
         {...register("title", {
            minLength: {
              value: 1,
              message: "title length must be at least 1 character",
            },
          })}
        
        type="text" id="simple-search" className="bg-slate-50   text-slate-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-slate-700  dark:placeholder-slate-400 dark:text-white " placeholder="Search Blog Title.."/>
    </div>
    <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-slate-700 rounded-lg border border-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800">
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span className="sr-only">Search</span>
    </button>
        </div> 
    

</form>






<section>
<SectionHeader/>
<div className='flex flex-wrap  justify-center items-center gap-4 md:gap-2'>
{allBlogsQuery.isLoading ? (
                  Array(10).fill(0).map((_, index) => <NormalPostLoader key={index} />)
                ) : allBlogsQuery.isError ? (
                  <h1 className='text-center text-xl font-bold md:mx-6'>Error loading posts</h1>
                ) : allBlogsQuery.data?.posts.length > 0 ? (
                    allBlogsQuery.data.posts.map((post, index) => <NormalPost key={index} post={post} />)
                ) : (
                  <h1 className='text-center text-xl font-bold md:mx-6'>No posts here</h1>
                )}
        </div>
</section>


    </main> 
    </>);
}
 
export default AllBlogs;