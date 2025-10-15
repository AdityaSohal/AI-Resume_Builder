import React from 'react';

const Title = ({ title, description }) => {
    return (
        <div className=" mt-15 text-center  text-slate-700">
            <h2 className="text-3xl sm:text-4xl font-medium">{title}</h2>
            <p className="max-w-2xl mx-auto mt-4 text-slate-500 text-base sm:text-lg">
                {description}
            </p>
        </div>
    );
};

export default Title;
