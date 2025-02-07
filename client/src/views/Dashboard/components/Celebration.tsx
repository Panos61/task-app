import { motion, AnimatePresence } from 'framer-motion';
import unicorn from '@assets/unicorn.svg';

interface Props {
  isVisible: boolean;
  onAnimationComplete: () => void;
}

const Celebration = ({ isVisible, onAnimationComplete }: Props) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
        >
          <motion.div
            initial={{ x: '-100vw', y: '100vh', scale: 0.5 }}
            animate={{
              x: ['0vw', '100vw'],
              y: ['0vh', '-100vh'],
              scale: [2, 2],
              rotate: [0, -10, 10, -10, 10, 0],
              transition: {
                duration: 0.7,
                times: [0.6, 1],
                rotate: {
                  times: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
                }
              }
            }}
            onAnimationComplete={onAnimationComplete}
          >
            <img 
              src={unicorn} 
              alt="Celebration" 
              className="size-64"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 

export default Celebration;