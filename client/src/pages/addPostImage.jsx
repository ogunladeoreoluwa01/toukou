
import { Toaster } from 'sonner';
import { useSelector } from "react-redux";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate,useParams } from "react-router-dom";
import CropEasyPostPic from "../components/cropped/cropEasyPostUpload"
import NavBarComp from "../components/NavBar";
import Footer from '@/components/footer';



const AddPostImage = () => {
    const { postId } = useParams();
    const [openCropPostPic, setOpenCropPostPic] = useState(false);
    const [postPhoto, setPostPhoto] = useState(null);
    const [selectedPostImg, setSelectedPostImg] = useState();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (postId) {
          console.log(postId);
        }
      }, [navigate, postId]);
    
      useEffect(() => {
        if (!user.userInfo) {
          navigate("/");
        }
      }, [navigate, user]);
    
    const doneButtonHandler=  () =>{
        navigate("/");
    }
      const removePostImg = () => {
        setSelectedPostImg(undefined);
      };
    return ( <>
      {openCropPostPic && createPortal(<CropEasyPostPic photo={postPhoto} postId={postId} setOpenCropPostPic={setOpenCropPostPic} setSelectedPostImg={setSelectedPostImg}/>, document.getElementById("portal"))}
     
     
      <main className="h-screen relative">
<div className="relative z-[10000]">
<NavBarComp />
</div>

    
  
                <img
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                    src="https://i.pinimg.com/originals/79/28/79/7928798bbdeda1d1cb82adb1f14e99cf.gif"
                    className="w-full h-full object-cover object-center opacity-30"
                />
                <section className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-50">
                    <section className="flex flex-col gap-5 md:p-5 mx-2 w-full  rounded-md bg-slate-300/80 dark:bg-slate-800/60">
                    <section  className=" md:p-3 p-3   w-full rounded-lg">
       
       <section className="flex justify-between mb-4 items-center w-full">
           <span className="flex gap-4 items-center">
             <h1 className="font-bold text-lg capitalize">Add Post Images</h1>
           </span>
         </section>


       <section className="relative mb-4">
           <div className="flex items-center justify-center w-full   ">
             <label
               htmlFor="dropzone-Post"
               className="flex flex-col items-center justify-center w-full border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-600"
             >
               <div className="flex flex-col items-center justify-center pt-5 pb-6 md:h-[200px]">
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
                   <span className="font-semibold">Click to upload Post</span>
                 </p>
                 <p className="text-xs text-slate-500 dark:text-slate-400">
                   SVG, PNG, JPG or GIF
                 </p>
               </div>
               <input
                 id="dropzone-Post"
                 type="file"
                 accept=".svg,.png,.jpg,.jpeg,.gif"
                 className="hidden"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   setSelectedPostImg(file ? URL.createObjectURL(file) : undefined);
                   setPostPhoto({url:URL.createObjectURL(file),file})
                   setOpenCropPostPic(true)
                   
                 }}
               />
             </label>
           </div>
           {selectedPostImg && (
             <>
               <button
                 className="absolute w-fit h-fit bg-white rounded-full -top-2 -left-2 text-2xl hover:scale-105 transition-all duration-300 ease-linear text-red-500 z-20"
                 onClick={removePostImg}
                 type="button"
               >
                 <IoMdCloseCircle />
               </button>
               <div className="w-full h-full border absolute p-1 bottom-0 rounded-lg">
                 <img
                   loading="lazy"
                   decoding="async"
                   fetchpriority="high"
                   src={selectedPostImg}
                   alt="Selected"
                   className="w-full h-full object-cover"
                 />
               </div>
             </>
           )}
         </section>
         
         <button onClick={doneButtonHandler}  type="submit" className="disabled:opacity-70 px-3 py-[0.5px] rounded-md font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900 bg-slate-900 text-slate-50 uppercase">
           Done
         </button>
       </section>
                    </section>
                </section>
            </main>
    <Footer/>
      <Toaster richColors position="top-right" expand={true} closeButton />
    
    
    </> );
}
 
export default AddPostImage;