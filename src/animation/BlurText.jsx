import { motion } from 'framer-motion';

const BlurText = ({ text = '', className = '' }) => {
  // Split text into words safely
  const words = text.split(' ');

  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          // 1. Initial State: Invisible, blurred, slightly lower
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          // 2. Animate To: Visible, clear, normal position
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          // 3. Transition: Smooth ease, staggered delay based on index
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2, // 0.2s delay between each word
            ease: "easeOut"
          }}
          // Add margin to separate words
          className="inline-block mx-2 md:mx-4"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;