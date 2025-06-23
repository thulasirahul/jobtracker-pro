import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[600px] h-[600px] bg-blue-500 blur-[120px] rounded-full opacity-30 animate-pulse top-10 left-10" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500 blur-[100px] rounded-full opacity-30 animate-ping bottom-10 right-10" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500 blur-[80px] rounded-full opacity-30 animate-bounce top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
