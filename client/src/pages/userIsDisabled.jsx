import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../stores/reducers/userReducer";
import reactivateUser from "../services/index/userServices/reactivateUser";
import { MdOutlineUndo } from "react-icons/md";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const UserIsDisabled = () => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      userInfo: "",
      password: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => {
      toast.success('Your account has been reactivated successfully.');
        dispatch(userAction.setUserInfo(data.user));
        localStorage.setItem('account', JSON.stringify(data.user));
        console.log("User  reactivated successfully:", data.user);
      queryClient.invalidateQueries(["user"]);
      navigate("/");
    },
    onError: (error) => {
    try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      toast.error(errormsg.errorMessage); // Displaying the error message using toast

       if (errormsg.errorCode === 403) {
        navigate("/error-403");
      
      } else if (errormsg.errorCode === 500) {
        navigate("/oops");
      } 
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
      toast.error("An unexpected error occurred");
    }
  }
});

  const passwordToggleHandler = () => {
    setPasswordToggle(prevState => !prevState);
  };

  const submitHandler = (data) => {
    const { userInfo, password } = data;
    mutation.mutate({ token: user.userInfo.token, userInfo,password});
  };
useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);
  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <>
<main className="h-screen w-full flex flex-col justify-center items-center">


    <div className="flex flex-col items-center justify-center">
<h1 className="text-5xl font-extrabold  capitalize">Reativate Account </h1>
                
 <form onSubmit={handleSubmit(submitHandler)} >
        <section>
          <div className="flex flex-col gap-2 md:w-[400px] w-full mb-2">
            <label htmlFor="userInfo" className="capitalize">Username or Email</label>
            <input
              type="text"
              placeholder="Username or Email"
              {...register("userInfo", {
                minLength: {
                  value: 1,
                  message: "Username or Email must be at least 1 character",
                },
                required: {
                  value: true,
                  message: "Username or Email is required",
                },
              })}
              className={`${errors.userInfo ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
              aria-invalid={errors.userInfo ? "true" : "false"}
              aria-describedby={errors.userInfo ? "userInfo-error" : null}
            />
            {errors.userInfo?.message && (
              <p id="userInfo-error" className="mt-1 text-xs text-red-500">{errors.userInfo?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 md:w-[400px] w-full mb-2">
            <label htmlFor="userPassword" className="capitalize">Password</label>
            <div className="relative">
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
                className={`${errors.userPassword ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                aria-invalid={errors.userPassword ? "true" : "false"}
                aria-describedby={errors.userPassword ? "userPassword-error" : null}
              />
              <span
                className="absolute right-2 top-[15%] md:top-[15%] cursor-pointer"
                onClick={passwordToggleHandler}
                aria-label="Toggle Password Visibility"
              >
                {passwordToggle ? (
                  <FaEyeSlash className="text-2xl text-slate-900 dark:text-slate-400" />
                ) : (
                  <FaEye className="text-2xl text-slate-900 dark:text-slate-400" />
                )}
              </span>
              {errors.userPassword?.message && (
                <p id="userPassword-error" className="mt-1 text-xs text-red-500">{errors.userPassword?.message}</p>
              )}
            </div>
          </div>
        </section>
        <div className="flex justify-end mt-4 md:w-[400px] w-full">
          {mutation.isLoading ? (
            <Button disabled size="sm" className="w-full px-6 py-2 font-bold">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" size="sm" variant="destructive" disabled={!isValid || mutation.isLoading} className="px-6 py-2 w-full uppercase flex items-center gap-2">
              <span className="text-xl"><MdOutlineUndo /></span>
              Reactivate
            </Button>
          )}
        </div>
      </form>
    </div>
 


</main>
     
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default UserIsDisabled;
