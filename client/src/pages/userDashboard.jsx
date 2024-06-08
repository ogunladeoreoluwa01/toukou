import React, {  useEffect } from 'react';
import NavBarComp from "../components/NavBar";
import { Link,useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';

import { useQuery} from '@tanstack/react-query';
import getUserData from "../services/index/userServices/getUserData";
import { Toaster, toast } from 'sonner';

import PageLoader from '../components/loaders/pageLoader';

import UserPostComponent from '@/components/usersPostComponent';
import YourProfileSection from '@/components/yourProfileSection';
import YourProfileSectionLoader from '@/components/loaders/userProfileSection';


const UserProfile = () => {
  const user = useSelector(state => state.user);



  const navigate =useNavigate()
  const userQuery = useQuery({
    queryFn: () => getUserData(user.userInfo.token, user.userInfo._id),
    queryKey: ["user", user.userInfo._id]
     
  });

   useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user.userInfo]);
  useEffect(() => {
    console.log(userQuery)
  }, [userQuery]);
 
 if (userQuery.isError) {
    try {
      const error = JSON.parse(userQuery.error.message);
      console.error(`Error ${error.errorCode}: ${error.errorMessage}`);
      if (error.errorCode === 404) {
        navigate("/error-404");
      } else if (error.errorCode === 403) {
        navigate("/error-403");
      } else if (error.errorCode === 452) {
        navigate("/user-is-disabled");
      } else if (error.errorCode === 451) {
        navigate("/user-is-ban");
      } else if (error.errorCode === 500) {
        navigate("/oops");
      }
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
    }
  }


  

  
  return (
    <>
      <NavBarComp />
      <main className='px-4'>
      {userQuery.isError ? (
          <div>Oops, there is an error. Please try again.</div>
        ) : !userQuery.isLoading ? (
          <>
            <section>
              <div>
                <p className="text-sm p-2 capitalize">
                  <Link to="/">Home</Link>&nbsp;/&nbsp; user &nbsp;/&nbsp;{userQuery.data?.user.username}
                </p>
              </div>
              
            </section>
                {!userQuery.isLoading?<YourProfileSection userQuery={userQuery} />: <YourProfileSectionLoader/>} 
           {/* ur post section */}
           <section className='flex w-full md:w-[90vw] mx-auto  justify-center items-center min-h-[200px]'>
  <UserPostComponent username={userQuery.data?.user.username}  authorId={userQuery.data?.user._id} className="mx-auto" />
           </section>
          </>
        ) : (
          <PageLoader />
        )}

       
        <Toaster richColors position="top-right" expand={false} closeButton />
      </main>
    </>
  );
}

export default UserProfile;
