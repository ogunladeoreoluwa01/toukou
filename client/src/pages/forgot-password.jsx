import { IoClose } from "react-icons/io5";
import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import forgotOTPCode from '../services/index/userServices/forgotOTP.js'
import forgotPasswordService from '../services/index/userServices/forgotPassword'; // Renamed to avoid name clash with the component

// Schema for form validation
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  newPassword: z.string().min(1, {
    message: "Password length must be at least 1 character.",
  }),
});

const ForgotPassword = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [gotOTP, setGOTOTP] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
      newPassword: "",
    },
  });

  // Mutation for getting OTP code
  const { mutate: getNewCode, isLoading: gettingNewCode } = useMutation({
    mutationFn: () => forgotOTPCode(userInfo),
    onSuccess: () => {
      toast.success('Verification OTP sent to your email');
      setGOTOTP(true);
    },
    onError: (error) => {
      try {
        const errormsg = JSON.parse(error.message);
        toast.error(errormsg.errorMessage);
        handleError(errormsg);
      } catch (parseError) {
        toast.error("An unexpected error occurred");
      }
    },
  });

  // Error handling function
  const handleError = (error) => {
    if (error.errorCode === 403) {
      navigate("/error-403");
    } else if (error.errorCode === 411) {
      toast.warning("User already verified");
    } else if (error.errorCode === 452) {
      navigate("/user-is-disabled");
    } else if (error.errorCode === 451) {
      navigate("/user-is-ban");
    } else if (error.errorCode === 500) {
      navigate("/oops");
    }
  };

  // Mutation for verifying OTP and changing password
  const { mutate: forgotPassword, isLoading: verifying } = useMutation({
    mutationFn: ({ userInfo, pin, newPassword }) => forgotPasswordService(userInfo, pin, newPassword),
    onSuccess: () => {
      toast.success('Password change successful');
      navigate("/login");
    },
    onError: (error) => {
      try {
        const errormsg = JSON.parse(error.message);
        toast.error(errormsg.errorMessage);
        console.log(errormsg)
        handleError(errormsg);
      } catch (parseError) {
        toast.error("An unexpected error occurred");
      }
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
     console.log("Submitting with:", userInfo, data.pin, data.newPassword);
    forgotPassword({ userInfo:userInfo, pin: data.pin, newPassword: data.newPassword });

console.log("Form values:", form.getValues());
  };

  return (
    <>
    <h1>this is not working for now click the link to go home <Link to="/">home</Link>  </h1> 
      <section className="w-dvw h-dvh backdrop-blur-md fixed top-0 left-0 z-[100]">
        <section className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] md:translate-y-[40%]">
            <section className="md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-h-[300px] min-w-[350px] max-w-full md:w-fit rounded-lg">
              <section className="mx-4">
                {gotOTP ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                      <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormControl>
                              <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} className="bg-slate-400 h-11 w-11 text-slate-950" />
                                  <InputOTPSlot index={1} className="bg-slate-400 h-11 w-11 text-slate-950" />
                                  <InputOTPSlot index={2} className="bg-slate-400 h-11 w-11 text-slate-950" />
                                  <span className="w-3 h-[0.7px] mx-1 bg-slate-400"></span>
                                  <InputOTPSlot index={3} className="bg-slate-400 h-11 w-11 text-slate-950" />
                                  <InputOTPSlot index={4} className="bg-slate-400 h-11 w-11 text-slate-950" />
                                  <InputOTPSlot index={5} className="bg-slate-400 h-11 w-11 text-slate-950" />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormDescription>
                              Please enter the one-time password sent to your phone.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <input
                                type="password"
                                placeholder="New Password"
                                {...field}
                                className="mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border w-full rounded placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {verifying ? (
                        <Button disabled size="sm" className="w-full">
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Verifying
                        </Button>
                      ) : (
                        <Button type="submit" size="sm" className="w-full">
                          Verify
                        </Button>
                      )}
                      <section className="mt-0 my-2">
                        <FormDescription className="mt-0">
                          Didn't get the verification code?
                        </FormDescription>
                      </section>
                    </form>
                     {gettingNewCode ? (
                      <Button disabled size="sm" className="mt-2 w-full">
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Getting OTP Code
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => getNewCode()} className="my-2 w-full">
                        Get OTP Code
                      </Button>)}
                  </Form>
                ) : (
                  <div className="">
                    <div className="relative mb-1">
                      <input
                        type="text"
                        value={userInfo}
                        onChange={(e) => setUserInfo(e.target.value)}
                        placeholder="User Info"
                        className="mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border w-full rounded placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear"
                      />
                    </div>
                    {gettingNewCode ? (
                      <Button disabled size="sm" className="mt-2 w-full">
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Getting OTP Code
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => getNewCode()} className="my-2 w-full">
                        Get OTP Code
                      </Button>
                    )}
                  </div>
                )}
              </section>
            </section>
          </div>
        </section>
      </section>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default ForgotPassword;
