import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from '../HomePage'; // Path relative to src/components/
import HistoricoPage from '../HistoricoPage'; // Path relative to src/components/
import DashboardPage from '../DashboardPage'; // Path relative to src/components/
import AboutPage from '../About'; // Path relative to src/components/

const pageVariants = {
  initial: {
    opacity: 0,
    // Using a subtle slide from the side
    x: "-20px"
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    // Using a subtle slide to the other side
    x: "20px"
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate", // Can adjust easing
  duration: 0.4 // Slightly faster transition
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait"> {/* 'wait' ensures one page animates out before the next animates in */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ position: 'absolute', width: '100%' }} // Keep pages from stacking during transition
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/historico"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ position: 'absolute', width: '100%' }}
            >
              <HistoricoPage />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ position: 'absolute', width: '100%' }}
            >
              <DashboardPage />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ position: 'absolute', width: '100%' }}
            >
              <AboutPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes; 