import { Link } from "react-router-dom";

const Footer = () => {
    const pagesLinks = [
        { url: "/", urlName: "Home" },
        { url: "/about", urlName: "About" },
        { url: "/contact", urlName: "Contact" },
         { url: "/allblogs", urlName: "Blogs" },
        {url:"/createpost",urlName:"Post"},
        { url: "/FAQ", urlName: "Most asked?" },
    ];
    const othersLinks = [
        { url: "/", urlName: "Terms of Service" },
        { url: "/about", urlName: "Privacy Policy " },
        { url: "/contact", urlName: "Donate" },
    ];
    const contactLinks = [
        { url: "https://x.com/saltydreamer1?t=4i3Mb08kZAL2fgiW2fZdkA&s=09", urlName: "Twitter" },
        { url: "https://www.instagram.com/saltz_jorney?igsh=MXc3cHJzZWRzN2txeQ==", urlName: "Instagram" },
        { url: "https://github.com/ogunladeoreoluwa01", urlName: "Github" },
        { url: "https://wa.me/+2347069310594?text=I'm%20interested%20in%20working%20with%20you%20my%20name%20is", urlName: "Whats app" }
    ];

    return ( <>
    <footer className="p-4 border-t-2 border-spacing-y-5  border-slate-900 dark:border-slate-100 ">

<section className="text-slate-700 dark:text-slate-400  justify-center items-start flex flex-col gap-8 my-4 md:flex-row md:flex-wrap ">
<div className="md:w-1/4">
<Link to="/" className="font-black text-2xl uppercase ">TOUKOU<span>投稿</span></Link>
</div>


                  <ul className='flex flex-col items-start md:w-1/5'>
    <li> <p className="font-semibold  text-[1.05rem] md:text-[1.1rem] border-b-2">PAGES</p></li>
                      {pagesLinks.map((link, index) => (
                          <li key={index} className='py-1'>
                              <Link 
                                  to={link.url}
                                  className=' hover:font-semibold font-medium block rounded-md text-slate-800 dark:text-slate-200  hover:text-slate-600 dark:hover:text-slate-700  transition-all duration-300 '
                              >
                                  {link.urlName}
                              </Link>
                          </li>
                      ))}
                      
                  </ul>
                  <ul className='flex flex-col items-start md:w-1/5'>
    <li> <p className="font-semibold  text-[1.05rem] md:text-[1.1rem] border-b-2">CONTACTS</p></li>
                      {contactLinks.map((link, index) => (
                          <li key={index} className='py-1'>
                              <Link 
                                  to={link.url}
                                  target="_blank"
                                  className=' hover:font-semibold  font-medium block rounded-md text-slate-800 dark:text-slate-200  hover:text-slate-600 dark:hover:text-slate-700  transition-all duration-300 '
                              >
                                  {link.urlName}
                              </Link>
                          </li>
                      ))}
                      
                  </ul>
                  <ul className='flex flex-col items-start md:w-1/5 '>
    <li> <p className="font-semibold  text-[1.05rem] md:text-[1.1rem] border-b-2">OTHERS</p></li>
                      {othersLinks.map((link, index) => (
                          <li key={index} className='py-1'>
                              <Link 
                                  to={link.url}
                                  className=' hover:font-semibold font-medium block rounded-md text-slate-700 dark:text-slate-200  hover:text-slate-600 dark:hover:text-slate-700  transition-all duration-300 '
                              >
                                  {link.urlName}
                              </Link>
                          </li>
                      ))}
                      
                  </ul>        
</section>
<p className="font-semibold  md:mx-8 text-[1.05rem] text-slate-700 dark:text-slate-400">Copyright 2024</p>





    </footer>
    </> );
}
 
export default Footer;