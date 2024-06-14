import NavBarComp from "../components/NavBar";

import { Link} from "react-router-dom";
import { Toaster} from 'sonner';
import AllPostComponent from "@/components/allPostComponent.";
import Footer from "@/components/footer";
import MakeaPost from "@/components/makeapost";

const AllBlogs = () => {
    


    return (  <>
    <NavBarComp/>
    <main className="px-4 ">
    <div className="w-full">
          <p className="p-2 text-sm">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            All Blogs&nbsp;/&nbsp;
          </p>
        </div>
  
<section className="flex items-center lg:px-14 md:px-6 justify-center w-full ">
<AllPostComponent/>
</section>

<MakeaPost/>
    </main> 
    <Footer/>
    <Toaster richColors position="top-right" expand={true} closeButton />
    </>);
}
 
export default AllBlogs;