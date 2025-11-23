import React from "react";
import Navbar from "./Navbar";
import LightRays from "./LightRays";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen text-gray-100 relative overflow-hidden">
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={2}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.1}
          distortion={0.08}
          className="custom-rays"
        />
      </div>

      <Navbar />

      <div className="absolute bg-black h-full w-full overflow-y-auto thin-scrollbar">{children}</div>
    </div>
  );
}
