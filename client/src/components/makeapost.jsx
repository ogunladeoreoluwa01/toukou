import { Link } from "react-router-dom";
import { FaPenAlt } from "react-icons/fa";
const MakeaPost = () => {
    return ( <>
    
    <Link to="/makepost" className=" fixed bottom-[5%] right-[2.5%] z-40 "> 
    <button
    href="/"
    class="group flex justify-center p-3  drop-shadow-xl  font-semibold rounded-full transition-all duration-500 bg-slate-700 dark:bg-slate-500"
  >
    <span className="text-2xl dark:text-slate-100  text-slate-300">
    <FaPenAlt />
    </span>

    <span
      class="capitalize pointer-events-none absolute opacity-0 group-hover:opacity-100 p-2 dark:text-slate-400  text-slate-300  bg-slate-700 dark:bg-slate-600 rounded-lg group-hover:text-sm group-hover:-translate-y-14 duration-700 w-fit"
    >
      make_A_Post
    </span>
  </button>
    
    </Link>
    
    
    
    </> );
}
 
export default MakeaPost;