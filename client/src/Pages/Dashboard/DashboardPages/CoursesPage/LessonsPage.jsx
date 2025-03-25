import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
import * as Icons from "lucide-react";
import { fetchCourse } from "../../../../services/auth/api.services";
import toast from "react-hot-toast";

const LessonsPage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseid");
  const [courseDetails, setCourseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentLessonName, setCurrentLessonName] = useState("");
  const playerRef = useRef(null);

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCourse(courseId);
        setCourseDetails(response.data.payload.course);
        
        // Set first video as default if available
        if (response.data.payload.course.lessons?.[0]?.lessonData?.[0]?.videos?.[0]) {
          setCurrentVideo(response.data.payload.course.lessons[0].lessonData[0].videos[0]);
          setCurrentLessonName(response.data.payload.course.lessons[0].lessonData[0].lessonName);
        }
      } catch (error) {
        console.error("Error while fetching course.", error);
        toast.error("Failed to load course content.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) {
      getCourse();
    }
  }, [courseId]);

  const handleVideoSelect = (video, lessonName) => {
    setCurrentVideo(video);
    setCurrentLessonName(lessonName);
  };

  // Custom right-click prevention
  const preventRightClick = (e) => {
    e.preventDefault();
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No course data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black scrollbar-hide overflow-y-scroll text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-orange-500 mb-8">{courseDetails.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-orange-500/20">
              {currentVideo ? (
                <div 
                  className="player-wrapper relative pt-[56.25%]" 
                  onContextMenu={preventRightClick}
                >
                  <ReactPlayer
                    ref={playerRef}
                    url={currentVideo}
                    className="absolute top-0 left-0"
                    width="100%"
                    height="100%"
                    controls={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                          disablePictureInPicture: true,
                          onContextMenu: e => e.preventDefault()
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-gray-400">Select a video to play</p>
                </div>
              )}
              
              {currentLessonName && (
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-orange-500">{currentLessonName}</h2>
                </div>
              )}
            </div>
          </div>
          
          {/* Lesson List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl shadow-xl border border-orange-500/20 p-4">
              <h2 className="text-xl font-semibold mb-4 text-orange-500">Course Content</h2>
              
              <div className="space-y-4">
                {courseDetails.lessons?.[0]?.lessonData.map((lesson, lessonIndex) => (
                  lesson.lessonName && (
                    <div key={lessonIndex} className="border-b border-gray-700 pb-4 last:border-0">
                      <h3 className="font-medium text-lg mb-2">{lesson.lessonName}</h3>
                      <div className="space-y-2">
                        {lesson.videos.map((video, videoIndex) => (
                          video && (
                            <button
                              key={videoIndex}
                              onClick={() => handleVideoSelect(video, lesson.lessonName)}
                              className={`flex items-center w-full text-left p-2 rounded hover:bg-gray-800 transition ${
                                currentVideo === video ? "bg-gray-800 text-orange-500" : "text-gray-300"
                              }`}
                            >
                              <Icons.Play className="w-5 h-5 mr-2" />
                              <span>Video {videoIndex + 1}</span>
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage; 