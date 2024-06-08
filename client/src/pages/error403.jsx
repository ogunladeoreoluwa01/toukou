import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Error403 = () => {
    const errorMessages = [
        "Access Denied! You shall not pass! 🚫",
        "Forbidden Territory! Trespassers will be tickled to death! 🤫",
        "403: Access Denied. Looks like someone forgot their secret password. 🔒",
        "No Entry! This is a VIP area, and you're clearly not on the list. 🎩",
        "Sorry, but this is off-limits. Please find another route. 🚷",
        "Access Denied! Please provide your secret handshake to proceed. 🤝",
        "403: Permission Denied. Did you try turning it off and on again? 💡",
        "You're not welcome here! Unless you bring cookies. 🍪🚫",
        "Error 403: Access Denied. It's like the velvet rope at a fancy club, but without the fancy. 🍸",
        "Restricted Area! Proceed with caution, and maybe some ninja moves. 🥋🚷"
    ];

    const funnyInsults = [
        "Nice try, but this area is for the elite. Maybe try the kiddie pool? 🏊‍♂️",
        "I'd give you access, but my pet hamster has better security clearance. 🐹",
        "Do you even have clearance for a 403 error? Because I'm not convinced. 🤔",
        "If wishes were permissions, you'd still be stuck outside. ✨",
        "Denied! Now go home and think about what you've done. 🏠",
        "You're like a fish trying to climb a tree. It's amusing, but it's not gonna happen. 🐠🌳",
        "Access Denied! The password is 'password'. Just kidding, but seriously, don't use that password. 🔑",
        "You're about as welcome as a porcupine in a balloon factory. 🎈🦔",
        "Error 403: Forbidden. Your entry ticket is missing. Maybe check under the sofa cushions? 🎟️",
        "Access Denied! Looks like you forgot to bring your invitation to the party. 🎉🚫"
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
                <p className="mt-5 max-w-[300px] md:max-w-full mx-auto text-justify absolute bottom-[15%] md:bottom-[20%]">{errorMessage}</p>
                <h1 className="text-9xl font-extrabold  tracking-widest">403</h1>
                <div className="bg-[#8A2BE2] px-2 text-sm text-white rounded rotate-12 absolute">
                    Access Forbidden
                </div>

                <div className="flex gap-5 justify-center items-center">
                    <button className="mt-5">
                        <Link to="/" className="relative inline-block text-sm font-medium text-[#8A2BE2] group active:text-[#800080] focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#8A2BE2] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-white border border-current">
                                Go Home
                            </span>
                        </Link>
                    </button>

                    <button className="mt-5" onClick={handleGoHardClick}>
                        <span className="relative inline-block text-sm font-medium text-[White] group active:text-[#A020F0] focus:outline-none focus:ring">
                            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[white] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                            <span className="relative block px-6 py-1 text-[#8A2BE2] border border-current">
                                Go Hard
                            </span>
                        </span>
                    </button>
                </div>
            </main>
        </>
    );
};

export default Error403;
