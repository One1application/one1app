import * as Icons from "lucide-react";
import NavBar from "./NavBar";
import { courseConfig } from "./courseConfig";

import oneApp from "../../../../assets/oneapp.jpeg";

const NewCourse = () => {
  const CurrencyIcon = Icons[courseConfig.currencySymbol];

  return (
    <div className="min-h-screen bg-gray-50 scrollbar-hide overflow-y-scroll">
      <NavBar
        logo={courseConfig.logo}
        profilePhoto={courseConfig.profilePhoto}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            {courseConfig.title}
          </h1>
          <button className="bg-white text-orange-500 py-3 px-8 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300 shadow-lg inline-flex items-center space-x-2">
            <span>Enroll for</span>
            {CurrencyIcon && <CurrencyIcon className="w-5 h-5" />}
            <span>{courseConfig.price}</span>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              About the Course
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {courseConfig.aboutThisCourse.description}
            </p>
            <ul className="space-y-4">
              {courseConfig.aboutThisCourse.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <Icons.CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* cover image */}
      {courseConfig.coverImage.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <img
              src={courseConfig.coverImage.value}
              alt={courseConfig.coverImage.altText}
              className="w-full h-80"
            />
          </div>
        </section>
      )}

      {/* course language */}
      {courseConfig.language.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.language.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courseConfig.language.value.map((language, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="text-xl font-semibold text-gray-800">
                    {language}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Benefits */}
      {courseConfig.courseBenefits.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.courseBenefits.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courseConfig.courseBenefits.benefitsMetaData.map(
                (benefit, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="text-xl font-semibold text-gray-800">
                      {benefit.emoji} {benefit.title}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {courseConfig.testimonials.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.testimonials.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courseConfig.testimonials.testimonialsMetaData.map(
                (testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.profilePic || oneApp}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">
                          {testimonial.name}
                        </h3>
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Icons.Star
                              key={i}
                              className="w-4 h-4 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{testimonial.description}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {courseConfig.faQ.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.faQ.title}
            </h2>
            <div className="space-y-6">
              {courseConfig.faQ.faQMetaData.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {courseConfig.gallery.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.gallery.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courseConfig.gallery.imageMetaData.map((image, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={image.imageLink || oneApp}
                    alt={image.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      {courseConfig.products.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.products.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {courseConfig.products.productMetaData.map((product, index) => (
                <a
                  key={index}
                  href={product.productLink}
                  className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-orange-500 font-semibold">
                    {CurrencyIcon && <CurrencyIcon className="w-5 h-5 mr-1" />}
                    <span>{product.price}</span>
                  </div>
                  <Icons.ArrowRight className="w-6 h-6 text-orange-500 absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* lesson section */}
      {courseConfig.lessons.isActive && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
              {courseConfig.lessons.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {courseConfig.lessons.lessonData.map((lesson, index) => (
                <a
                  key={index}
                  href={lesson.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-500">{lesson.description}</p>
                  <Icons.Play className="w-6 h-6 text-blue-500 absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Ready to Start Learning?
          </h2>
          <button className="bg-white text-orange-500 py-3 px-8 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300 shadow-lg inline-flex items-center space-x-2">
            <span>Enroll Now for</span>
            {CurrencyIcon && <CurrencyIcon className="w-5 h-5" />}
            <span>{courseConfig.price}</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewCourse;