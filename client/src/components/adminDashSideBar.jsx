import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { FaUserShield, FaBan, FaTrash } from "react-icons/fa";



const AdminSideBar = () => {
    // State to manage the toggle state of the mobile navigation menu
    const [navToggle, setNavToggle] = useState(false);
    const [adminRole, setAdminRole] = useState(null);

    // Accessing the user state from the Redux store
    const userState = useSelector(state => state.user);

  
    const adminActions = [
        { url: "/admindashboard/promote-admin", label: "Create Admin", icon: FaUserShield },
        { url: "/admindashboard/demote-admin", label: "Demote Admin", icon: FaUserShield },
        { url: "/admindashboard/ban-user", label: "Ban User", icon: FaBan },
        { url: "/admindashboard/unban-user", label: "Unban User", icon: FaBan },
        { url: "/admindashboard/delete-user", label: "Delete User", icon: FaTrash }
    ];

    // Function to toggle the navToggle state and manage the body overflow
    const handleToggle = () => {
        setNavToggle(!navToggle);
        document.body.classList.toggle('overflow-hidden', !navToggle);
    };

  

    useEffect(() => {
        if (userState.userInfo?.superAdmin) {
            setAdminRole("lord");
        } else {
            setAdminRole("Admin");
        }
    }, [userState]);

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

    const profileImgUrl = userState.userInfo?.profileImage?.profileImgUrl || '';
    const profileImgName = userState.userInfo?.profileImage?.profileImgName || 'Profile Image';

    return (
        <>
            {/* Desktop View */}
            <nav className='md:flex w-[330px] flex-col hidden relative pr-4 top-0 z-50 border-r dark:border-slate-600 border-slate-200 dark:bg-slate-900 bg-slate-100'>
                <section className='justify-between items-end w-full flex'>
                    <span className='flex gap-2 items-end justify-start w-full mb-10 border-b dark:border-slate-600 border-slate-200 py-3'>
                        <img src={profileImgUrl} alt={profileImgName} className='w-14 h-14 border-2 rounded-full' />
                        <span className='flex flex-col justify-start items-start'>
                            <h1 className='text-base font-semibold'>{userState.userInfo.username}</h1>
                            <h1 className='text-sm text-slate-400 dark:text-slate-500 font-semibold'>{userState.userInfo.email}</h1>
                        </span>
                    </span>
                </section>
                <div>
                    <section className='h-[87vh] overflow-hidden flex flex-col mx-auto w-[350px]'>
                        <ul className='flex flex-col items-start gap-3'>
                            {adminActions.filter(action => 
                                adminRole === "lord" || 
                                !["/admindashboard/promote-admin", "/admindashboard/demote-admin","/admindashboard/delete-user"].includes(action.url)
                            ).map((action, index) => (
                                <li key={index} className='py-1'>
                                    <NavLink
                                        to={action.url}
                                        className={({ isActive }) => isActive
                                            ? 'font-bold w-[300px] bg-slate-800 text-slate-200 py-2 px-6 rounded-md transition-all duration-300 flex items-center'
                                            : 'font-medium w-[300px] hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-6 rounded-md transition-all duration-300 flex items-center'}
                                        onClick={() => document.body.classList.remove('overflow-hidden')}
                                    >
                                        <action.icon className="mr-2 text-xl" />
                                        {action.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </nav>

            {/* Mobile View */}
            <nav className='flex flex-col md:hidden relative px-4 top-0 z-50 dark:bg-slate-900 bg-slate-100 w-full'>
                <section className='justify-between items-end w-full flex'>
                    <span className="font-bold text-2xl capitalize">{adminRole}</span>
                    <button onClick={handleToggle} className='transition-all text-slate-900 dark:text-slate-50 hover:scale-105 w-fit duration-300 px-2'>
                        {navToggle ? (
                            <span className='flex gap-2 items-end justify-end w-full'>
                                <span className='flex flex-col justify-start items-end'>
                                    <h1 className='text-base font-semibold'>{userState.userInfo.username}</h1>
                                    <h1 className='text-sm text-slate-400 dark:text-slate-500 font-semibold'>{userState.userInfo.email}</h1>
                                </span>
                                <img src={profileImgUrl} alt={profileImgName} className='w-14 h-14 border-2 rounded-full' />
                            </span>
                        ) : (
                            <img src={profileImgUrl} alt={profileImgName} className='w-14 h-14 border-2 rounded-full' />
                        )}
                    </button>
                </section>

                <AnimatePresence>
                    {navToggle && (
                        <motion.div
                            className="navbar"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={navContainer}
                        >
                            <section className='h-[80vh] overflow-hidden flex flex-col mx-auto w-[350px] justify-around'>
                                <ul className='flex flex-col items-start py-10 gap-5'>
                                    {adminActions.filter(action => 
                                        adminRole === "lord" || 
                                        !["/admindashboard/promote-admin", "/admindashboard/demote-admin","/admindashboard/delete-user"].includes(action.url)
                                    ).map((action, index) => (
                                        <li
                                        onClick={handleToggle}
                                        key={index} className='py-1'>
                                            <NavLink
                                                to={action.url}
                                                className={({ isActive }) => isActive
                                                    ? 'font-bold w-[350px] bg-slate-800 text-slate-200 py-2 px-6 rounded-md transition-all duration-300 flex items-center'
                                                    : 'font-medium w-[350px] hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-6 rounded-md transition-all duration-300 flex items-center'}
                                                onClick={() => document.body.classList.remove('overflow-hidden')}
                                            >
                                                <action.icon className="mr-3" />
                                                {action.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default AdminSideBar;
