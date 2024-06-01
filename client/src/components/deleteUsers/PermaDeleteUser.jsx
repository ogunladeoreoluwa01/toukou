import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import { userAction } from "../../stores/reducers/userReducer";
import permaDeleteUser from "../../services/index/userServices/permaDeleteUser";

const PermaDeleteByUser = () => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [isSure, setIsSure] = useState(false); // State to manage the checkbox
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: permaDeleteUser,
    onSuccess: () => {
      toast.success('Oh, we\'re sad to see you leave. Hope you come back soon.');
      dispatch(userAction.resetUserInfo());
      queryClient.invalidateQueries(["user"]);
      localStorage.removeItem('account');
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const passwordToggleHandler = () => {
    setPasswordToggle(prevState => !prevState);
  };

  const submitHandler = (deleteData) => {
    const { password } = deleteData;
    mutation.mutate({ token: user.userInfo.token, deleteData });
  };

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)} >
        <section>
          <div className="flex flex-col gap-2 md:w-[400px] w-full mb-2">
            <label htmlFor="password" className="capitalize">Password</label>
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
                className={`${errors.password ? "border-red-500 border" : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : null}
              />
              <span
                className="absolute right-2 top-[15%] md:top-[15%] cursor-pointer"
                onClick={passwordToggleHandler}
                aria-label="Toggle Password Visibility"
              >
                {passwordToggle ? (
                  <FaEyeSlash className="text-slate-900 dark:text-slate-400 text-2xl" />
                ) : (
                  <FaEye className="text-slate-900 dark:text-slate-400 text-2xl" />
                )}
              </span>
              {errors.password?.message && (
                <p id="password-error" className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
              )}
            </div>
          </div>
        </section>
        <div className="mt-4  flex gap-1 items-baseline accent-red-500 ">
          <input 
            type="checkbox" 
            id="confirmDelete" 
            checked={isSure} 
            onChange={() => setIsSure(prev => !prev)} 
          />
          <label htmlFor="confirmDelete" className="ml-2  text-justify md:w-[350px] ">Are you sure you want to delete your account permanently?</label>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="disabled:opacity-70 flex gap-2 items-center transition-all duration-300 ease-linear bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            disabled={mutation.isLoading || !isSure}
          >
            <span className="text-xl"><MdOutlineDelete /></span>
            {mutation.isLoading ? "Processing..." : "Delete Account"}
          </button>
        </div>
      </form>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default PermaDeleteByUser;
