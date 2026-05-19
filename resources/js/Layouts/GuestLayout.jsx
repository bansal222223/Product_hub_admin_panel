import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 overflow-hidden font-sans">
            
            {/* Left Side: Stunning Hero Panel (SaaS Marketing/Product Preview Showcase) */}
            <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-r border-slate-900 overflow-hidden">
                {/* Dot Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
                
                {/* Vibrant Glowing neon orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-fuchsia-600/20 blur-[130px] animate-pulse duration-[7000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-cyan-500/20 blur-[130px] animate-pulse duration-[8000ms]"></div>
                <div className="absolute top-[40%] left-[30%] w-80 h-80 rounded-full bg-violet-600/15 blur-[120px] animate-pulse duration-[6000ms]"></div>

                {/* Top: Logo & Title */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/25 transition-transform hover:scale-105 duration-350">
                        <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-fuchsia-400 via-violet-250 to-cyan-400 bg-clip-text text-transparent">
                        Product Hub Console
                    </span>
                </div>

                {/* Middle: Premium Stats Showcase Widget */}
                <div className="relative z-10 my-auto space-y-8">
                    <div className="space-y-4">
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-500/20 via-violet-500/20 to-cyan-500/20 px-3.5 py-1 text-xs font-bold text-fuchsia-300 border border-fuchsia-500/30 shadow-sm shadow-fuchsia-500/10">
                            ✨ Enterprise v2.4 Active
                        </span>
                        <h1 className="text-4.5xl font-black leading-tight text-white tracking-tight">
                            Manage inventory with <br />
                            <span className="bg-gradient-to-r from-fuchsia-450 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                surgical precision.
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                            Control assets, configure multiple high-fidelity images, search instantly, and query with price filters in real-time.
                        </p>
                    </div>

                    {/* Miniature Dashboard Preview Widget */}
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-md space-y-5 max-w-sm hover:border-violet-500/30 transition-all duration-500 group">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span className="text-xs font-bold text-slate-350">Hub Monitor</span>
                            </div>
                            <span className="text-xs text-fuchsia-400 font-bold bg-fuchsia-950/30 px-2 py-0.5 rounded-full border border-fuchsia-900/30">Live Syncing</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-slate-900/60 p-3.5 border border-slate-850 transition hover:border-slate-800">
                                <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-widest">Active Items</span>
                                <p className="text-2xl font-black text-white mt-1">1,482</p>
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                                    ↑ 12% today
                                </span>
                            </div>
                            <div className="rounded-2xl bg-slate-900/60 p-3.5 border border-slate-850 transition hover:border-slate-800">
                                <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-widest">Total Value</span>
                                <p className="text-2xl font-black text-white mt-1">$48.2K</p>
                                <div className="w-full bg-slate-850 h-2 rounded-full mt-2.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 h-full w-[70%] rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Seeded mock product row */}
                        <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-850/60 transition group-hover:border-violet-500/20">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-violet-600 flex items-center justify-center text-xs font-black text-white shadow shadow-fuchsia-500/20">
                                CK
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">CyberKeyboard X9</h4>
                                <p className="text-[10px] text-slate-550 truncate">Mechanical hot-swap switches</p>
                            </div>
                            <span className="text-xs font-extrabold text-cyan-400">$189.99</span>
                        </div>
                    </div>
                </div>

                {/* Bottom: Review / Quote */}
                <div className="relative z-10 border-t border-slate-900 pt-6">
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                        "The ultimate command center for product management. Clean glassmorphism layout, lighting fast searches, and bulletproof security."
                    </p>
                    <div className="mt-4 flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center text-[10px] font-black text-white shadow shadow-violet-500/20">
                            AD
                        </div>
                        <span className="text-xs font-bold text-slate-300">Admin Panel Lead</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Clean Centered Auth Container */}
            <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 relative">
                
                {/* Glowing background orbs on mobile screen */}
                <div className="absolute top-[20%] right-[10%] -z-10 w-80 h-80 rounded-full bg-fuchsia-600/5 blur-[96px] animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[10%] -z-10 w-80 h-80 rounded-full bg-cyan-600/5 blur-[96px] animate-pulse"></div>
                
                <div className="mx-auto w-full max-w-md space-y-8">
                    {/* Header Area */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <Link href="/" className="lg:hidden group flex items-center gap-3 rounded-2xl bg-slate-900/60 p-2.5 border border-slate-800/80 backdrop-blur-xl shadow-xl transition-all duration-300 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-fuchsia-600 to-cyan-500 text-white shadow-lg">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>
                            </div>
                        </Link>
                        
                        <h2 className="text-4.5xl font-black tracking-tight text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Provide credentials to authenticate and manage product hubs
                        </p>
                    </div>

                    {/* Premium Glassmorphic Auth Form */}
                    <div className="overflow-hidden rounded-3xl border border-slate-850 bg-slate-900/20 p-8 shadow-2xl backdrop-blur-xl hover:border-violet-500/25 transition-all duration-500 shadow-indigo-950/20">
                        {children}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
