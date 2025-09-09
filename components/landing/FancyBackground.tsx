const FancyBackground = () => {
  return (
    <div className="absolute">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_100%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-3xl  opacity-60" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-rose-400/15 to-pink-400/15 rounded-full blur-3xl  delay-1000 opacity-40" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-300/5 to-amber-300/5 rounded-full blur-3xl  delay-2000" />
    </div>
  );
};

export default FancyBackground;
