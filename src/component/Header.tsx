"use client";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg text-white flex items-center justify-between px-8 py-4 z-50 border-b border-white/10">
      <h1 className="text-2xl font-bold tracking-wide">CodeBuddy</h1>

      <button className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all duration-300">
        Sign Up
      </button>
    </nav>
  );
};

export default Navbar;
