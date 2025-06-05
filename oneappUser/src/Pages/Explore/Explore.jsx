import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, MonitorPlay, FileDigit, ChevronRight } from "lucide-react";

const exploreData = {
  webinars: [
    {
      id: 1,
      title: "Digital Marketing Masterclass",
      date: "June 15, 2023",
      duration: "2 hours",
      instructor: "Sarah Johnson",
      price: "₹1,499",
    },
    {
      id: 2,
      title: "UX Design Fundamentals",
      date: "June 22, 2023",
      duration: "1.5 hours",
      instructor: "Michael Chen",
      price: "₹999",
    },
    {
      id: 3,
      title: "Data Science for Beginners",
      date: "June 29, 2023",
      duration: "2.5 hours",
      instructor: "Dr. Emily Wong",
      price: "₹1,799",
    },
    {
      id: 4,
      title: "Financial Planning Workshop",
      date: "July 6, 2023",
      duration: "2 hours",
      instructor: "Robert Williams",
      price: "₹1,299",
    },
    {
      id: 5,
      title: "Content Strategy Deep Dive",
      date: "July 13, 2023",
      duration: "1.5 hours",
      instructor: "Jessica Lee",
      price: "₹1,199",
    },
  ],
  digitalProducts: [
    {
      id: 1,
      title: "Social Media Template Pack",
      type: "Templates",
      fileSize: "25 MB",
      downloads: "1,240",
      price: "₹499",
    },
    {
      id: 2,
      title: "Productivity Planner PDF",
      type: "Planner",
      fileSize: "8 MB",
      downloads: "3,572",
      price: "₹299",
    },
    {
      id: 3,
      title: "Stock Photo Collection Vol. 3",
      type: "Photos",
      fileSize: "350 MB",
      downloads: "892",
      price: "₹799",
    },
    {
      id: 4,
      title: "Business Proposal Toolkit",
      type: "Templates",
      fileSize: "42 MB",
      downloads: "2,105",
      price: "₹599",
    },
    {
      id: 5,
      title: "Resume & Cover Letter Bundle",
      type: "Templates",
      fileSize: "15 MB",
      downloads: "4,836",
      price: "₹399",
    },
  ],
  courses: [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      lessons: "42",
      duration: "8 weeks",
      level: "Beginner",
      price: "₹6,999",
    },
    {
      id: 2,
      title: "Advanced Python Programming",
      lessons: "36",
      duration: "6 weeks",
      level: "Intermediate",
      price: "₹5,499",
    },
    {
      id: 3,
      title: "Mobile App Design with Figma",
      lessons: "28",
      duration: "4 weeks",
      level: "Beginner",
      price: "₹4,299",
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      lessons: "45",
      duration: "10 weeks",
      level: "Advanced",
      price: "₹8,999",
    },
    {
      id: 5,
      title: "Digital Photography Mastery",
      lessons: "32",
      duration: "5 weeks",
      level: "All Levels",
      price: "₹3,999",
    },
  ],
};

const Explore = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-gray-100 p-4 md:p-6"
    >
      {/* Header */}
      <header className="flex flex-col items-center text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-4">
            <BookOpen className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Explore Resources
          </h1>
          <div className="max-w-2xl">
            <p className="text-lg text-gray-300/80">
              Discover our premium collection of courses, webinars, and digital
              products
            </p>
          </div>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Webinars Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <MonitorPlay className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Upcoming Webinars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {exploreData.webinars.map((webinar) => (
              <motion.div
                key={webinar.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/30 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg mb-3 flex items-center justify-center">
                  <MonitorPlay size={40} className="text-blue-400 opacity-70" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{webinar.title}</h3>
                <p className="text-gray-400 text-sm mb-1">
                  {webinar.instructor}
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  {webinar.date} • {webinar.duration}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-blue-400">
                    {webinar.price}
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                    Details <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Digital Products Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <FileDigit className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Digital Products
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {exploreData.digitalProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/30 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-lg mb-3 flex items-center justify-center">
                  <FileDigit
                    size={40}
                    className="text-emerald-400 opacity-70"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{product.type}</p>
                <p className="text-gray-400 text-xs mb-2">
                  {product.fileSize} • {product.downloads} downloads
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-emerald-400">
                    {product.price}
                  </span>
                  <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1">
                    Download <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Courses Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Featured Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {exploreData.courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg mb-3 flex items-center justify-center">
                  <BookOpen size={40} className="text-purple-400 opacity-70" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{course.level}</p>
                <p className="text-gray-400 text-xs mb-2">
                  {course.lessons} lessons • {course.duration}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-purple-400">
                    {course.price}
                  </span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
                    Enroll <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Explore;
