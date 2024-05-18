import React from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ headerText = "Default Header", linkUrl = "jjad", linkAnchor = "Learn more" }) => {
    return (
        <div className="flex  justify-between items-end w-full py-2 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-600  dark:text-slate-300">{headerText}</h1>
            {linkUrl && <Link to={linkUrl} className="font-semibold text-sm md:text-base hover:font-bold text-slate-950 dark:text-slate-50">{linkAnchor}</Link>}
        </div>
    );
}

export default SectionHeader;
