import NavBarComp from "../components/NavBar";

const AboutMePage = () => {
    return ( <>
      <NavBarComp/>
      <main className="mx-auto">

<div className="w-full h-[400px] scale-90 relative">
    
<img loading="lazy"
                decoding='async'
                fetchPriority='high'
                 src="https://i.pinimg.com/originals/98/33/5f/98335fcd764b32cae3780b1e1d5d39b4.gif" alt="https://i.pinimg.com/originals/98/33/5f/98335fcd764b32cae3780b1e1d5d39b4.gif"  className="w-full h-[400px] object-cover object-center "/>



                 <div className="">
                 <p>about me</p>
                    <h1>Hey, I’m Emmanuel</h1>
                    
                 </div>
</div>





      </main>
      
      
      
      
      </> );
}
 
export default AboutMePage;