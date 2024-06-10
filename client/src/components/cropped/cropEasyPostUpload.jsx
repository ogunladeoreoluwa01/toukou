import Cropper from "react-easy-crop";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import getCroppedImg from "./cropimage";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from 'sonner';
import {useSelector } from "react-redux";
import { HiOutlineSave } from "react-icons/hi";
import uploadPostPic from "../../services/index/postServices/uploadPostPic";
import { useNavigate } from "react-router-dom";

const CropEasyPost = ({ photo, setOpenCropPostPic, setSelectedPostImg,postId }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const user = useSelector((state) => state.user);
    const navigate =useNavigate()
const queryClient = useQueryClient()
    const token = user.userInfo.token;
    const mutation = useMutation({
        mutationFn: ({ token, formData,postId}) => {
            return uploadPostPic({
                token,
                formData,
                postId,
            });
        },
        onSuccess: () => {
            toast.success('post updated successfully');
            setOpenCropPostPic(false)
             queryClient.invalidateQueries(["post"])
            setTimeout(() => {
                setSelectedPostImg(null)
            }, 3500);
            

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
            
            setTimeout(() => {
                setOpenCropPostPic(false)
                setSelectedPostImg(null)
            }, 2000);
        },
    });

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropImage = async () => {
        try {
            const croppedImg = await getCroppedImg(photo?.url, croppedAreaPixels);
            const file = new File([croppedImg.file], photo?.file?.name, { type: photo?.file?.type });

            const formData = new FormData();
            formData.append("image", file);
            mutation.mutate({ token, formData, postId });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            
            <div className="fixed z-[1000] inset-0 backdrop-blur-sm flex justify-center items-center flex-col overflow-auto">
                <div className="dark:bg-slate-800 bg-slate-300  h-fit w-full sm:max-w-[350px] p-5 rounded-lg">
                    <h2 className="my-2 text-lg font-bold">Crop Image</h2>
                    <div className="z-20 relative w-full aspect-square rounded-lg overflow-hidden">
                    <Cropper
                        image={photo?.url}
                        crop={crop}
                        zoom={zoom}
                        aspect={16/9}
                        onZoomChange={setZoom}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                    />
                    </div>
                   
                    <label htmlFor="zoomRange" className="block mt-2 mb-0.5 text-sm font-medium">
                        Zoom: {`${Math.round(zoom * 100)}%`}
                    </label>
                    <input
                        type="range"
                        id="zoomRange"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                        className="w-full h-1 mb-6 accent-blue-600 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between items-center p-3 gap-2 flex-wrap">
                    <button
                       onClick={() => {
                        setOpenCropPostPic(false);
                        setTimeout(() => {
                            setSelectedPostImg(null);
                        }, 2000);
                    }}
                        disabled={mutation.isLoading}
                        type="submit"
                        className="flex bg-red-500 items-center justify-center gap-1  hover:bg-red-600 hover:scale-105 disabled:opacity-70 px-3 py-2 rounded-md font-bold   transition-all duration-300   text-slate-50 uppercase"
                    >
                        <span className="text-2xl"><IoClose /></span>
                         
                        Cancel
                    </button>
                    <button
                        onClick={handleCropImage}
                        disabled={mutation.isLoading}
                        type="submit"
                        className="disabled:opacity-70 flex  items-center justify-center gap-1 px-5 py-2 rounded-md font-bold transition-all duration-300 hover:bg-emerald-500 hover:scale-105  bg-emerald-400 text-slate-50 uppercase"
                    >
                        <span className="text-2xl"><HiOutlineSave/></span>
                        Save
                    </button>
                </div>
                </div>
                
                
            </div>
            <Toaster richColors position="top-right" expand={true} closeButton />
        </>
    );
};

export default CropEasyPost;
