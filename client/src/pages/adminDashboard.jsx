import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBarComp from '../components/NavBar';
import AdminSideBar from '../components/adminDashSideBar';

const Admindashboard = () => {
    const param = useParams();
    const location = useLocation();
    const [adminRole, setAdminRole] = useState(null);
    
    const userState = useSelector(state => state.user);
    
    useEffect(() => {
        console.log(param);
    }, [param]);

    useEffect(() => {
        if (userState.userInfo?.superAdmin) {
            setAdminRole("lord");
        } else {
            setAdminRole("Admin");
        }
    }, [userState]);

    const isRootPath = location.pathname === '/admindashboard';

    return (
        <>
            <NavBarComp />
            <main className="flex flex-col md:flex-row">
                <AdminSideBar />
                <section className='my-3 p-4'>
                    {isRootPath ? (
                        <div className='text-2xl font-medium'>
                            <h1> Welcome to the Admin Dashboard! </h1>
                            <h1 className='font-bold'>{adminRole}! {userState.userInfo.username}</h1>
                           
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </section>
            </main>
        </>
    );
};

export default Admindashboard;
