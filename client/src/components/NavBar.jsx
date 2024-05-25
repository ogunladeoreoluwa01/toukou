import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";



const NavBarComp = () => {
    const [navToggle, setNavToggle] = useState(false);
    
    const Navlinks = [
        { url: "/", urlName: "Home" },
        { url: "/about", urlName: "About" },
        { url: "/blogs", urlName: "Blogs" },
        { url: "/faq", urlName: "FAQ" },
        { url: "/contact", urlName: "Contact" },
    ];

    // Function to toggle the navToggle state
    const handleToggle = () => {
        setNavToggle(!navToggle);
        document.body.classList.toggle('overflow-hidden', !navToggle);
        document.getElementsByClassName("toBeHidden").toggle("hidden",!navToggle)
    };

const navContainer = {
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { velocity: 100 },
        duration: 0.3
      }
    },
    hidden: {
      x: -250,
      opacity: 0,
      transition: {
        x: { velocity: 100 },
        duration: 0.3
      }
    }
  };


    return (
        <>
            <nav className=' md:flex  border-b-2 border-spacing-y-2 border-slate-900 dark:border-slate-100 justify-between items-end hidden py-3'>
               <NavLink to="/" className="font-black text-3xl uppercase "> <span>toukou</span><span>投稿</span></NavLink>
               
                <ul className='flex gap-3'>
                  
                    {Navlinks.map((link, index) => (
                        <li key={index}>
                            <NavLink 
                                to={link.url}
                                className={({ isActive }) => isActive ? 'active font-bold' : 'inactive font-medium hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-3 rounded-md transition-all duration-300'}
                            >
                                {link.urlName}
                            </NavLink>
                        </li>
                    ))}
                    <li><NavLink to="/login" className="px-6 py-2 rounded-lg dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 uppercase">login</NavLink>
                    </li>
                    <li><NavLink to="/register" className="px-6 py-2 rounded-lg dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 uppercase" > signup</NavLink>
                    </li>
                </ul>
               
            </nav>
            <nav className='flex flex-col md:hidden'>
                <section className='border-b-2 border-spacing-y-2 border-slate-900 dark:border-slate-100 justify-between items-end flex py-3'>
                <NavLink to="/" className="font-black text-2xl uppercase "> <span>投稿</span></NavLink>
                <button onClick={handleToggle} className=' transition-all text-slate-900 dark:text-slate-50 hover:scale-105 w-fit duration-300 px-2'>
                    {navToggle ? 
                        <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 22H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 16H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 1L19 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    : 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                    }
                </button>
                </section>
                <AnimatePresence>
        {navToggle && (
          <motion.div
            className="navbar"
            initial="hidden"
            animate={navToggle ? "visible" : "hidden"}
            exit="hidden"
            variants={navContainer}
          >
            <section className='h-[87vh] overflow-hidden   flex flex-col mx-auto w-[350px]  justify-around'> 
<ul className='flex flex-col   items-start px-5 py-10 gap-5 '>
                      {Navlinks.map((link, index) => (
                          <li key={index} className='py-1'>
                              <NavLink 
                                  to={link.url}
                                  className={({ isActive }) => isActive ? 'active font-bold py-2 px-6 w-[350px] block bg-slate-800 text-slate-200 rounded-md' : 'inactive font-medium w-[350px] block hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-6 rounded-md transition-all duration-300 '}
                              >
                                  {link.urlName}
                              </NavLink>
                          </li>
                      ))}
                      
                  </ul>
                  <div className='flex flex-col gap-3'>
                  <NavLink to="/login" className="px-6 py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 uppercase">login</NavLink>
                  <NavLink to="/register" className="px-6 py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 uppercase" > signup</NavLink>
                  <NavLink to="/admindashboard" className="px-6 py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 uppercase" > Admin Dashboard</NavLink>
                  </div>
                </section>
          </motion.div>
        )}
      </AnimatePresence>
                
            </nav>
        </>
    );
};

export default NavBarComp;
