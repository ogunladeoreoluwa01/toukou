import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBarComp from "../components/NavBar";
import Footer from "../components/footer";
import { FaQuestionCircle, FaMagic, FaPencilAlt, FaCogs, FaComments, FaUser, FaTools, FaRocket, FaSmile, FaWrench, FaLayerGroup, FaShieldAlt, FaLaptopCode, FaThumbsUp } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import MakeaPost from "@/components/makeapost";
const FAQPage = () => {
 

    return (
    <>
     <NavBarComp/>
        <main className="mx-auto px-4">
              <div className="w-full">
          <p className="p-2 text-sm">
            <Link to="/">Home</Link>&nbsp;/&nbsp;
            FAQ&nbsp;/&nbsp;
          </p>
        </div>
  <section className="border-b pb-6 md:pb-8 border-spacing-y-5  border-slate-900 dark:border-slate-100">
  <div className="w-full max-h-[400px] scale-90 relative">
  <div className="bg-slate-900 w-full max-h-[400px] rounded-lg">
  <img loading="lazy"
                  decoding='async'
                  fetchpriority='high'
                   src="https://i.pinimg.com/originals/90/bf/f7/90bff7f439aa4424896d0e4aa7dc21ae.gif" alt="https://i.pinimg.com/originals/a5/f5/f5/a5f5f510384ddb7540a8d19f0e0dd887.gif"  className="w-full rounded-lg h-[400px] object-cover object-center  md:opacity-50 "/>
        </div>
        <div className="hidden md:block absolute bottom-5 left-5 text-slate-50">
                   <p className="text-2xl  font-NotoSans font-medium capitalize">FAQ ❓</p>
                      <h1 className=" text-5xl font-NotoSans font-bold capitalize"><span className="font-medium">Frequently asked  </span> Questions     </h1>
                      
                   </div>
  </div>
  <div className="mx-6 md:hidden">
                   <p className="text-xl  font-NotoSans font-medium capitalize">FAQ ❓</p>
                      <h1 className=" text-3xl font-NotoSans font-bold capitalize"><span className="font-medium">Frequently asked </span> Questions </h1>
                      
                   </div>               
  </section>
<section className="flex mx-6 flex-col justify-center items-center   mt-4 mb-8">
  <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger><FaQuestionCircle /> What is TOUKOU投稿?</AccordionTrigger>
        <AccordionContent>
          TOUKOU投稿 is a blog post application designed for users to share their thoughts on a variety of topics such as anime, light novels, technology, and more. It's a platform where enthusiasts from different fields can come together and express their opinions and insights. Think of it as the <strong>Grand Line</strong> for all things nerdy! 🌊🏴‍☠️
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger><FaMagic /> Who can post on TOUKOU投稿?</AccordionTrigger>
        <AccordionContent>
          Anyone with a passion for sharing their thoughts and engaging with a community of like-minded individuals can post on TOUKOU投稿. Whether you're a tech guru, an anime aficionado, or just someone with an interesting perspective, you are welcome to join and contribute. Join us, and may the power of the Sharingan guide your posts! 👁️
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger><FaPencilAlt /> How do I sign up for TOUKOU投稿?</AccordionTrigger>
        <AccordionContent>
          Signing up is simple! Visit the TOUKOU投稿 website, click on the "Sign Up" button, and fill out the registration form. Once you’ve confirmed your email, you’ll be ready to start posting and interacting with the community. Easy peasy, lemon squeezy! 🍋
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger><FaCogs /> What kind of content can I post?</AccordionTrigger>
        <AccordionContent>
          You can post a wide range of content on TOUKOU投稿. This includes but is not limited to reviews, opinions, news, and personal stories about anime, light novels, technology, and other interests. We encourage diverse and meaningful content that adds value to the community. Just remember, with great power comes great responsibility! 🕸️
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger><FaComments /> How do I ensure my posts get noticed?</AccordionTrigger>
        <AccordionContent>
          To increase the visibility of your posts, make sure to write engaging and well-thought-out content. Use relevant tags and categories, and interact with other users by commenting on and sharing their posts. Consistency is key, so try to post regularly to build a following. And who knows, you might just go viral like All Might! 💪
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger><FaUser /> Is there a moderation process for posts?</AccordionTrigger>
        <AccordionContent>
          Yes, TOUKOU投稿 has a moderation process to ensure that all content adheres to our community guidelines. Posts that violate these guidelines will be reviewed and may be removed. We aim to create a positive and respectful environment for all users. So, no trolling or you'll face the wrath of the Ban Hammer! 🔨
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-7">
        <AccordionTrigger><FaTools /> Can I customize my profile on TOUKOU投稿?</AccordionTrigger>
        <AccordionContent>
          Absolutely! You can customize your profile by adding a profile picture, writing a bio, and linking to your social media accounts. This helps other users get to know you better and builds your presence on the platform. Make your profile as epic as a Super Saiyan transformation! 🌟
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-8">
        <AccordionTrigger><FaRocket /> What technologies were used to build TOUKOU投稿?</AccordionTrigger>
        <AccordionContent>
          TOUKOU投稿 was built using a variety of technologies. The frontend is developed with React and Tailwind CSS, while the backend is powered by Node.js and Express, with MongoDB for the database. We are also integrating TypeScript and Next.js into the platform to enhance its functionality and performance. It’s as powerful as a Gundam in full gear! 🚀
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-9">
        <AccordionTrigger><FaSmile /> How can I provide feedback or report issues?</AccordionTrigger>
        <AccordionContent>
          We highly value user feedback and strive to continuously improve TOUKOU投稿. If you have any suggestions, feedback, or encounter any issues, please contact us via email at <a href="mailto:support@example.com">support@example.com</a>. We appreciate your input and will work diligently to address any concerns. Your feedback is like a Senzu Bean for us! 🌱
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-10">
        <AccordionTrigger><FaWrench /> Can I contribute to the development of TOUKOU投稿?</AccordionTrigger>
        <AccordionContent>
          Absolutely! We welcome contributions from the community. You can check out our GitHub repository for more details on how to contribute. Together, we can make TOUKOU投稿 even better! 🛠️
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-11">
        <AccordionTrigger><FaLayerGroup /> How do I format my posts?</AccordionTrigger>
        <AccordionContent>
          TOUKOU投稿 supports Markdown formatting, which makes it easy to style your posts with headings, lists, links, images, and more. Get creative and make your posts stand out! 📄
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-12">
        <AccordionTrigger><FaShieldAlt /> Is my data secure?</AccordionTrigger>
        <AccordionContent>
          Yes, we take data security very seriously. TOUKOU投稿 implements industry-standard security practices to protect your data. Rest assured, your information is safe with us. 🔒
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-13">
        <AccordionTrigger><FaLaptopCode /> Do you offer APIs for developers?</AccordionTrigger>
        <AccordionContent>
          Yes, we provide APIs for developers who want to build applications or integrate with TOUKOU投稿. Check our developer documentation for more details. Happy coding! 💻
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-14">
        <AccordionTrigger><FaThumbsUp /> What are the community guidelines?</AccordionTrigger>
        <AccordionContent>
          Our community guidelines are designed to ensure a respectful and positive environment for all users. Please read and adhere to them to help us maintain a welcoming community. ✨
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-15">
        <AccordionTrigger><FaRocket /> Easter Egg 🎉</AccordionTrigger>
        <AccordionContent>
          Congratulations! You've found the hidden Easter egg! 🎉 As a reward, here's a fun fact: Did you know that "TOUKOU投稿" means "submission" or "post" in Japanese? Now go and share this nugget of wisdom with your friends! 🌟
        </AccordionContent>
      </AccordionItem>
    </Accordion>

   
</section>


  
  
  
  
  
        <MakeaPost/>
        </main>
        
        <Footer/>
    
    
    </>
    );
};




export default FAQPage;
