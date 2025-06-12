import { motion } from "framer-motion";
import { PlayIcon } from "lucide-react";
import { useEffect } from "react";

const CourseContentSection = ({ courseDetails }) => {
  useEffect(() => {}, [courseDetails]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="h-fit bg-gray-950 flex flex-col items-center py-12 px-4">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-orange-600 mb-8"
      >
        Course Content
      </motion.h1>

      {/* Lessons List */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {courseDetails.lessons[0].lessonData.map((lesson, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "#FFEDD5" }}
            className="p-4 border-b border-orange-100 last:border-b-0 flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2 bg-orange-100 rounded-full text-orange-600">
              <PlayIcon className="h-5 w-5" />
            </div>
            <span className="font-medium text-orange-800">
              {lesson.lessonName}
            </span>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
};

export default CourseContentSection;
