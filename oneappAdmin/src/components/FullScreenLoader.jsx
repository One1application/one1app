import React from "react";

const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center">
                {/* Spinner */}
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-orange-500 border-opacity-50 border-r-4 border-r-orange-600"></div>
                {/* Loading Text */}
                <p className="mt-6 text-lg font-semibold text-orange-800 tracking-wide">
                    Loading, please wait...
                </p>
            </div>
        </div>
    );
};

export default FullScreenLoader;
