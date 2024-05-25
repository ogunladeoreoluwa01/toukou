import { Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
const ToAdminDash = () => {
    return ( <>
    
    <Link to="/admindashboard" className="fixed bottom-[5%] left-[2.5%] md:left-[3%] z-40 hidden md:inline "> 
    <button
    href="/"
    class="group flex justify-center p-3  drop-shadow-xl  font-semibold rounded-full transition-all duration-500 bg-slate-700 dark:bg-slate-500"
  >
    <span className="text-2xl dark:text-slate-100  text-slate-300">
    <RiAdminFill />
    </span>

    <span
      class="capitalize pointer-events-none absolute opacity-0 group-hover:opacity-100 p-2 dark:text-slate-400  text-slate-300  bg-slate-700 dark:bg-slate-600 rounded-lg group-hover:text-sm group-hover:-translate-y-14 duration-700 w-fit"
    >
      to_Admin_Dash
    </span>
  </button>
    
    </Link>
    
    
    
    </> );
}
 
export default ToAdminDash;