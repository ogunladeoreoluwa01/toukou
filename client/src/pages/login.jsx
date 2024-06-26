import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import NavBarComp from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import login from '../services/index/userServices/login';
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../stores/reducers/userReducer";
import { passwordRetriesAction } from "../stores/reducers/passwordRetriesReducer";
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import resetPassword from '../stores/actions/passwordRetriesAction';
import Footer from '@/components/footer';

const LoginPage = () => {
 const[noTries ,setNoTries] = useState(false)
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const passwordTries =useSelector(state => state.passwordRetries)
  const navigate = useNavigate();

   useEffect(() => {

    if(passwordTries.passwordRetriesCount <=7){
     setNoTries(true)
    }
    if(passwordTries.passwordRetriesCount <=0){
     navigate("/forgot-password")
    }
  }, [passwordTries.passwordRetriesCount]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      userInfo: "",
      password: "",
    },
    mode: "onChange",
  });

  

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful. Data received:", data);
        toast.success(`Welcome ${data.message}`);
        dispatch(resetPassword());
        dispatch(userAction.setUserInfo(data.user));
        localStorage.setItem('account', JSON.stringify(data.user));
        console.log("User logged in successfully and dispatched:", data.user);
    },
    onError: (error) => {
    try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      toast.error(errormsg.errorMessage); // Displaying the error message using toast

      if (errormsg.errorCode === 410) {
       let newCount = passwordTries.passwordRetriesCount - 1;
    dispatch(passwordRetriesAction.setPasswordRetriesCount(newCount));
    localStorage.setItem('passwordRetries', JSON.stringify(newCount));
    console.log(newCount);
      } else if (errormsg.errorCode === 403) {
        navigate("/error-403");
      } else if (errormsg.errorCode === 452) {
        navigate("/user-is-disabled");
        } else if (errormsg.errorCode === 451) {
        navigate("/user-is-ban");
      }  else if(errormsg.errorCode ===500){
        navigate("/oops")
      }
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
      toast.error("An unexpected error occurred");
    }
  }
  });

  useEffect(() => {
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const submitHandler = (data) => {
    const { userInfo, password } = data;
  
    mutation.mutate({ userInfo, password });
  };

  const [passwordToggle, setPasswordToggle] = useState(false);

  const passwordToggleHandler = () => {
    setPasswordToggle(prevState => !prevState);
  };

  return (
    <>
      <main className="h-screen overflow-hidden  ">
        <NavBarComp />
        <section className="flex items-center justify-center  relative h-[90vh] bg-black">
        <img loading="lazy"
                  decoding='async'
                  fetchpriority='high'
                   src="https://i.pinimg.com/originals/9c/ea/f4/9ceaf47e37bd7cb7ff73584d1453cd6b.gif"  
                   className="w-full rounded-lg h-full object-cover object-center  opacity-40 "/>
        
          <section className="flex absolute  flex-col gap-5 p-5 w-fit rounded-md bg-slate-300/40 dark:bg-slate-800/40  ">
            
            <form onSubmit={handleSubmit(submitHandler)} className="w-[300px] md:w-[400px] transition-all duration-300 ease-linear backdrop-blur-sm ">
            <h2 className="text-2xl font-bold mb-4 text-slate-50">Login</h2>
              <div className="relative mb-1">
                <input
                  type="text"
                  {...register("userInfo", {
                    minLength: {
                      value: 1,
                      message: "User info length must be at least 1 character",
                    },
                    required: {
                      value: true,
                      message: "User info is required",
                    },
                  })}
                  placeholder="User Info"
                  className={`${errors.userInfo ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.userInfo?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.userInfo?.message}</p>
                )}
              </div>
              <div className="relative mb-1">
                <input
                  type={passwordToggle ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    minLength: {
                      value: 1,
                      message: "Password length must be at least 1 character",
                    },
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  })}
                  className={`${errors.password ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                <span
                  className="absolute right-2 top-[15%]  md:top-[15%] cursor-pointer"
                  onClick={passwordToggleHandler}
                >
                  {passwordToggle ? (
                    <FaEyeSlash className="text-slate-900 dark:text-slate-400 text-2xl" />
                  ) : (
                    <FaEye className="text-slate-900 dark:text-slate-400 text-2xl" />
                  )}
                </span>
                {errors.password?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.password?.message}</p>
                )}
              </div>
              <div className="">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 dark:text-blue-300 hover:underline mb-0.5"
                >
                  Forgot password?
                </Link>
                <p className="my-4">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-sm text-blue-500 hover:underline mt-4 dark:text-blue-300"
                  >
                    Signup
                  </Link>
                </p>
              </div>
              { mutation.isLoading ? <Button size="sm" disabled className="w-full px-6 py-2 font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button> :  <Button  type="submit" size="sm" disabled={!isValid || mutation.isLoading } className=" px-6 py-2 w-full uppercase">
                login
              </Button>}
              {noTries ? <p className="text-red-500 text-sm mt-1 mb-4">you have , {passwordTries.passwordRetriesCount} retries left </p>:<></>}
            </form>
          </section>
        </section>
        <Toaster richColors position="top-right" expand={true} closeButton />
      </main>
      <Footer/>
    </>
  );
};

export default LoginPage;
