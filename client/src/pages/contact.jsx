import NavBarComp from "../components/NavBar";
import Footer from "../components/footer";

const ContactUs = () => {
    return ( <>
        <NavBarComp/>
        <main className="mx-auto">
  <section className="border-b pb-6 md:pb-8 border-spacing-y-5  border-slate-900 dark:border-slate-100">
  <div className="w-full max-h-[400px] scale-90 relative">
  <div className="bg-slate-900 w-full max-h-[400px] rounded-lg">
  <img loading="lazy"
                  decoding='async'
                  fetchPriority='high'
                   src="https://i.pinimg.com/originals/1e/9c/6b/1e9c6b3f315ee469d3c9ae452979b548.gif" alt="https://i.pinimg.com/originals/a5/f5/f5/a5f5f510384ddb7540a8d19f0e0dd887.gif"  className="w-full rounded-lg h-[400px] object-cover object-center  md:opacity-50 "/>
        </div>
        <div className="hidden md:block absolute bottom-5 left-5 text-slate-50">
                   <p className="text-2xl  font-NotoSans font-medium capitalize">Contact ?</p>
                      <h1 className=" text-5xl font-NotoSans font-bold capitalize"><span className="font-medium">Want to </span> chat?      </h1>
                      
                   </div>
  </div>
  <div className="mx-6 md:hidden">
                   <p className="text-xl  font-NotoSans font-medium capitalize">Contact ?</p>
                      <h1 className=" text-3xl font-NotoSans font-bold capitalize"><span className="font-medium">Want to </span> chat? </h1>
                      
                   </div>               
  </section>
<section className="flex flex-col   mt-4 mb-8">
    <div className="flex flex-col md:flex-row gap-3 justify-center  items-center ">   
    <a href="mailto:emaore0707@gmail.com" className="w-[100%] md:w-[42%] py-1  text-center px-3 rounded-md  font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 "> emaore0707@gmail.com</a> 
    <a href="tel:+2347069310594" className="w-[100%] md:w-[42%] py-1  text-center px-3 rounded-md  font-bold dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 "> 070-693-10594 </a> 
    </div>

    <form className="flex flex-col md:w-[84%] w-[100%] mx-auto gap-3 mt-4 mb-8">
        
    <input
        type="text"
        name=""
        placeholder="Enter your name"
        className="w-full placeholder:text-sm rounded border border-slate-700 dark:border-slate-800 placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300  dark:bg-slate-600 px-3 py-[0.35rem]  focus:border-slate-900  focus:outline-0 transition-all duration-300 ease-linear"
      />
       <input
        type="email"
        name=""
        placeholder="Enter your email"
        className="w-full placeholder:text-sm rounded border border-slate-700 dark:border-slate-800 placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300  dark:bg-slate-600 px-3 py-[0.35rem]  focus:border-slate-900  focus:outline-0 transition-all duration-300 ease-linear"
      />
      <textarea name="" id="" placeholder="your message" className="w-full h-48 placeholder:text-sm rounded border border-slate-700 dark:border-slate-800 placeholder:text-slate-900 dark:placeholder:text-slate-400 bg-slate-300  dark:bg-slate-600 px-3 py-[0.35rem]  focus:border-slate-900  focus:outline-0 transition-all duration-300 ease-linear"></textarea>
 

 <button type="submit" className="w-[200px] rounded-md dark:bg-slate-100 dark:hover:bg-slate-200 transition-all duration-300 hover:bg-slate-800 dark:text-slate-900  bg-slate-900 text-slate-50 px-6 py-[0.35rem] "> Submit message</button>
    </form>
</section>


  
  
  
  
  
        </main>
        
        <Footer/>
        
        
        </>  );
}
 
export default ContactUs;