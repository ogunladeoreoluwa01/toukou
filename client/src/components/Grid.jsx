import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiMapPin } from "react-icons/fi";
import { SiYoutube } from "react-icons/si";
import { SlSocialGithub } from "react-icons/sl";
import { SlSocialSteam } from "react-icons/sl";
import { SlSocialTwitter } from "react-icons/sl";
const Grid = () => {
    return ( <>

    <section className=" font-NotoSans my-4 py-6 mx-auto grid max-w-5xl grid-flow-dense grid-cols-12 gap-4  px-4  text-slate-900 dark:text-slate-50 ">
<div className="col-span-12 row-span-2 md:col-span-6  rounded-lg border  bg-slate-300  dark:bg-slate-600 p-6 hover:rotate-[-2.5deg] hover:scale-[0.9] transition-all duration-300 ease-linear">
<img
      src="https://i.pinimg.com/originals/84/a5/f5/84a5f56879a12019e4963241263e505d.jpg"
      alt="avatar"
      className="mb-4 size-20 rounded-full object-scale-down "
    />
    <h1 className="mb-12 text-4xl font-medium leading-tight">
      Hi, I'm Emmanuel.{" "}
      <span className="text-slate-700 dark:text-slate-300 ">
        I build cool websites like this one.
      </span>
    </h1>
    <a
      href="#"
      className="font-semibold flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:underline transition-all duration-300 ease-linear"
    >
      Contact me <FiArrowRight />
    </a>
</div>



<div className="col-span-6 bg-red-500 hover:bg-red-600 md:col-span-3 hover:rotate-[2.5deg] hover:scale-[0.9] rounded-lg    transition-all duration-300 ease-linear">
<a
        href="#"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
        <SiYoutube />
      </a>
</div>
<div className="col-span-6 bg-slate-800 hover:bg-slate-950 md:col-span-3 hover:rotate-[-3.5deg] hover:scale-[1.1] rounded-lg  transition-all duration-300 ease-linear ">
<a
        href="#"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
        <SlSocialGithub />
      </a>
</div>
<div className="col-span-6  bg-blue-800 hover:bg-blue-700 md:col-span-3 hover:rotate-[4.5deg] hover:scale-[0.9] rounded-lg  transition-all duration-300 ease-linear ">
<a
        href="#"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
        <SlSocialSteam />
      </a>
</div>
<div className="col-span-6 bg-blue-600 hover:bg-blue-500 md:col-span-3 hover:rotate-[5.5deg] hover:scale-[1.1] rounded-lg  transition-all duration-300 ease-linear ">
<a
        href="#"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
       <SlSocialTwitter />
      </a>
</div>
<div className="col-span-12 text-3xl leading-snug  rounded-lg  hover:rotate-[1.5deg] hover:scale-[1.1]  bg-slate-300  dark:bg-slate-600 p-6 transition-all duration-300 ease-linear">
<p>
      My passion is building cool stuff.{" "}
      <span className="text-slate-700 dark:text-slate-300 ">
      "I specialize in crafting captivating experiences with React, Tailwind CSS, and Vue.js. My passion lies in creating innovative solutions that leave people in awe 😊. I hope you enjoyed my work!
      </span>
    </p>

</div>
<div className="col-span-12 flex flex-col items-center gap-4 md:col-span-3  rounded-lg  dark:text-slate-300   bg-slate-300  dark:bg-slate-600 p-6 hover:rotate-[-1.5deg] hover:scale-[1.1] transition-all duration-300 ease-linear">
<FiMapPin className="text-3xl" />
    <p className="text-center text-lg font-semibold  text-slate-800 dark:text-slate-400">Cyberspace</p>
</div>
<div className="col-span-12 md:col-span-9  rounded-lg  dark:text-slate-300   bg-slate-300  dark:bg-slate-600 p-6">
<p className="mb-3 text-lg font-semibold">Join my mailing list</p>
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        placeholder="Wanna work together"
        className="w-full rounded border border-slate-700 dark:border-slate-800 placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300  dark:bg-slate-600 px-3 py-1.5  focus:border-slate-900  focus:outline-0 transition-all duration-300 ease-linear"
      />
      <button
        type="submit"
        className="flex items-center gap-2 whitespace-nowrap rounded bg-slate-900 dark:bg-slate-100 px-3 py-2 text-sm font-medium text-slate-50 dark:text-slate-900  hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 ease-linear"
      >
        <FiMail /> Send me an Email
      </button>
    </form>
</div>






    </section>
    
    
    
    
    
    </> );
}
 
export default Grid;