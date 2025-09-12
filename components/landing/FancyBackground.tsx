const FancyBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_100%_60%_at_50%_0%,#000_40%,transparent_100%)] animate-pulse-slow" />

      {/* Floating gradient orbs with enhanced animations */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-300/15 to-yellow-300/15 rounded-full blur-3xl opacity-50 animate-float" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-300/12 to-violet-300/12 rounded-full blur-3xl opacity-35 animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-200/4 to-yellow-200/4 rounded-full blur-3xl animate-pulse-slow" />

      {/* Additional floating elements */}
      <div className="absolute top-1/6 right-1/3 w-32 h-32 bg-gradient-to-r from-sky-300/12 to-blue-300/12 rounded-full blur-2xl opacity-60 animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 left-1/6 w-48 h-48 bg-gradient-to-r from-violet-300/8 to-pink-300/8 rounded-full blur-2xl opacity-45 animate-[float_10s_ease-in-out_infinite_reverse]" />

      {/* Subtle particle-like dots */}
      <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-orange-300/35 rounded-full animate-pulse" />
      <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-yellow-300/40 rounded-full animate-pulse delay-300" />
      <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-emerald-300/45 rounded-full animate-pulse delay-700" />
      <div className="absolute top-1/6 right-1/6 w-2.5 h-2.5 bg-violet-300/25 rounded-full animate-pulse delay-1000" />

      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-orange-300/3 to-transparent animate-shine" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-transparent via-emerald-300/2 to-transparent animate-shine-delayed" />
      </div>
    </div>
  );
};

export default FancyBackground;
