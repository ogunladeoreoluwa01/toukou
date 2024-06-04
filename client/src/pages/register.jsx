import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import NavBarComp from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import signup from "../services/index/userServices/users";
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../stores/reducers/userReducer";
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const RegisterPage = () => {
  
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: "onChange"
  });

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success(`Welcome ${data.message}`);
      dispatch(userAction.setUserInfo(data.user));
      localStorage.setItem('account', JSON.stringify(data.user));
      navigate("/");
     
    },
    onError: (error) => {
      toast.error(error.message);
     
    },
  });

  useEffect(() => {
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const submitHandler = (data) => {
    const { username, email, password } = data;
    setLoader(true)
    mutation.mutate({ username, email, password });
  };

  const [passwordToggle, setPasswordToggle] = useState(false);

  const passwordToggleHandler = () => {
    setPasswordToggle(prevState => !prevState);
  };

  return (
    <>
      <main className="h-screen">
        <NavBarComp/>
        <section className="flex justify-center items-center relative w-screen h-[90vh] bg-black">
        <img loading="lazy"
                  decoding='async'
                  fetchpriority='high'
                   src="https://i.pinimg.com/originals/9b/42/05/9b42059d8a17648c903c67979604dd76.gif"  
                   className="w-full rounded-lg h-full object-cover object-center  opacity-40 "/>
          <section className="flex absolute  flex-col gap-5 p-5 w-fit rounded-md bg-slate-300/40 dark:bg-slate-800/40 ">
          
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="w-[300px] md:w-[400px] transition-all duration-300 ease-linear backdrop-blur-sm "
            >
                <h2 className="text-2xl font-bold mb-4 text-slate-50">Register</h2>
              <div className="relative mb-1">
                <input
                  type="text"
                  {...register("username", {
                    minLength: {
                      value: 1,
                      message: "Username length must be at least 1 character",
                    },
                    required: {
                      value: true,
                      message: "Username is required",
                    },
                  })}
                  placeholder="Username"
                  className={`${
                    errors.username
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.username?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.username?.message}</p>
                )}
              </div>
              <div className="relative mb-1">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  placeholder="Email"
                  className={`${
                    errors.email
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.email?.message}</p>
                )}
              </div>
              <div className="relative mb-1">
                <input
                  type={passwordToggle ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "Password length must be at least 8 characters",
                    },
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    validate: {
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) || "Password must have at least one uppercase letter",
                      hasNumber: (value) =>
                        /\d/.test(value) || "Password must have at least one number",
                      hasSpecialChar: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must have at least one special character",
                    },
                  })}
                  className={`${
                    errors.password
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                <span
                  className="absolute right-2 top-[15%] cursor-pointer"
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
              <div className="relative mb-1">
                <input
                  type={passwordToggle ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirm_password", {
                    required: "Confirm Password is required",
                    validate: (value) => value === password || "Your passwords do not match",
                  })}
                  className={`${
                    errors.confirm_password
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.confirm_password?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.confirm_password?.message}</p>
                )}
              </div>

              <div>
                <Link
                  to="/forgotPassword"
                  className="text-sm invisible text-blue-500 dark:text-blue-300 hover:underline mb-0.5"
                >
                  Forgot password?
                </Link>
                <p className="my-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-sm text-blue-500 hover:underline mt-4 dark:text-blue-300"
                  >
                    Login
                  </Link>
                </p>
              </div>
              {mutation.isLoading ? <Button disabled className="w-full px-6 py-2 font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button> :  <Button type="submit" disabled={!isValid || mutation.isLoading} className="disabled:opacity-70 px-6 py-2 w-full fontbold   transition-all duration-300   uppercase">
                Register
              </Button>}
            </form>
          </section>
        </section>
      </main>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default RegisterPage;
