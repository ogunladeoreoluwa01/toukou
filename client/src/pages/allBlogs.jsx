import NavBarComp from "../components/NavBar";

import { Link} from "react-router-dom";
import { Toaster} from 'sonner';
import AllPostComponent from "@/components/allPostComponent.";

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
  
<section className="flex  items-center justify-center w-full ">
<AllPostComponent/>
</section>


    </main> 
    <Toaster richColors position="top-right" expand={true} closeButton />
    </>);
}
 
export default AllBlogs;