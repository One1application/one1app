import { motion } from "framer-motion";

const ComingSoonSection = () => {
  const categories = [
    {
      imageUrl:
        "https://media.istockphoto.com/id/1387900612/photo/automation-data-analytic-with-robot-and-digital-visualization-for-big-data-scientist.webp?a=1&b=1&s=612x612&w=0&k=20&c=2iILS0WPh_D-MDMJiIw_14bg6IgJarMUYtDH4D0nIho=",
      icon: "🤖",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdlYnNpdGV8ZW58MHx8MHx8fDA%3D",
      icon: "💻",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29tbXVuaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      icon: "👥",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D",
      icon: "⚡",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-4xl font-extrabold text-center mb-12">
        Wait until we launch - Future is here
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="relative rounded-xl overflow-hidden h-64 group"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center filter blur-sm"
              style={{ backgroundImage: `url(${category.imageUrl})` }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

            <div className="relative h-full flex flex-col items-center justify-end p-6 text-center">
              <motion.div
                className="text-6xl mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                whileHover={{ rotate: 10 }}
              >
                {category.icon}
              </motion.div>

              <motion.div
                className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.1 }}
              >
                COMING SOON
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoonSection;
