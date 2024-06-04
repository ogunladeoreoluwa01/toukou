import { useState } from 'react'
import NavBarComp from "./components/NavBar";
import SectionHeader from './components/SectionHeader';
import FeaturedPost from './components/FeaturedPost';
import NormalPost from './components/BlogCard'
import Grid from './components/Grid'
import Footer from './components/footer';
import MakeaPost from './components/makeapost';
import { useSelector } from 'react-redux';
import NormalPostLoader from './components/loaders/normalPostLoader';
import FtPostLoader from './components/loaders/ftPostLoader';
import UpdateUserModal from './components/updateUserModal';
function App() {
  const user = useSelector(state => state.user);

  return (
    <>
        <NavBarComp/>
        <main className=' mx-auto relative px-4 '>
          <section className='mb-6'>
          <SectionHeader/>
        <FeaturedPost/>
          </section>
          <div className='flex flex-col gap-4 my-6 '>
         
          </div>
       
        <div className='my-6'>
          
        <Grid/>
        </div>


       

       
        <FtPostLoader/>
{/* <UpdateUserModal/> */}
{user.userInfo? <MakeaPost/>:<></>}
       
        
        </main>
        
        <Footer/>
    </>
  )
}

export default App
