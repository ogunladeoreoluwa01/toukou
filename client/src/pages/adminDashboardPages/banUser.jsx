
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import {  useSelector } from "react-redux";
import banUser from "../../services/index/userServices/banUser";
import { Button } from "@/components/ui/button";

const BanUser = () => {
  const user = useSelector((state) => state.user);
  const navigate =useNavigate()
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
    try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      toast.error(errormsg.errorMessage); // Displaying the error message using toast

     if (errormsg.errorCode === 403) {
        navigate("/error-403");
      } else if (errormsg.errorCode === 452) {
        navigate("/user-is-disabled");
        } else if (errormsg.errorCode === 451) {
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

          { mutation.isLoading ? <Button size="sm" disabled className="w-full px-6 py-2 font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button> :  <Button  type="submit" size="sm" disabled={ mutation.isLoading } className=" px-6 py-2 w-full uppercase">
                Ban User
              </Button>}
        </form>
      </section>

      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default BanUser;
