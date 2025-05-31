import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LandingPage() {
  const pageStyle = {
    backgroundImage:
      "url('https://blog.wizhob.com/wp-content/uploads/2025/03/Best-Online-Learning-Platforms-for-Students-and-Professionals-in-2025.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const overlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  };

  const contentStyle = {
    position: "relative",
    zIndex: 2,
  };

  const glassStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 2,
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>

      {/* Transparent + Compact Header */}
      <header
        className="px-4 d-flex justify-content-between align-items-center shadow"
        style={{
          ...glassStyle,
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          position: "relative",
        }}
      >
        <h1 className="text-primary fw-bold fs-3 mb-0">EduSync</h1>
        <Link to="/register" className="btn btn-primary btn-sm px-3 py-1">
          Get Started
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center position-relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={contentStyle}
          className="text-center px-3 text-white"
        >
          <h2 className="display-4 fw-bold mb-3">
            Empowering Learning with <span className="text-primary">EduSync</span>
          </h2>
          <p className="lead mb-2">Personalized, efficient and accessible education for all.</p>
          <p className="lead mb-4">Manage courses, quizzes, and progress with ease.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Explore Now
          </Link>
        </motion.div>
      </main>

      {/* Transparent Footer with White Text */}
      <footer
        className="text-white text-center py-2"
        style={{ ...glassStyle, position: "relative" }}
      >
        <small>&copy; 2025 EduSync. All rights reserved.</small>
      </footer>
    </div>
  );
}
