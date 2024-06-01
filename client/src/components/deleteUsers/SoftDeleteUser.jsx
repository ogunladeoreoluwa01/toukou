import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../stores/reducers/userReducer";
import softDeleteUser from "../../services/index/userServices/softDeleteUser";
import { RiUserForbidFill } from "react-icons/ri";

const SoftDeleteByUser = () => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
      deleteReason: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: softDeleteUser,
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
    const { password, deleteReason } = deleteData;
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
          <div className="flex flex-col gap-2 md:w-[400px] w-full">
            <label htmlFor="deleteReason" className="text-base md:text-lg capitalize">Delete Reason</label>
            <textarea
              {...register("deleteReason", {
                minLength: {
                  value: 1,
                  message: "Delete Reason length must be at least 1 character",
                }
              })}
              placeholder="Delete Reason"
              className={`mb-2 resize-none h-24 ${errors.deleteReason ? "border-red-500 border" : "border-slate-700 focus:border-slate-900 dark:border-slate-800"} w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
              aria-invalid={errors.deleteReason ? "true" : "false"}
              aria-describedby={errors.deleteReason ? "deleteReason-error" : null}
            ></textarea>
            {errors.deleteReason?.message && (
              <p id="deleteReason-error" className="text-red-500 text-xs mt-1">{errors.deleteReason?.message}</p>
            )}
          </div>
        </section>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="disabled:opacity-70 flex gap-2 items-center transition-all duration-300 ease-linear bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            disabled={mutation.isLoading}
          >
            <span className="text-xl"><RiUserForbidFill /></span>
            {mutation.isLoading ? "Processing..." : "Disable"}
          </button>
        </div>
      </form>
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default SoftDeleteByUser;
