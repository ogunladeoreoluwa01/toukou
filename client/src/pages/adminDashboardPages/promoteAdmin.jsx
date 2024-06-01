import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useSelector } from "react-redux";
import makeAdmin from "../../services/index/userServices/makeAdmin"; // Correct import for makeAdmin service

const MakeAdmin = () => {
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: ({ token, username }) => makeAdmin(token, { username }), // Correct service function call
    onSuccess: () => {
      toast.success("User made admin successfully");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitHandler = (data) => {
    const { username } = data;
    mutation.mutate({ token: user.userInfo.token, username });
  };

  return (
    <>
      <section>
        <form onSubmit={handleSubmit(submitHandler)} className="scale-[0.9] md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-w-[300px] max-w-full md:w-[600px] rounded-lg">
          <section className="flex justify-between mb-3 items-center w-full">
            <span className="flex gap-4 items-center">
              <h1 className="font-bold text-lg">Make Admin</h1>
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
          </section>

          <button disabled={mutation.isLoading} type="submit" className="disabled:opacity-70 px-3 py-[0.5px] rounded-md font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
            Make Admin
          </button>
        </form>
      </section>

      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default MakeAdmin;
