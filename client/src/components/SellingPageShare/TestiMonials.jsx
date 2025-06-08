// Testimonials.jsx
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const Testimonials = ({ title, testimonialsData, defaultProfilePic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerView, testimonialsData.length - itemsPerView)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <div className="relative px-4">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-orange-500 p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= testimonialsData.length - itemsPerView}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-orange-500 p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Testimonials Container */}
          <div className=" px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData
              .slice(currentIndex, currentIndex + itemsPerView)
              .map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2"
                >
                  <div className="flex flex-col items-center mb-6">
                    <motion.img
                      src={testimonial.profilePic || defaultProfilePic}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                    <div className="text-center mt-4">
                      <h3 className="font-bold text-white text-xl">
                        {testimonial.name}
                      </h3>
                      <div className="flex justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonial.rating
                                ? "text-yellow-300 fill-current"
                                : "text-white/30 fill-current"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 text-center italic">
                    "{testimonial.statement}"
                  </p>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-10 gap-2">
          {Array.from({
            length: Math.ceil(testimonialsData.length / itemsPerView),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex / itemsPerView === index
                  ? "bg-orange-500 w-6"
                  : "bg-gray-600"
              }`}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
