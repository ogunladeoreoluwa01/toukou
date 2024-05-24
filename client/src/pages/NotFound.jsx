import Footer from "../components/footer";
import { Link } from "react-router-dom";
const Error404 = () => {
    return ( <>
    <section className="md:h-[91.8vh] h-[95vh] flex flex-col justify-center items-center overflow-hidden">

        <div className=" text-[10rem] font-NotoSans font-extrabold group lock">
            <h1>404'D</h1>

<Link to="/">go bac</Link>

        </div>
        </section>
        <Footer/></> );
}
 
export default Error404;