import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useSelector } from 'react-redux';
import { createPortal } from "react-dom";
import { TbEditCircle } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import EditCommentModal from '@/components/editComment';
import DeleteCommentModal from '@/components/deleteComment';


const CommentCard = ({ comment,postAuthor}) => {
    const user = useSelector((state) => state.user);
    const [userCheckStyle, setUserCheckStyle] = useState("place-self-start");
    const [openCommentModal,setOpenCommentModal ] =useState(false)
     const [openCommentDeleteModal,setOpenCommentDeleteModal ] =useState(false)
      const [userCheck, setUserCheck] = useState(false);
    const [postOwner, setPostOwner] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  
   useEffect(() => {
    if (comment.author.username === user.userInfo.username) {
    setUserCheckStyle("place-self-end")
    setUserCheck(true)
    console.log(comment)
    
    }
  }, [comment.author.username,user.userInfo.username]);
   useEffect(() => {
    if (comment.author._id === postAuthor) {
    setPostOwner(true)
    }
  }, [comment.author.username,user.userInfo.username]);
  useEffect(() => {
    if (comment.updatedAt) {
      const dateObj = new Date(comment.updatedAt);
      const newYear = dateObj.getFullYear();
      const newMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(dateObj);
      const newDay = dateObj.getDate();
      setYear(newYear);
      setMonth(newMonth);

      // Add date acronyms (st, nd, rd, th) to the day
      let dayAcronym = "th";
      if (newDay === 1 || newDay === 21 || newDay === 31) {
        dayAcronym = "st";
      } else if (newDay === 2 || newDay === 22) {
        dayAcronym = "nd";
      } else if (newDay === 3 || newDay === 23) {
        dayAcronym = "rd";
      }
      setDay(`${newDay}${dayAcronym}`);
    }
  }, [comment.updatedAt]);


  const openCommentEditModal = () => {
    setOpenCommentModal(true);
    document.body.classList.add('overflow-hidden');
  };
    const openCommentDeleteModalHandler = () => {
    setOpenCommentDeleteModal(true);
    document.body.classList.add('overflow-hidden');
  };
  return (
    <>
 {openCommentModal && createPortal(
        <EditCommentModal
          setOpenCommentModal={setOpenCommentModal}
          commentId={comment._id}
          initialContent={comment?.text}
          
        />, document.getElementById("portal")
      )}
     {openCommentDeleteModal && createPortal(
        <DeleteCommentModal
          setOpenCommentDeleteModal={setOpenCommentDeleteModal}
          commentId={comment._id}
         
          
        />, document.getElementById("portal")
      )}
     <Card className={`${userCheckStyle} relative flex items-start justify-start md:w-[75%] w-[85%]  gap-3 p-3 min-h-[100px] max-h-[200px] overflow-auto`}>
      <img src={comment.author?.profileImage.profileImgUrl} alt={comment.author?.profileImage.profileImgName} className="w-12 h-12 rounded-full" />
      <CardContent className="p-0">
        <CardTitle className="max-w-[80%] truncate">{comment.author?.username} </CardTitle>

        {postOwner? <span className='scale-[0.7] absolute px-2 text-sm font-bold rounded-md py-[0.5px] right-1 top-2 bg-slate-400 text-slate-600'>Author</span> 
        :<></>}
       
        <CardDescription className="p-0 text-[0.7rem] mt-1">
          {day} {month} {year}
        </CardDescription>
        <CardDescription className="text-pretty">{comment?.text} </CardDescription>
        <span className='flex gap-2 sticky bottom-0 '>
          {userCheck && (
        <span onClick={openCommentEditModal}  className="text-lg transition-all duration-300 ease-linear cursor-pointer hover:scale-105">
            <TbEditCircle />
        </span>
    )}
    {(userCheck || user.userInfo.isAdmin || user.userInfo.superAdmin) && (
        <span onClick={openCommentDeleteModalHandler} className="text-lg text-red-500 transition-all duration-300 ease-linear cursor-pointer hover:scale-105 hover:text-red-600">
            <MdDelete />
        </span>
    )}
      </span>
      </CardContent>

      
     
    </Card>
    </>
   
  );
};

export default CommentCard;
