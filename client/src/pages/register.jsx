import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import NavBarComp from "../components/NavBar";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const SubmitHandler = (data) => {
    console.log(data);
  };

  const [passwordToggle, setPasswordToggle] = useState(false);

  const PasswordToggle = () => {
    setPasswordToggle((prevState) => !prevState);
  };

  const password = watch("password");

  return (
    <>
      <main className="h-screen ">
        <NavBarComp />

        <section className="flex justify-center mx-auto mt-10 md:mt-20">
          <section className="flex flex-col gap-5 p-5 w-fit rounded-md bg-slate-300 dark:bg-slate-800">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form
              onSubmit={handleSubmit(SubmitHandler)}
              className="w-[300px] md:w-[400px] transition-all duration-300 ease-linear"
            >
              <div className="relative mb-1">
                <input
                  type="text"
                  {...register("username", {
                    minLength: {
                      value: 1,
                      message: "Username length must be at least 1 character",
                    },
                    required: {
                      value: true,
                      message: "Username is required",
                    },
                  })}
                  placeholder="Username"
                  className={`${
                    errors.username
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.username?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.username?.message}</p>
                )}
              </div>
              <div className="relative mb-1">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  placeholder="Email"
                  className={`${
                    errors.email
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.email?.message}</p>
                )}
              </div>
              <div className="relative mb-1">
                <input
                  type={passwordToggle ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
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
                  className={`${
                    errors.password
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                <span
                  className="absolute right-2 top-[15%]  md:top-[18%] cursor-pointer"
                  onClick={PasswordToggle}
                >
                  {passwordToggle ? (
                    <FaEyeSlash className="text-slate-900 dark:text-slate-400 text-2xl" />
                  ) : (
                    <FaEye className="text-slate-900 dark:text-slate-400 text-2xl" />
                  )}
                </span>
                {errors.password?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.password?.message}</p>
                )}
              </div>
              <div className="relative mb-1">
                <input
                  type={passwordToggle ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirm_password", {
                    required: true,
                    validate: (value) => value === password || "Your passwords do not match",
                  })}
                  className={`${
                    errors.confirm_password
                      ? "border-red-500 border"
                      : "mb-4 border-slate-700 focus:border-slate-900 dark:border-slate-800 border"
                  } w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
                />
                {errors.confirm_password?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.confirm_password?.message}</p>
                )}
              </div>

              <div>
                <Link
                  to="/forgotPassword"
                  className="text-sm invisible text-blue-500 dark:text-blue-300 hover:underline mb-0.5"
                >
                  Forgot password?
                </Link>
                <p className="my-4">
                  {" "}
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-sm text-blue-500 hover:underline mt-4 dark:text-blue-300"
                  >
                    Login
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                className="px-6 py-2 w-full rounded-md font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase"
              >
                Register
              </button>
            </form>
          </section>
        </section>
      </main>
    </>
  );
};

export default RegisterPage;
