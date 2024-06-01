import { useState } from 'react';
import { NavLink, Link,useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import logOut from '../stores/actions/userAction';

const NavBarComp = () => {
    // State to manage the toggle state of the mobile navigation menu
    const [navToggle, setNavToggle] = useState(false);

    // Accessing the user state from the Redux store
    const userState = useSelector(state => state.user);

    // Redux dispatch function to dispatch actions
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // Navigation links data
    const Navlinks = [
        { url: "/", urlName: "Home" },
        { url: "/about", urlName: "About" },
        { url: "/allblogs", urlName: "Blogs" },
        { url: "/faq", urlName: "FAQ" },
        { url: "/contact", urlName: "Contact" },
    ];

    // Function to toggle the navToggle state and manage the body overflow
    const handleToggle = () => {
        setNavToggle(!navToggle);
        document.body.classList.toggle('overflow-hidden', !navToggle);
    };

    // Function to handle user logout
    const logOutHandler = () => {
        dispatch(logOut());
        navigate("/");
    };

    // Animation variants for the mobile navigation menu
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
            {/* Desktop Navigation */}
            <nav className='md:flex border-b-2 border-spacing-y-2 border-slate-900 dark:border-slate-100 justify-between items-end hidden py-3 '>
                <NavLink to="/" className="font-black text-3xl uppercase">
                    <span>toukou</span><span>投稿</span>
                </NavLink>

                <ul className='flex gap-3 items-center'>
                    {Navlinks.map((link, index) => (
                        <li key={index}>
                            <NavLink 
                                to={link.url}
                                className={({ isActive }) => isActive 
                                    ? 'active font-bold dark:bg-slate-700 py-1 px-3 bg-slate-200 rounded-md' 
                                    : 'inactive font-medium hover:bg-slate-200 dark:hover:bg-slate-700 py-1 px-3 rounded-md transition-all duration-300'}
                            >
                                {link.urlName}
                            </NavLink>
                        </li>
                    ))}
                    {userState.userInfo ? (
                        <>
                            {/* User Profile Link */}
                            <li className='font-medium'>
                                <Link to={`/yourprofile/${userState?.userInfo?.username}`} className='flex items-center hover:bg-slate-200 dark:hover:bg-slate-700 transform py-1 px-3 rounded-md transition-colors duration-200 border-r-4 border-transparent'>
                                    <div className="mr-3">
                                    <FaUser />
                                    </div>
                                    Profile
                                </Link>
                            </li>

                            {userState.userInfo.isAdmin || userState.userInfo.superAdmin?<li className='font-medium'>
                                <Link to="/admindashboard" className='flex items-center hover:bg-slate-200 dark:hover:bg-slate-700 transform py-1 px-3 rounded-md transition-colors duration-200 border-r-4 border-transparent'>
                                    <div className="mr-3">
                                    <RiAdminFill />
                                    </div>
                                    Admin Dashboard
                                </Link>
                            </li>:<></>}
                            
                            {/* Logout Button */}
                            <li className='font-medium'>
                                <button onClick={logOutHandler} className='flex items-center text-red-500 hover:text-red-700 hover:font-bold hover:bg-red-400 transform py-1 px-3 rounded-md transition-colors duration-200 border-r-4 border-transparent'>
                                    <div className="mr-3">
                                        <IoLogOut />
                                    </div>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Login and Signup Links */}
                            <li>
                                <NavLink to="/login" className="px-6 py-1 rounded-lg dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" className="px-6 py-1 rounded-lg dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
                                    Signup
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Mobile Navigation */}
            <nav className='flex flex-col md:hidden relative p-4 top-0 z-50  dark:bg-slate-900 bg-slate-100 w-full'>
                <section className='border-b-2 border-spacing-y-2 border-slate-900 dark:border-slate-100 justify-between items-center w-full px-2 flex py-3'>
                    <NavLink to="/" className="font-black text-2xl uppercase">
                        <span>投稿</span>
                    </NavLink>
                    <button onClick={handleToggle} className='transition-all text-slate-900 dark:text-slate-50 hover:scale-105 w-fit duration-300 px-2'>
                        {navToggle ? (
                            // Close icon
                            <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 22H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 16H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 1L19 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            // Hamburger icon
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
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
                            <section className='h-[87vh] overflow-hidden flex flex-col mx-auto w-[350px] justify-around'>
                                <ul className='flex flex-col items-start  py-10 gap-5'>
                                    {Navlinks.map((link, index) => (
                                        <li key={index}
                                        onClick={()=>{ document.body.classList.remove('overflow-hidden');}}
                                         className='py-1'>
                                            
                                            <NavLink
                                                to={link.url}
                                                className={({ isActive }) => isActive
                                                    ? 'active font-bold py-2 px-6 w-[350px] block bg-slate-800 text-slate-200 rounded-md'
                                                    : 'inactive font-medium w-[350px] block hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-6 rounded-md transition-all duration-300'}
                                            >
                                                {link.urlName}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                                <div className='flex flex-col gap-3'>
                               
                                    
                                    {userState.userInfo ? (
                                        <>
                                         {userState.userInfo.isAdmin || userState.userInfo.superAdmin?<NavLink to="/admindashboard" className="px-6 items-center flex py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
                                    <div className="mr-3">
                                    <RiAdminFill />
                                                </div> Admin Dashboard
                                    </NavLink>:<></>}
                                            {/* User Profile Link */}
                                            <NavLink to={`/yourprofile/${userState?.userInfo?.username}`} className="px-6 py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase flex items-center">
                                                <div className="mr-3">
                                                <FaUser />
                                                </div>
                                                Profile
                                            </NavLink>
                                            {/* Logout Button */}
                                            <button onClick={logOutHandler} className="px-6 py-2 rounded-md w-[350px] font-bold text-red-700 hover:font-bold bg-red-400 transition-all duration-300 capitalize flex items-center">
                                                <div className="mr-3">
                                                    <IoLogOut />
                                                </div>
                                                LOGOUT
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Login and Signup Links */}
                                            <NavLink to="/login" className="px-6 py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
                                                Login
                                            </NavLink>
                                            <NavLink to="/register" className="px-6 py-2 rounded-md w-[350px] font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
                                                Signup
                                            </NavLink>
                                        </>
                                    )}
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
