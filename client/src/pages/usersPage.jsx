import React, { useEffect } from 'react';
import NavBarComp from "../components/NavBar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import getUserData from "../services/index/userServices/getUserData";
import { Toaster, toast } from 'sonner';
import { useSelector } from 'react-redux';
import PageLoader from '../components/loaders/pageLoader';
import YourProfileSectionLoader from '@/components/loaders/userProfileSection';
import UserPostComponent from '@/components/usersPostComponent';
import UserProfileSection from '@/components/userProfileSection';
import Footer from '@/components/footer';
import MakeaPost from '@/components/makeapost';

const GetUsersProfile = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const { userId } = useParams();
  
  
  const userQuery = useQuery({
    queryFn: () => getUserData(user.userInfo.token, userId),
    queryKey: ["user", userId],
  });

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/error-403");
      toast.error("you need to be logged in to view this page")
    }
  }, [navigate, user]);

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
     

        {userQuery.isError ? (
          <div>Oops, there is an error. Please try again.</div>
        ) : !userQuery.isLoading ? (
          <>
           <NavBarComp />
      <main className='px-4'>
            <section>
              <div>
                <p className="text-sm p-2 capitalize">
                  <Link to="/">Home</Link>&nbsp;/&nbsp; user &nbsp;/&nbsp;{userQuery.data?.user.username}
                </p>
              </div>
             
            </section>
            {!userQuery.isLoading? <UserProfileSection userQuery={userQuery}/>: <YourProfileSectionLoader/>}
            
           
           
           {/* ur post section */}
           <section className='flex w-full md:w-[90vw] mx-auto  justify-center items-center min-h-[200px]'>
  <UserPostComponent username={userQuery.data?.user.username}  authorId={userQuery.data?.user._id} className="mx-auto" />
           </section>
            

   <MakeaPost/>
        
      </main>
       <Footer/>
          </>
        ) : (
          <PageLoader />
        )}
      
       <Toaster richColors position="top-right" expand={false} closeButton />
    </>
  );
}

export default GetUsersProfile;
