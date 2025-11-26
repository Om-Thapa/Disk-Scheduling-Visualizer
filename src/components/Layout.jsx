import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen text-gray-100 relative overflow-hidden">
      {/* LightRays removed to disable background animation */}

      <Navbar />

      <div className="absolute bg-black h-full w-full overflow-y-auto thin-scrollbar">{children}</div>
    </div>
  );
}
