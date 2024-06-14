import { IoClose } from "react-icons/io5";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import getVerificationCode from '../services/index/userServices/getVerifiedCode';
import VerifyOTP from '../services/index/userServices/verifyotp';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const GetVerifiedModal = ({ setOpenVerifiedModal }) => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { mutate: getNewCode, isLoading: gettingNewCode } = useMutation({
    mutationFn: () => getVerificationCode(user.userInfo.token),
    onSuccess: () => {
      toast.success('Verification OTP sent to your email');
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

  const handleError = (error) => {
    if (error.errorCode === 403) {
      navigate("/error-403");
    } else if (error.errorCode === 411) {
      toast.warning("user already verified")
    }
     else if (error.errorCode === 452) {
      navigate("/user-is-disabled");
    } else if (error.errorCode === 451) {
      navigate("/user-is-ban");
    } else if (error.errorCode === 500) {
      navigate("/oops");
    }
  };

  const { mutate: verifyOTP, isLoading: verifying } = useMutation({
    mutationFn: ({ token, pin }) => VerifyOTP(token, pin),
    onSuccess: () => {
      toast.success('Verification successful');
      queryClient.invalidateQueries("user")
      setOpenVerifiedModal(false);
      document.body.classList.remove('overflow-hidden');
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

  const onSubmit = (data) => {
    verifyOTP({ token: user.userInfo.token, pin:data.pin });
  };

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

  const closeModal = () => {
    setOpenVerifiedModal(false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <>
      <section className="w-dvw h-dvh backdrop-blur-md fixed top-0 left-0 z-[100]">
        <section className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] md:translate-y-[40%]">
            <section className="md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-h-[300px] min-w-[350px] max-w-full md:w-fit rounded-lg">
              <section className="flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-4">
                  <button
                    onClick={closeModal}
                    className="z-20 p-[0.5px] text-2xl transition-all duration-300 ease-linear rounded-full w-fit h-fit hover:scale-105 hover:bg-red-600"
                    type="button"
                  >
                    <IoClose />
                  </button>
                  <h1 className="text-2xl font-bold">Get Verified</h1>
                </span>
              </section>
              <section className="mx-4">
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
                </Form>
                {gettingNewCode ? (
                        <Button disabled size="sm" className="mt-2 w-full">
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Getting new Code
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => getNewCode()} className="my-2 w-full">
                          Get New Code
                        </Button>
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

export default GetVerifiedModal;
