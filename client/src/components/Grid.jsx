import React from "react";
import { motion } from "framer-motion";
import { RiInstagramFill } from "react-icons/ri";
import { FiArrowRight, FiMail, FiMapPin } from "react-icons/fi";
import { SiYoutube } from "react-icons/si";
import { SlSocialGithub } from "react-icons/sl";
import { SlSocialSteam } from "react-icons/sl";
import { SlSocialTwitter } from "react-icons/sl";
import { RiTwitterXLine } from "react-icons/ri";
import { RiWhatsappFill } from "react-icons/ri";
import { RiGithubFill } from "react-icons/ri";


const Grid = () => {
    return ( <>

    <section className=" font-NotoSans my-4 py-6 mx-auto grid max-w-5xl grid-flow-dense grid-cols-12 gap-4  px-4  text-slate-900 dark:text-slate-50 ">
<div className="col-span-12 row-span-2 md:col-span-6  rounded-lg border  bg-slate-300  dark:bg-slate-600 p-6 hover:rotate-[-2.5deg] hover:scale-[0.9] transition-all duration-300 ease-linear">
<img
 loading="lazy"
 decoding='async'
 fetchpriority='high'
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



<div className="col-span-6 bg-green-500 hover:bg-green-600 md:col-span-3 hover:rotate-[2.5deg] hover:scale-[0.9] rounded-lg    transition-all duration-300 ease-linear">
<a
        href="https://wa.me/+2347069310594?text=I'm%20interested%20in%20working%20with%20you%20my%20name%20is"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
        <RiWhatsappFill />
      </a>
</div>
<div className="col-span-6 bg- bg-neutral-800 hover:bg-neutral-950 md:col-span-3 hover:rotate-[-3.5deg] hover:scale-[1.1] rounded-lg  transition-all duration-300 ease-linear ">
<a
        href="https://github.com/ogunladeoreoluwa01"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
       <RiGithubFill />
      </a>
</div>
<div className="col-span-6 instagram  transform   md:col-span-3 hover:rotate-[4.5deg] hover:scale-[0.9] rounded-lg  transition-all duration-300 ease-linear ">
<a
        href="#"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
        <RiInstagramFill />
      </a>
</div>
<div className="col-span-6 bg-stone-950 hover:bg-stone-900 md:col-span-3 hover:rotate-[5.5deg] hover:scale-[1.1] rounded-lg  transition-all duration-300 ease-linear ">
<a
        href="#"
        className="grid h-full place-content-center text-3xl text-white p-12"
      >
      <RiTwitterXLine />
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
        <FiMail /> <span className="hidden md:inline">Send me an Email</span> 
      </button>
    </form>
</div>






    </section>
    
    
    
    
    
    </> );
}
 
export default Grid;