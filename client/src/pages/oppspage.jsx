import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SomethingWentWrong = () => {
    const errorMessages = [
        "Oops! Something went wrong. Please try again later. 😟",
        "Our servers are currently taking a nap. Please check back soon. 😴",
        "Houston, we have a problem! Something went wrong on our end. 🚀",
        "Error 500: Internal Server Error. Our team is on it! 🛠️",
        "Oops! Looks like our site is having a bad day. 🥴",
        "Something broke on our end. We're working hard to fix it. 💪",
        "Error 500: Our servers are having a meltdown. Please try again later. 🔥",
        "Oops! We're experiencing technical difficulties. Hang tight! 🛠️",
        "Looks like something went wrong. Please refresh the page or try again later. 🔄",
        "Our site is currently under maintenance. Please bear with us. 🛠️"
    ];

    const funnyInsults = [
        "Well, that didn't work. Maybe try turning it off and on again? 🔌",
        "Even my grandma could do better, and she doesn't even use the internet. 👵",
        "Looks like you broke the internet! Just kidding... maybe. 💥",
        "Ever feel like the universe is just messing with you? 🌌",
        "Oops! It's not you, it's us... or maybe it is you. 🤔",
        "Error 500: Because sometimes life just doesn't go your way. 🌀",
        "Congratulations, you found the broken part of our site! 🎉",
        "Well, this is awkward. Let's pretend this never happened. 🤫",
        "If at first you don't succeed, try clicking the refresh button. 🔄",
        "Oops! Something went wrong. Time to take a coffee break? ☕"
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

    return (
        <>
            <main className="h-screen w-full flex flex-col justify-center items-center ">
                <p className="mt-5 max-w-[300px] md:max-w-full mx-auto text-justify absolute bottom-[15%] md:bottom-[20%] ">{errorMessage}</p>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-widest">Oops!</h1>
                <div className="bg-teal-500 px-2 text-white text-sm rounded rotate-12 absolute">
                    Something Went Wrong
                </div>

                <div className="flex gap-5 justify-center items-center mt-10">
                    <button className="mt-5">
                        <Link to="/" className="relative inline-block text-sm font-medium text-teal-500 group active:text-teal-700 focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-teal-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-white border border-current">
                                Go Home
                            </span>
                        </Link>
                    </button>

                    <button className="mt-5" onClick={handleGoHardClick}>
                        <span className="relative inline-block text-sm font-medium text-white group active:text-gray-700 focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-white group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-teal-500 border border-current">
                                Go Hard
                            </span>
                        </span>
                    </button>

                    <button className="mt-5">
                        <a href="https://discord.com" className="relative inline-block text-sm font-medium text-teal-500 group active:text-teal-700 focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-teal-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-white border border-current">
                                Get Help 
                            </span>
                        </a>
                    </button>
                </div>
            </main>
        </>
    );
}

export default SomethingWentWrong;
