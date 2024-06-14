import NavBarComp from "../components/NavBar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

const AboutMePage = () => {
    return ( <>
      <NavBarComp/>
      <main className="mx-auto px-4">
              <div className="w-full">
          <p className="p-2 text-sm">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            About me&nbsp;/&nbsp;
          </p>
        </div>

<section className="border-b border-spacing-y-5 pb-6 md:pb-8 border-slate-900 dark:border-slate-100">
<div className="w-full max-h-[400px] scale-90 relative">
<div className="bg-slate-900 w-full max-h-[400px] rounded-lg">
<img loading="lazy"
                decoding='async'
                fetchpriority='high'
                 src="https://i.pinimg.com/originals/98/33/5f/98335fcd764b32cae3780b1e1d5d39b4.gif" alt="https://i.pinimg.com/originals/98/33/5f/98335fcd764b32cae3780b1e1d5d39b4.gif"  className="w-full rounded-lg h-[400px] object-cover object-center  md:opacity-50 "/>
      </div>
      <div className="hidden md:block absolute bottom-5 left-5 text-slate-50">
                 <p className="text-2xl  font-NotoSans font-medium capitalize">about me</p>
                    <h1 className=" text-5xl font-NotoSans font-bold capitalize">Hey, <span className="font-medium">I’m Emmanuel</span></h1>
                    
                 </div>
</div>
<div className="mx-6 md:hidden">
                 <p className="text-xl  font-NotoSans font-medium capitalize">about me</p>
                    <h1 className=" text-3xl font-NotoSans font-bold capitalize">Hey, <span className="font-medium">I’m Emmanuel</span></h1>
                    
                 </div>               
</section>
<section className="mx-6  flex-col flex md:flex-row flex-shrink-0 py-6 md:py-10 gap-5">
<div className="text-2xl md:text-3xl  md:w-1/3 font-NotoSans">
      <h1>About Me 🌟</h1>

</div>
<div className="md:w-1/3 text-pretty md:text-sm font-NotoSans
">
<p className=" text-pretty text-justify">
Hey there! 👋 I'm a 20-year-old Computer Science graduate with an insatiable passion for technology and all things computers. My journey in the tech world began early, and throughout my academic career, I've leveled up my skills in various programming languages and tools. 🎮👾

Here's a quick snapshot of my skills:<br/>

 <strong>Frontend:</strong> HTML, CSS, JavaScript, React, Vue.js, Tailwind CSS<br/>
 <strong>Backend:</strong>  Node.js, Express, MongoDB<br/>
<strong>Other Tools:</strong>  Python, Photoshop, DaVinci Resolve, Figma, a little bit of SQL<br/>
 <strong>Currently Learning: </strong> TypeScript, Next.js
</p>
</div>

<div className="md:w-1/3 text-pretty md:text-sm font-NotoSans">
<p className=" text-pretty text-justify">I'm also a huge anime and light novel enthusiast, and you'll often find me diving into the latest episodes or chapters. My favorite games include Apex Legends (let's drop into the action! 🪂), Rainbow Six Siege, Overwatch, and occasionally, some Valorant (pew pew! 💥).<br/>

My latest venture is an exciting blog post application called TOUKOU投稿, where users can share their thoughts and insights on anime, light novels, tech, and more. It's a platform for fellow "men of culture" to unite and share their wisdom. 📚✨.</p>
</div>

</section>





      </main>
      
      
      <Footer/>
      
      </> );
}
 
export default AboutMePage;