import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
// import { Link } from "react-router-dom";

import Animation from "../HomePage/Animation";
import { Instagram, LinkedIn, Twitter } from "developer-icons";
const socialLinks = [
  // { icon: <YouTube size={20} />, href: "https://www.youtube.com/@OneApp8" },
  // { icon: <Facebook size={20} />, href: "https://www.facebook.com" },
  // { icon: <Pinterest size={20} />, href: "https://in.pinterest.com/one1app/" },
  { icon: <Twitter size={20} />, href: "https://www.twitter.com" },
  {
    icon: <Instagram size={20} />,
    href: "https://www.instagram.com/one_1app/",
  },
  {
    icon: <LinkedIn size={20} />,
    href: "https://www.linkedin.com/company/one1app/",
  },
];
const ContactUsPage = () => {
  return (
    <div className=" relative w-full min-h-screen max-h-full flex flex-col items-center justify-center bg-slate-900">
      <div className="hidden lg:block w-60 h-60 rounded-full fixed bg-orange-600 z-40 scale-150 -left-10 bottom-0"></div>
      <div className="hidden lg:block w-60 h-60 rounded-full fixed bg-orange-600 z-40 scale-150 -right-10 top-0"></div>
      <div className="relative z-50 w-full max-w-6xl lg:px-28 min-h-96  flex flex-col-reverse lg:flex-row  justify-between items-center m-0 lg:my-10 rounded-2xl bg-slate-950 text-gray-400">
        <ContactForm />
        <div className="flex flex-col items-center justify-between w-full h-full">
          <Contact_Animation />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;

const ContactForm = () => {
  return (
    <div className="flex flex-col items-start justify-center capitalize w-full max-w-xl p-10 gap-3">
      <p className="text-3xl font-bold">Let&apos;s Talk</p>
      <p className="text-sm">
        The OneApp Contact Form provides a seamless way to connect with us.
        Whether you have inquiries, feedback, or collaboration requests, our
        intuitive form ensures quick and efficient communication. Designed with
        a user-friendly interface, it includes essential fields like name,
        email, and message, making it easy to reach out. Stay connected and let
        us help you enhance your digital experience.
      </p>
      <form className="flex flex-col gap-3" action="" method="post">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullname">Your name</label>
          <input
            className="w-full outline-none border-none text-sm rounded-full px-4 py-2 bg-slate-800"
            type="text"
            name="fullname"
            id="fullname"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Your email</label>
          <input
            className="w-full outline-none border-none text-sm rounded-full px-4 py-2 bg-slate-800"
            type="email"
            name="email"
            id="email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message">Message</label>
          <textarea
            className="w-full outline-none border-none text-sm rounded-lg px-4 py-2 bg-slate-800"
            name="message"
            id="message"
            cols="50"
            rows="10"
          ></textarea>
        </div>
        <div className="btn my-5">
          <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 py-2 ">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div className="flex flex-col items-start justify-center capitalize w-full h-max max-w-xl p-10 gap-3 mt-48 text-orange-500 font-light tracking-wider">
      <div className="flex flex-col gap-3 items-start justify-center">
        <div className="flex flex-row gap-3 justify-center items-center">
          <span className="">
            <FaLocationDot />
          </span>
          <p className="">
            FG 103, Plot No: 15 Orient Residency Jaipur, 302029
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-center items-center">
          <span className="">
            <FaPhoneAlt />
          </span>
          <p className="">+91 1234567890</p>
        </div>
        <div className="flex flex-row gap-3 justify-center items-center">
          <span className="">
            <MdEmail />
          </span>
          <p className="">hello@one1app.com</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            className="bg-slate-800 p-3 rounded-full  transition-colors duration-200 text-gray-400 hover:bg-gray-500 hover:text-white"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

const Contact_Animation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black mt-56">
      <Animation />
    </div>
  );
};
