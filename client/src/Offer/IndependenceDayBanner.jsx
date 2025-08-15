import React from "react";

const IndependenceDayBanner = () => {
  return (
    <div className="fixed top-0 left-0 w-full mb-25 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] text-black py-2 overflow-hidden whitespace-nowrap z-50 font-sans text-base font-semibold">
      <div
        className="inline-block pl-[100%]"
        style={{
          animation: "marquee 15s linear infinite",
        }}
      >
        Independence Day Special – <b>80% OFF</b> on all products – Only for{" "}
        <b>100 Creators!</b>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default IndependenceDayBanner;
