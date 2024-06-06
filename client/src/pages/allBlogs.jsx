import NavBarComp from "../components/NavBar";
import SectionHeader from '../components/SectionHeader';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams,useParams } from "react-router-dom";

import { Toaster} from 'sonner';

import AllPostComponent from "@/components/allPostComponent.";

const AllBlogs = () => {
    const [filter, setFilter] = useState("");
    const [searchParams,setSearchParam] = useSearchParams()


    return (  <>
    <NavBarComp/>
    <main className="px-4 ">

  
<section className="flex  items-center justify-center w-full ">
<AllPostComponent/>
</section>


    </main> 
    </>);
}
 
export default AllBlogs;