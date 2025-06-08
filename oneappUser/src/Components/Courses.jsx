import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPuchasedCourses } from "../Apicalls/productsPurchased.js";
import ReactPlayer from "react-player";
import { format } from "date-fns";
import {
  Play,
  User,
  Calendar,
  DollarSign,
  BookOpen,
  Clock,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  PlayCircle,
  Pause,
  RotateCcw,
} from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);

  async function fetchCourses() {
    try {
      setLoading(true);
      const res = await getPuchasedCourses();
      setCourses(res || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

   
  const checkSubscriptionStatus = (validity, startingDate) => {
    if (!validity || !startingDate) return "Unknown";

    const now = new Date();
    const startDate = new Date(startingDate);
    let endDate = new Date(startDate);  

    switch (validity) {
      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "Yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case "Lifetime":
        return "Lifetime";
      default:
        return "Unknown";
    }

    return now < endDate ? "Active" : "Expired";
  };

  const handleVideoSelect = (videoUrl, lesson, course) => {
    setSelectedVideo(videoUrl);
    setCurrentLesson(lesson);
    setCurrentCourse(course);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
    setCurrentLesson(null);
    setCurrentCourse(null);
  };

  const handleCourseSelect = (index) => {
    setSelectedCourseIndex(selectedCourseIndex === index ? null : index);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-900/50 text-green-400 border-green-500/30";
      case "Expired":
        return "bg-red-900/50 text-red-400 border-red-500/30";
      default:
        return "bg-gray-800/50 text-gray-400 border-gray-600/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle size={16} className="text-green-400" />;
      case "Expired":
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-gray-100 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-300">
              Loading your courses...
            </h2>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-gray-100 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Error Loading Courses
            </h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={fetchCourses}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!courses?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-gray-100 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">
              No Courses Found
            </h2>
            <p className="text-gray-400">
              You haven't purchased any courses yet.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-gray-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                My Learning Journey
              </h1>
              <p className="text-gray-400 text-sm">
                Continue your progress with purchased courses
              </p>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="space-y-6">
          {courses.map((purchasedCourse, index) => {
            const course = purchasedCourse?.course;
            if (!course) return null;

            const status = checkSubscriptionStatus(
              course?.validity,
              course?.startDate
            );
            const isActive = status === "Validity";
            const isExpanded = selectedCourseIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 overflow-hidden"
              >
                {/* Course Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {course?.title || "Untitled Course"}
                      </h2>
                      <div className="flex items-center text-gray-300 mb-3">
                        <User className="h-4 w-4 mr-2 text-indigo-400" />
                        <span>
                          By {course?.creator?.name || "Unknown Author"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                      {status}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                    {purchasedCourse?.startDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                        <span>
                          Started:{" "}
                          {format(
                            new Date(purchasedCourse.startDate),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                      <span>{course?.lessons?.length || 0} Lesson(s)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCourseSelect(index)}
                    className="w-full flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-all duration-200"
                  >
                    <span className="font-medium text-white">
                      {isExpanded
                        ? "Hide Course Content"
                        : "View Course Content"}
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded Course Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-6">
                        {/* Course Description */}
                        {course?.aboutThisCourse?.description && (
                          <div className="bg-gray-700/30 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                              <BookOpen
                                size={18}
                                className="mr-2 text-indigo-400"
                              />
                              About This Course
                            </h3>
                            <div
                              className="prose prose-invert max-w-none text-gray-300"
                              dangerouslySetInnerHTML={{
                                __html: course.aboutThisCourse.description,
                              }}
                            />
                          </div>
                        )}

                        {/* Lessons */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <PlayCircle
                              size={18}
                              className="mr-2 text-green-400"
                            />
                            Course Lessons
                          </h3>

                          <div className="space-y-4">
                            {course?.lessons?.length ? (
                              course.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600/30"
                                >
                                  <div className="p-4 bg-gray-600/30 border-b border-gray-600/30">
                                    <h4 className="font-semibold text-white flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-blue-400" />
                                      Lesson {lessonIndex + 1}:{" "}
                                      {lesson?.lessonData?.lessonName ||
                                        "Untitled Lesson"}
                                    </h4>
                                  </div>

                                  <div className="divide-y divide-gray-600/30">
                                    {lesson?.lessonData?.map(
                                      (chapter, chapterIndex) => (
                                        <div key={chapterIndex}>
                                          <div className="p-3 bg-gray-600/20">
                                            <h5 className="font-medium text-gray-300">
                                              Chapter {chapterIndex + 1}:{" "}
                                              {chapter.lessonName}
                                            </h5>
                                          </div>
                                          {chapter?.videos?.length ? (
                                            chapter.videos.map(
                                              (video, videoIndex) => (
                                                <motion.div
                                                  key={videoIndex}
                                                  whileHover={{ scale: 1.02 }}
                                                  whileTap={{ scale: 0.98 }}
                                                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-600/30 transition-all duration-200 group"
                                                  onClick={() =>
                                                    handleVideoSelect(
                                                      video,
                                                      chapter,
                                                      course
                                                    )
                                                  }
                                                >
                                                  <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-3 group-hover:from-indigo-400 group-hover:to-purple-500 transition-all duration-200">
                                                      <Play
                                                        className="h-5 w-5 text-white fill-current"
                                                        size={16}
                                                      />
                                                    </div>
                                                    <div>
                                                      <p className="font-medium text-white">
                                                        Video {videoIndex + 1}
                                                      </p>
                                                      <p className="text-xs text-gray-400">
                                                        {chapter.lessonName}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200" />
                                                </motion.div>
                                              )
                                            )
                                          ) : (
                                            <div className="p-4 text-center text-gray-400">
                                              <PlayCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                              <p className="text-sm">
                                                No videos available in this
                                                chapter
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-8 text-center text-gray-400 bg-gray-700/30 rounded-lg">
                                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No lessons available for this course</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {isVideoModalOpen && selectedVideo !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {currentCourse?.title || "Course Video"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {currentLesson?.lessonName || "Lesson"}
                    </p>
                  </div>
                  <button
                    onClick={closeVideoModal}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <ReactPlayer
                      url={selectedVideo}
                      controls
                      width="100%"
                      height="500px"
                      playing
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Courses;
