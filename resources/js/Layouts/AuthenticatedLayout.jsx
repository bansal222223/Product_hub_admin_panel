import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500 selection:text-white font-sans relative overflow-x-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[130px] pointer-events-none"></div>
            <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] rounded-full bg-fuchsia-600/5 blur-[150px] pointer-events-none"></div>

            {/* Glowing Top Border */}
            <div className="h-[2px] w-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 sticky top-0 z-50"></div>

            {/* Premium Navigation Bar */}
            <nav className="border-b border-slate-900/80 bg-slate-950/60 backdrop-blur-xl sticky top-[2px] z-40 transition-all duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        
                        {/* Left Side: Brand Logo and Navigation tabs */}
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="flex items-center gap-3 group">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow shadow-fuchsia-500/20 group-hover:scale-105 transition-transform duration-300">
                                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                    </svg>
                                </div>
                                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 duration-300">
                                    Product Hub Console
                                </span>
                            </Link>

                            {/* Active Tab under Dashboard link */}
                            <div className="hidden space-x-8 sm:flex h-16 items-center">
                                <Link
                                    href={route('dashboard')}
                                    className="relative inline-flex items-center px-1 pt-1 text-sm font-extrabold text-white transition duration-200 group"
                                >
                                    <span>Dashboard</span>
                                    {route().current('dashboard') && (
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]"></span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Right Side: Account Dropdown & Menu */}
                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-xl">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-850 bg-slate-900/30 px-4 py-2 text-sm font-bold text-slate-350 transition duration-300 hover:text-white hover:border-violet-500/30 hover:bg-slate-900/60 focus:outline-none"
                                            >
                                                {/* Glowing Live Admin indicator */}
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                
                                                <span>{user.name}</span>

                                                <svg
                                                    className="h-4 w-4 text-slate-450 transition duration-300"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1.5 bg-slate-900/90 border border-slate-850 rounded-xl shadow-2xl backdrop-blur-xl">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="block w-full px-4 py-2.5 text-start text-xs font-bold text-slate-300 transition duration-200 hover:bg-slate-850 hover:text-white"
                                        >
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full px-4 py-2.5 text-start text-xs font-bold text-rose-400 transition duration-200 hover:bg-rose-950/20 hover:text-rose-300 border-t border-slate-850/60 mt-1"
                                        >
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Navigation Toggle */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 border border-slate-850 bg-slate-900/30 text-slate-400 transition duration-200 hover:text-white hover:bg-slate-900/60 focus:outline-none"
                            >
                                <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block animate-fade-in' : 'hidden') + ' sm:hidden border-t border-slate-900/80 bg-slate-950/95 backdrop-blur-xl'}>
                    <div className="space-y-1.5 px-4 pb-4 pt-3">
                        <Link
                            href={route('dashboard')}
                            className="block w-full rounded-xl bg-slate-900/40 px-4 py-2.5 text-sm font-bold text-white border border-slate-850/65"
                        >
                            Dashboard
                        </Link>
                    </div>

                    <div className="border-t border-slate-900 px-4 py-4 space-y-3 bg-slate-950/40">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            <div>
                                <div className="text-sm font-bold text-white">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <Link
                                href={route('profile.edit')}
                                className="block rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900/60 hover:text-white border border-transparent hover:border-slate-850"
                            >
                                Profile Settings
                            </Link>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="block w-full text-left rounded-xl px-4 py-2.5 text-xs font-bold text-rose-450 hover:bg-rose-950/20 hover:text-rose-400 border border-transparent hover:border-rose-900/20"
                            >
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Premium Subheader/Context Header */}
            {header && (
                <header className="border-b border-slate-900/65 bg-slate-950/30 backdrop-blur-md relative z-10">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex justify-between items-center">
                        {header}
                    </div>
                </header>
            )}

            {/* Content area */}
            <main className="relative z-10">{children}</main>
        </div>
    );
}
