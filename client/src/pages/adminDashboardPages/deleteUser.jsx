
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import {useSelector } from "react-redux";
import deleteUser from "../../services/index/userServices/deletebyAdmin"; 
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Correct import for deleteUser service

const DeleteUserBySupAdmin = () => {
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn:({ token, username }) => deleteUser(token, {username}), // Correct service function call
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["user"]);
      
      console.log(user.userInfo.token)
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
    const { username } = data;
    console.log(user.userInfo.token)
    mutation.mutate( {token:user.userInfo.token, username  });
  };

  return (
    <>
      <section>
        <form onSubmit={handleSubmit(submitHandler)} className="scale-[0.9] md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-w-[300px] max-w-full md:w-[600px] rounded-lg">
          <section className="flex justify-between mb-3 items-center w-full">
            <span className="flex gap-4 items-center">
              <h1 className="font-bold text-lg">Delete User</h1>
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

           { mutation.isLoading ? <Button variant="destructive" size="sm" disabled className="w-full px-6 py-2 font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button> :  <Button variant="destructive"  type="submit" size="sm" disabled={ mutation.isLoading } className=" px-6 py-2 w-full uppercase">
               Delete User
              </Button>}
        </form>
      </section>

      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default DeleteUserBySupAdmin;
