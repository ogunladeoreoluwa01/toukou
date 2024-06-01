import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { LiaUserPlusSolid } from "react-icons/lia";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import banUser from "../../services/index/userServices/banUser";

const BanUser = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      banDuration: "",
      banReason: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: ({ token, username, banReason, banDuration }) => banUser(token, { username, banReason, banDuration }),
    onSuccess: () => {
      toast.success("User banned successfully");
      queryClient.invalidateQueries(["user"]);
      // Optionally navigate to another page
      // navigate("/some-path");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitHandler = (data) => {
    const { username, banReason, banDuration } = data;
    mutation.mutate({ token: user.userInfo.token, username, banReason, banDuration });
  };

  return (
    <>
      <section>
        <form onSubmit={handleSubmit(submitHandler)} className="scale-[0.9] md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-w-[300px] max-w-full md:w-[600px] rounded-lg">
          <section className="flex justify-between mb-3 items-center w-full">
            <span className="flex gap-4 items-center">
              <h1 className="font-bold text-lg">Ban User</h1>
            </span>
          </section>

          <section>
            <div className="flex flex-col gap-2 w-full mb-3">
              <label htmlFor="username" className="capitalize">Username</label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                placeholder="Username"
                className="mb-3 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear"
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-2 w-full mb-3">
              <label htmlFor="banDuration" className="capitalize">Ban Duration</label>
              <select
                {...register("banDuration", { required: "Ban Duration is required" })}
                className="mb-3 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear"
              >
                <option value="">Select duration</option>
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
                <option value="1m">1 Month</option>
                <option value="indefinite">Indefinite</option>
              </select>
              {errors.banDuration && <p className="text-red-500">{errors.banDuration.message}</p>}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="banReason" className="text-base md:text-lg capitalize">Ban Reason</label>
              <textarea
                {...register("banReason", { required: "Ban Reason is required" })}
                placeholder="Ban Reason"
                className="mb-3 resize-none h-24 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear"
              ></textarea>
              {errors.banReason && <p className="text-red-500">{errors.banReason.message}</p>}
            </div>
          </section>

          <button disabled={mutation.isLoading} type="submit" className="disabled:opacity-70 px-3 py-[0.5px] rounded-md font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
            Ban User
          </button>
        </form>
      </section>

      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default BanUser;
