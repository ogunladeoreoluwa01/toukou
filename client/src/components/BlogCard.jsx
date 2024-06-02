import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const BlogCard = ({ postUrl, authorName, title, date, image }) => {
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");

    useEffect(() => {
        const dateObj = new Date(date);
        const newYear = dateObj.getFullYear();
        const newMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(dateObj);
        const newDay = dateObj.getDate();
        setYear(newYear);
        setMonth(newMonth);

        // Add date acronyms (st, nd, rd, th) to the day
        let dayAcronym = "th";
        if (newDay === 1 || newDay === 21 || newDay === 31) {
            dayAcronym = "st";
        } else if (newDay === 2 || newDay === 22) {
            dayAcronym = "nd";
        } else if (newDay === 3 || newDay === 23) {
            dayAcronym = "rd";
        }
        setDay(`${newDay}${dayAcronym}`);
    }, [date]);

    return (
        <Link to={postUrl} className="hover:-translate-y-2   transition-all duration-300 ease-linear">
            <Card className="w-[270px] dark:bg-slate-900  bg-slate-100 ">
                <CardHeader className="py-6 px-3">
                    <CardTitle className="text-xl h-[50px] line-clamp-2"> {title}</CardTitle>
                    <CardDescription className="">
                        <span className="bg-slate-400 w-fit text-[0.75rem] px-2 md:px-3 rounded-md font-bold capitalize text-slate-700">
                            {authorName}
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-2 px-3">
                    <img
                        loading="lazy"
                        decoding="async"
                        fetchpriority="high"
                        className="w-full h-[140px] rounded-md object-cover object-center"
                        src={image}
                        alt={`post visual,${title},${authorName}`}
                    />
                </CardContent>
                <CardFooter className="pb-6 px-3">
                    <CardDescription >{year}&nbsp;{month}&nbsp;{day}</CardDescription>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default BlogCard;
