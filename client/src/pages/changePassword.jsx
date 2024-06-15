import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from 'sonner';
import PageLoader from '@/components/loaders/pageLoader';
import ChangePasswordComponent from '@/components/changePasswordComponent';
import createOTPCode from '../services/index/userServices/getOTP';
import resetOTP from "@/stores/actions/isOTPAction";
import { isOTPAction } from "../stores/reducers/isOTPReducer";
import NavBarComp from "../components/NavBar";
import Footer from "@/components/footer";



const ChangePasswordPage = () => {
  const isOTP = useSelector(state => state.isOTPCode.isOTP);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [OTPData, setOTPData] = useState(null);
  const[regOTPCheck,setRegOTPCheck] = useState(false)
  const [regetOTP, setRegetOTP] = useState(false);
  const otpRequested = useRef(false);

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/");
    }
  }, [user.userInfo, navigate]);

  useEffect(() => {
    const fetchOTPCode = async () => {
      if (isOTP) {
        toast.success("An OTP code has already been sent to your email");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await createOTPCode(user.userInfo.token);
        setOTPData(data);
        toast.success("An OTP code has been sent to your email");
        dispatch(isOTPAction.setOTP(true));
        localStorage.setItem("isOTP", JSON.stringify(true));

        const timeoutId = setTimeout(() => {
          dispatch(isOTPAction.resetIsOTP());
          localStorage.removeItem("isOTP");
          toast.warning("OTP code has expired, request a new code please");
        }, 3600000); // 1 hour in milliseconds

        return () => clearTimeout(timeoutId);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    if (user.userInfo?.token && !otpRequested.current) {
      fetchOTPCode();
      otpRequested.current = true;
    }
  }, [user.userInfo?.token, dispatch,]);

  useEffect(() => {
    if (regetOTP) {
      const fetchOTPCode = async () => {
        try {
          setLoading(true);
          if (isOTP) {
            dispatch(resetOTP());
            localStorage.removeItem('isOTP');
          }
          const data = await createOTPCode(user.userInfo.token);
          setOTPData(data);
          dispatch(isOTPAction.setOTP(true));
          localStorage.setItem('isOTP', JSON.stringify(true));
          toast.success('An OTP code has been sent to your email');
          
          const timeoutId = setTimeout(() => {
            dispatch(isOTPAction.resetIsOTP());
            localStorage.removeItem('isOTP');
            toast.warning('OTP code has expired. Request a new code, please.');
          }, 3600000); // 1 hour in milliseconds

          return () => clearTimeout(timeoutId); // Cleanup on component unmount
          
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
          setRegetOTP(false);
        }
      };

      fetchOTPCode();
    }
  }, [regOTPCheck, dispatch, user.userInfo.token]);

  const handleError = (error) => {
    try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      toast.error(errormsg.errorMessage);

      // Handle specific error codes here
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
      toast.error("An unexpected error occurred");
    }
  };

  

  return (
    <>
     <Toaster richColors position="top-right" expand={true} closeButton />
    {loading?  <PageLoader />:<> <main className="h-screen">
       
        <NavBarComp />
        <section className="flex items-center justify-center relative h-[90vh] bg-black">
          <img
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            src="https://i.pinimg.com/originals/9a/8f/ba/9a8fbabe57aab21441917d9d07f009b9.gif"
            className="w-full rounded-lg h-full object-cover object-center opacity-40"
          />
          <section className="flex absolute flex-col gap-5 p-5 w-fit rounded-md bg-slate-300/40 dark:bg-slate-800/40">
             <ChangePasswordComponent setRegetOTP={setRegetOTP} setRegOTPCheck={setRegOTPCheck} />
          </section>
        </section>
      </main>
       <Footer/>
       </>
      }
     
    
    </>
  );
};

export default ChangePasswordPage;


