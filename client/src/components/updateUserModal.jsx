import { useState, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { LiaUserPlusSolid } from "react-icons/lia";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import updateUserProfile from "../services/index/userServices/updateUser";
import getUserData from "../services/index/userServices/getUserData";
import { userAction } from "../stores/reducers/userReducer";
import CropEasyProfilePic from "./cropped/CorpEasyProfilePic"
import CropEasyBannerPic from "./cropped/CorpEasyBannerPic"
import { createPortal } from "react-dom";
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const UpdateUserModal = ({setOpenEditModal}) => {
  const [openCropProfilePic, setOpenCropProfilePic] = useState(false);
  const [openCropBannerPic, setOpenCropBannerPic] = useState(false);
  const[bannerPhoto, setBannerPhoto] = useState(null);
  const[profilePhoto, setProfilePhoto] = useState(null);


  const [selectedBannerImg, setSelectedBannerImg] = useState();
 
 
  const [selectedProfileImg, setSelectedProfileImg] = useState();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryFn: () => getUserData(user.userInfo.token, user.userInfo._id),
    queryKey: ["user", user.userInfo._id]
  });


  const { register, handleSubmit, formState: { errors  } } = useForm({
    defaultValues: {
      username: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (userData) => {
      toast.success(`Profile updated successfully`);
      console.log(userData);
      dispatch(userAction.setUserInfo(userData.user));
      queryClient.invalidateQueries(["user"])
      localStorage.setItem('account',JSON.stringify(userData.user))
      console.log("User registered successfully:", userData.user);
      
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
     
    },
  });

  const closeModal =()=>{
    setOpenEditModal(false)
    document.body.classList.remove('overflow-hidden');
  }
  const submitHandler = (userData) => {
    const { username, email, bio } = userData;


    mutation.mutate({ userData, token: user.userInfo.token });
  };

  useEffect(() => {
    if (!user.userInfo) {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (userQuery.isError) {
      toast.error("Error getting user data");
    }
  }, [userQuery.isError]);

  const removeBannerImg = () => {
    setSelectedBannerImg(undefined);
  };

  const removeProfileImg = () => {
    setSelectedProfileImg(undefined);
  };

  return (
    <>
  {openCropProfilePic && createPortal(<CropEasyProfilePic photo={profilePhoto}  setOpenCropProfilePic={setOpenCropProfilePic}  setSelectedProfileImg={setSelectedProfileImg} />,document.getElementById("portal")) }
    {openCropBannerPic && createPortal(<CropEasyBannerPic photo={bannerPhoto} setOpenCropBannerPic={setOpenCropBannerPic} setSelectedBannerImg={setSelectedBannerImg}/>,document.getElementById("portal")) }



    <section className=" w-dvw h-dvh backdrop-blur-md   fixed top-0 left-0 z-[100] "> 

    <section className="relative">


      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 ">
      <form onSubmit={handleSubmit(submitHandler)} className="scale-[0.9] md:p-3 p-3 dark:bg-slate-800 bg-slate-300 min-w-[400px] max-w-full md:w-fit rounded-lg ">
        <section className="flex justify-between mb-2 items-center w-full">
          <span className="flex gap-4 items-center">
            <button
            onClick={closeModal}
              className="w-fit h-fit rounded-full text-2xl hover:scale-105 transition-all duration-300 ease-linear hover:bg-red-500 z-20"
              type="button"
            >
              <IoClose />
            </button>
            <h1 className="font-bold text-lg">Edit Profile</h1>
          </span>
          {mutation.isLoading ? <Button disabled className="px-3 py-[0.5px]font-bold">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Saving
    </Button> :  <Button type="submit" size="sm" disabled={mutation.isLoading} className="disabled:opacity-70 px-5 py-[0.5px]  transition-all duration-300 capitalize">
                Save
              </Button>}
        </section>
        <section className="mb-2">
          <section className="relative">
            <div className="flex items-center justify-center w-full md:w-[400px]">
              <label
                htmlFor="dropzone-banner"
                className="flex flex-col items-center justify-center w-full border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Click to upload banner</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <input
                  id="dropzone-banner"
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedBannerImg(file ? URL.createObjectURL(file) : undefined);
                    setBannerPhoto({url:URL.createObjectURL(file),file})
                    setOpenCropBannerPic(true)
                    
                  }}
                />
              </label>
            </div>
            {selectedBannerImg && (
              <>
                <button
                  className="absolute w-fit h-fit bg-white rounded-full -top-2 -left-2 text-2xl hover:scale-105 transition-all duration-300 ease-linear text-red-500 z-20"
                  onClick={removeBannerImg}
                  type="button"
                >
                  <IoMdCloseCircle />
                </button>
                <div className="w-full md:w-[400px] h-[140px] border absolute p-1 bottom-0 rounded-lg">
                  <img
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                    src={selectedBannerImg}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            )}
          </section>
        </section>
        <section>
          <section className="relative mb-2">
            <div className="flex items-center justify-center h-[120px] w-[120px] rounded-full">
              <label
                htmlFor="dropzone-profile"
                className="flex flex-col items-center justify-center h-[120px] w-[120px] border-2 border-slate-300 border-dashed rounded-full cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-600"
              >
                <div className="flex flex-col items-center justify-center rounded-full text-4xl text-slate-400">
                  <LiaUserPlusSolid />
                </div>
                <input
                  id="dropzone-profile"
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedProfileImg(file ? URL.createObjectURL(file) : undefined);
                    setProfilePhoto({url:URL.createObjectURL(file),file})
                    setOpenCropProfilePic(true)
                  }}
                />
              </label>
            </div>
            {selectedProfileImg && (
              <>
                <button
                  className="absolute w-fit h-fit bg-white rounded-full scale-90 top-1 left-0 text-2xl hover:scale-100 transition-all duration-300 ease-linear text-red-500 z-20"
                  onClick={removeProfileImg}
                  type="button"
                >
                  <IoMdCloseCircle />
                </button>
                <div className="h-[120px] w-[120px] border absolute p-1 bottom-0 rounded-full">
                  <img
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                    src={selectedProfileImg}
                    alt="Selected"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </>
            )}
          </section>
          <section>
            <div className="flex flex-col gap-2 md:w-[400px] w-full mb-2">
              <label htmlFor="username" className="capitalize">Username</label>
              <input
                type="text"
                {...register("username")}
                placeholder={userQuery.data?.user.username || "Username"}
                className={`mb-2 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>
            <div className="flex flex-col gap-2 md:w-[400px] w-full mb-2">
              <label htmlFor="email" className="capitalize">Email</label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Please enter a valid email",
                  },
                })}
                placeholder={userQuery.data?.user.email || "Email"}
                className={`mb-2 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
              />
              {errors.email?.message && (
                  <p className="text-red-500 text-xs mt-1 mb-4">{errors.email?.message}</p>
                )}
            </div>
            <div className="flex flex-col gap-2 md:w-[400px] w-full">
              <label htmlFor="bio" className="text-base md:text-lg capitalize">Bio</label>
              <textarea
                {...register("bio")}
                placeholder={userQuery.data?.user.bio || "Bio"}
                className={`mb-2 resize-none h-24 border-slate-700 focus:border-slate-900 dark:border-slate-800 w-full rounded border placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300 dark:bg-slate-600 px-3 py-1.5 focus:outline-0 transition-all duration-300 ease-linear`}
              ></textarea>
              {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
            </div>
          </section>
        </section>
      </form>
      </div>
    
    </section>

    
    </section>
      
      <Toaster richColors position="top-right" expand={true} closeButton />
    </>
  );
};

export default UpdateUserModal;
