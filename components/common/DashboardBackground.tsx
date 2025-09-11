import { FC } from "react";

const DashboardBackground: FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Primary grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Animated gradient orbs with enhanced effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-cyan-400/8 to-indigo-500/10 rounded-full blur-3xl animate-pulse opacity-60 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/8 via-pink-400/6 to-rose-500/8 rounded-full blur-3xl animate-pulse opacity-50 animate-[float_8s_ease-in-out_infinite_reverse] delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 via-teal-400/5 to-cyan-500/5 rounded-full blur-3xl opacity-40 animate-[float_10s_ease-in-out_infinite] delay-2000" />

      {/* Enhanced floating particles with glow effects */}
      <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce delay-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
      <div className="absolute top-3/4 right-1/6 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce delay-700 shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-emerald-400/30 rounded-full animate-bounce delay-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]" />
      <div className="absolute top-2/3 right-1/3 w-2.5 h-2.5 bg-cyan-400/30 rounded-full animate-bounce delay-1000 shadow-[0_0_12px_rgba(6,182,212,0.3)]" />

      {/* Additional decorative elements */}
      <div className="absolute top-1/6 right-1/6 w-4 h-4 border border-blue-400/20 rounded-full animate-spin duration-[20s]" />
      <div className="absolute bottom-1/6 left-1/6 w-3 h-3 border border-purple-400/20 rounded-full animate-spin duration-[25s] animate-reverse" />

      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/20 to-background/40" />

      {/* Radial gradient mask for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.03),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.02),transparent_50%)]" />
    </div>
  );
};

export default DashboardBackground;
