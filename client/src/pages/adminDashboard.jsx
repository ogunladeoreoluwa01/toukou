import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBarComp from '../components/NavBar';
import AdminSideBar from '../components/adminDashSideBar';
import { Toaster} from 'sonner';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);

  const isRootPath = location.pathname === '/admindashboard';

  useEffect(() => {
    if (!userState.userInfo?.superAdmin && !userState.userInfo?.isAdmin) {
      navigate("/error-403");
    }
  }, [userState, navigate]);

  const adminRole = userState.userInfo?.superAdmin ? "lord" : "Admin";

  return (
    <>
      <NavBarComp />
      <main className="flex flex-col md:flex-row">
        <AdminSideBar />
        <section className='my-3 p-4'>
          {isRootPath ? (
            <div className='text-2xl font-medium'>
              <h1>Welcome to the Admin Dashboard!</h1>
              <h1 className='font-bold'>{adminRole}! {userState.userInfo.username}</h1>
            </div>
          ) : (
            <Outlet />
          )}
        </section>
      </main>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default AdminDashboard;
