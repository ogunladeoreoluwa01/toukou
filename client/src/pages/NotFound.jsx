import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
        const errorMessages = [
        "Oops! Wrong Turn! Looks like you took a detour into the unknown. Let’s navigate back to safety! 🚀",
        "404: Page Lost in Cyberspace. The page you’re looking for is off exploring new frontiers. Let's bring you back to home base. 🛸",
        "We’ve Got a Code Red! Something went wrong, but don't worry! Our ninjas are on it. 🥷",
        "Error 404: Page Not Found. The page you seek has leveled up and moved to a new realm. Time to go back and regroup! 🎮",
        "Page Vanished into the Digital Abyss. The page you’re after has disappeared into the void. Quick, grab my hand and let's get out of here! 🌌",
        "Whoa, That’s a Dead End! Looks like this page hit a snag. Let’s turn around and find a better path. 🚧",
        "Error 404: Page Teleported Away. The page you were looking for has teleported to another dimension. Let's head back and try again! 🌀",
        "Page Not Found: It’s a Trap! You’ve fallen into a trap! Quick, let's escape to the Homepage before it’s too late! 🏃‍♂️",
        "The Page Took a Break. The page you requested is on a coffee break. Let’s head back and try again later! ☕️",
        "404: Page on Vacation. The page you’re looking for is on a tropical vacation. Meanwhile, let’s get you back to the main site! 🌴"
    ];

    const funnyInsults = [
        "Did you mean to do that? Because it looks like you didn't. 😜",
        "Are you always this slow, or is today a special occasion? 🐢",
        "If brains were dynamite, you wouldn’t have enough to blow your hat off! 🎩",
        "Don't worry, even mistakes can be beautiful. Yours just needs a little work. 🖌️",
        "I'd explain it to you, but I left my crayons at home. 🖍️",
        "You're proof that even the best of us have off days. 📉",
        "Your code is like a riddle wrapped in a mystery, buried under a typo. 🕵️‍♂️",
        "You're the reason we have instructions on shampoo bottles. 🧴",
        "If there was an award for mistakes, you'd have a trophy room. 🏆",
        "Keep trying! Everyone needs a hobby, even if it's failing spectacularly. 🎢"
    ];

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getRandomErrorMessage = () => {
            const randomIndex = Math.floor(Math.random() * errorMessages.length);
            return errorMessages[randomIndex];
        };

        setErrorMessage(getRandomErrorMessage());
    }, []);

    const handleGoHardClick = () => {
        const getRandomFunnyInsult = () => {
            const randomIndex = Math.floor(Math.random() * funnyInsults.length);
            return funnyInsults[randomIndex];
        };

        setErrorMessage(getRandomFunnyInsult());
    };



    return ( <>
   <main className="h-screen w-full flex flex-col justify-center items-center ">
    <p className="mt-5 max-w-[300px] md:max-w-full mx-auto text-justify absolute bottom-[15%] md:bottom-[20%]">{errorMessage }</p>
	<h1 className="text-9xl font-extrabold  tracking-widest">404</h1>
	<div className="bg-[#FF6A3D] px-2 text-sm text-white rounded rotate-12 absolute">
		Page Not Found
	</div> 

    
    <div className="flex gap-5 justify-center items-center">
        <button className="mt-5">
      <Link to="/"
        class="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
      >
        <span
          class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span class="relative block px-6 py-1 text-white  border border-current">
          Go Home
        </span>
      </Link>
    </button>

       <button className="mt-5" onClick={handleGoHardClick }>
      <span 
        className="relative inline-block text-sm font-medium text-[White] group active:text-slate-300 focus:outline-none focus:ring"
      >
        <span
          className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[white] group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span className="relative block px-6 py-1 text-[#FF6A3D]  border border-current">
          Go Hard
        </span>
      </span>
    </button>
    </div>
	
</main></> );
}
 
export default Error404;