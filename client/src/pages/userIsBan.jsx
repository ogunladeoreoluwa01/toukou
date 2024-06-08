import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserIsBan = () => {
    const errorMessages = [
        "You have been banned from accessing this site. 🚫",
        "Access Denied! Your account has been banned. 🤫",
        "403: Access Denied. Your account is no longer active. 🔒",
        "No Entry! Your access has been revoked. 🎩",
        "Sorry, but you have been banned from this site. 🚷",
        "Access Denied! Please contact support for more information. 🤝",
        "403: Permission Denied. Your account is restricted. 💡",
        "You're not welcome here! Please reach out to support. 🍪🚫",
        "Error 403: Access Denied. Your account has been flagged. 🍸",
        "Restricted Area! Your account has been banned. 🥋🚷"
    ];

    const funnyInsults = [
        "Nice try, but your ban stands. Maybe try the kiddie pool? 🏊‍♂️",
        "Even my pet hamster has more access than you right now. 🐹",
        "Denied! Your access is as real as unicorns. 🦄",
        "If wishes were permissions, you'd still be stuck outside. ✨",
        "Denied! Now go home and think about what you've done. 🏠",
        "You're like a fish trying to climb a tree. It's not gonna happen. 🐠🌳",
        "Access Denied! Use 'password123'... Just kidding, don't. 🔑",
        "You're about as welcome as a porcupine in a balloon factory. 🎈🦔",
        "Error 403: Forbidden. Your entry ticket is missing. 🎟️",
        "Access Denied! Bring your invitation to the party next time. 🎉🚫"
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
            <main className="h-screen w-full flex flex-col justify-center items-center">
                  <p className="mt-5 max-w-[300px] md:max-w-full mx-auto text-justify absolute top-[15%] md:bottom-[20%]"><span className="font-bold text-lg capitalize">you were banned for: </span>banreason</p>
                <p className="mt-5 max-w-[300px] md:max-w-full mx-auto text-justify absolute bottom-[15%] md:bottom-[20%] ">{errorMessage}</p>
                <h1 className="text-9xl font-extrabold  tracking-widest capitalize">Ban</h1>
                <div className="bg-[#1E3A8A] px-2 text-white text-sm rounded rotate-12 absolute ">
                    you have been struck with the ban hammer
                </div>

                <div className="flex gap-5 justify-center items-center">
                    <button className="mt-5">
                        <Link to="/" className="relative inline-block text-sm font-medium text-[#1E3A8A] group active:text-[#1E40AF] focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#1E3A8A] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-white border border-current">
                                Go Home
                            </span>
                        </Link>
                    </button>

                    <button className="mt-5" onClick={handleGoHardClick}>
                        <span className="relative inline-block text-sm font-medium text-white group active:text-gray-700 focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-white group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-[#1E3A8A] border border-current">
                                Go Hard
                            </span>
                        </span>
                    </button>

                    <button className="mt-5">
                        <a href="https://discord.com" className="relative inline-block text-sm font-medium text-[#1E3A8A] group active:text-[#1E40AF] focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#1E3A8A] group-hover:translate-y-0 group-hover:translate-x-0"></span>
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

export default UserIsBan;
