import React from "react";
import { Lock, CircleCheck, Play } from "lucide-react";

const FeaturesAndCourseContent = ({ courseDetails }) => {
  const rawFeatures = courseDetails?.aboutThisCourse?.features || [];
  const rawCourseContent = courseDetails?.lessons?.[0]?.lessonData || [];

  const visibleChapters = rawCourseContent.slice(0, 5);
  const extraChapters = rawCourseContent.slice(5);

  const allVideoUrls = rawCourseContent
    .filter((chapter) => chapter?.videos)
    .flatMap((chapter) => chapter.videos)
    .filter((videoUrl) => videoUrl && videoUrl.trim() !== "");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {" "}
      {/* Centered container with padding */}
      {/* Orange Title */}
      <h2 className="text-3xl font-bold text-center text-orange-500 mb-12">
        Course Features & Content
      </h2>
      <div className="flex flex-col md:flex-row gap-10 bg-gray-950 text-white p-8 rounded-xl">
        {/* Left Side: Features */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-6 text-orange-500">
            Features
          </h2>{" "}
          {/* Changed to orange */}
          <ul className="space-y-4">
            {rawFeatures.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition"
              >
                <CircleCheck className="text-orange-500" size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Course Content */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-6 text-orange-500">
            Course Content
          </h2>
          <div className="space-y-4">
            {/* Visible clickable chapters */}
            {visibleChapters.map((chapter, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-900 rounded-lg px-5 py-4 border border-gray-800 hover:border-orange-500 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-orange-500 font-medium">
                    {index + 1}.
                  </span>
                  <h3 className="text-lg font-medium text-white">
                    {chapter.lessonName}
                  </h3>
                </div>
                <Lock className="text-orange-400" size={20} />
              </div>
            ))}

            {/* Extra non-clickable chapters */}
            {extraChapters.map((chapter, index) => (
              <div
                key={index + visibleChapters.length} // Ensure unique keys
                className="flex items-center justify-between bg-gray-900 rounded-lg px-5 py-4 border border-gray-800 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <span className="text-orange-500 font-medium">
                    {index + visibleChapters.length + 1}.
                  </span>
                  <h3 className="text-lg font-medium text-white">
                    {chapter.lessonName}
                  </h3>
                </div>
                <Lock className="text-orange-400" size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesAndCourseContent;
