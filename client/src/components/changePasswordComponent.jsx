import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import changePasswordFn from '../services/index/userServices/changePassword';
import { toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import resetPassword from '../stores/actions/passwordRetriesAction';
import resetOTP from "@/stores/actions/isOTPAction";
import resetForgotPassword from '@/stores/actions/forgotPasswordRetriesAction';
import logOut from '../stores/actions/userAction';
import { userAction } from "../stores/reducers/userReducer";
import { forgotPasswordRetriesAction } from "../stores/reducers/forgotPasswordRetriesReducer";

const ChangePasswordComponent = ({ setRegetOTP,setRegOTPCheck }) => {
  const user = useSelector(state => state.user);
  const forgotPasswordTries = useSelector(state => state.forgotPasswordRetries);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [noTries, setNoTries] = useState(false);

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/");
    }
  }, [user.userInfo, navigate]);

  useEffect(() => {
    if (forgotPasswordTries.forgotPasswordRetriesCount <= 3) {
      setNoTries(false);
    }
    if (forgotPasswordTries.forgotPasswordRetriesCount <= 0) {
      dispatch(logOut());
      localStorage.removeItem('account');
      dispatch(resetPassword());
      localStorage.removeItem('passwordRetries');
      dispatch(resetForgotPassword());
      localStorage.removeItem('forgotPasswordRetries');
      dispatch(resetOTP());
            localStorage.removeItem('isOTP');
      navigate("/login");
    }
  }, [forgotPasswordTries.forgotPasswordRetriesCount, dispatch, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      OTPCode: "",
      oldPassword: "",
      newPassword: "",
    },
    mode: "onChange",
  });

  const resetPasswordRetriesCountHandler = () => {
    dispatch(resetPassword());
      localStorage.removeItem('passwordRetries');
      dispatch(resetForgotPassword());
      localStorage.removeItem('forgotPasswordRetries');
      dispatch(resetOTP());
      localStorage.removeItem('isOTP');
  };

  const mutation = useMutation({
    mutationFn: changePasswordFn,
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      resetPasswordRetriesCountHandler();
      dispatch(userAction.setUserInfo(data.user));
      localStorage.setItem('account', JSON.stringify(data.user));
      navigate("/");
    },
    onError: (error) => {
      try {
        const errormsg = JSON.parse(error.message);
        console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
        toast.error(errormsg.errorMessage);

        if (errormsg.errorCode === 410) {
          let newCount = forgotPasswordTries.forgotPasswordRetriesCount - 1;
          dispatch(forgotPasswordRetriesAction.setForgotPasswordRetriesCount(newCount));
          localStorage.setItem('forgotPasswordRetries', JSON.stringify(newCount));
          console.log(newCount);
        } else if (errormsg.errorCode === 403) {
          navigate("/error-403");
        } else if (errormsg.errorCode === 452) {
          navigate("/user-is-disabled");
        }
        else if (errormsg.errorCode === 412) {
          setTimeout(async () => {
      regetOtpHandler()
    },3000);
        }  
        else if (errormsg.errorCode === 451) {
          navigate("/user-is-ban");
        } else if (errormsg.errorCode === 500) {
          navigate("/oops");
        }
      } catch (parseError) {
        console.error("Error parsing error message:", parseError);
        toast.error("An unexpected error occurred");
      }
    }
  });

  const submitHandler = (data) => {
    const { OTPCode, oldPassword, newPassword } = data;
    mutation.mutate({ OTPCode, oldPassword, newPassword, token: user.userInfo.token });
  };

  const [passwordToggle, setPasswordToggle] = useState(false);

  const passwordToggleHandler = () => {
    setPasswordToggle(prevState => !prevState);
  };

  const regetOtpHandler = () => {
    setRegOTPCheck(prevState => !prevState)
    setRegetOTP(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)} className="w-[300px] md:w-[400px] transition-all duration-300 ease-linear backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-slate-50">Changing {user.userInfo.username}'s Password</h2>
        <div className="relative mb-1">
          <input
            type="text"
            {...register("OTPCode", {
              minLength: {
                value: 6,
                message: "OTP code must be 6 characters",
              },
              maxLength: {
                value: 6,
                message: "OTP code must be 6 characters",
              },
              required: {
                value: true,
                message: "OTP code required",
              },
            })}
            placeholder="OTP"
            className={`${errors.OTPCode ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
          />
          {errors.OTPCode?.message && (
            <p className="text-red-500 text-xs mt-1 mb-4">{errors.OTPCode?.message}</p>
          )}
        </div>
        <div className="relative mb-1">
          <input
            type={passwordToggle ? "text" : "password"}
            placeholder="Old Password"
            {...register("oldPassword", {
              minLength: {
                value: 1,
                message: "Password length must be at least 1 character",
              },
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            className={`${errors.oldPassword ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
          />
          <span
            className="absolute right-2 top-[15%] md:top-[15%] cursor-pointer"
            onClick={passwordToggleHandler}
          >
            {passwordToggle ? (
              <FaEyeSlash className="text-slate-900 dark:text-slate-400 text-2xl" />
            ) : (
              <FaEye className="text-slate-900 dark:text-slate-400 text-2xl" />
            )}
          </span>
          {errors.oldPassword?.message && (
            <p className="text-red-500 text-xs mt-1 mb-4">{errors.oldPassword?.message}</p>
          )}
        </div>
        <div className="relative mb-1">
          <input
            type={passwordToggle ? "text" : "password"}
            placeholder="New Password"
            {...register("newPassword", {
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
            className={`${errors.newPassword ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
          />
          {errors.newPassword?.message && (
            <p className="text-red-500 text-xs mt-1 mb-4">{errors.newPassword?.message}</p>
          )}
        </div>
        {mutation.isLoading ? (
          <Button size="sm" disabled className="w-full px-6 py-2 font-bold">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || mutation.isLoading || noTries}
            className="px-6 py-2 w-full uppercase"
          >
            Submit
          </Button>
        )}
        <p className="mt-2 mb-1">Didn't get the OTP code?</p>
        <Button
          onClick={regetOtpHandler}
          size="sm"
          disabled={mutation.isLoading || noTries}
          className="px-6 py-2 w-full uppercase"
        >
          Resend OTP
        </Button>
      </form>
    </>
  );
};

export default ChangePasswordComponent;
