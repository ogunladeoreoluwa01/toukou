const CommentCard = () => {
    return ( <>
    <div className="w-full h-fit  bg-slate-200 dark:bg-slate-800 p-5 rounded-lg flex gap-5 items-start">
<img src="https://i.pinimg.com/originals/b6/d8/ab/b6d8ab853ebc2bbedab990364332be8b.jpg" alt=""  className="w-12 h-12 rounded-full"/>
<div>
<h1 className="flex items-center bg-slate-300 text-sm w-fit px-4 py-[1.5px] rounded-md font-bold capitalize text-slate-700">author name</h1>
<p className="text-xs font-semibold px-1 mt-2 text-slate-400 dark:text-slate-200"> time</p>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque animi nulla sint a consequuntur minima exercitationem similique in commodi, fuga voluptates assumenda, eveniet nobis eum alias labore aut doloremque dolorum.</p>

    </div>
    
    </div>
    
    
    
    
    
    </> );
}
 
export default CommentCard;