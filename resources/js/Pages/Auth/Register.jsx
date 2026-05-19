import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <form onSubmit={submit} className="space-y-5">
                {/* Full Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                        Full Name
                    </label>
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            required
                            value={data.name}
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-xs font-medium text-rose-450">{errors.name}</p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                        Email Address
                    </label>
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none transition-colors"
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs font-medium text-rose-450">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                        Password
                    </label>
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            value={data.password}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs font-medium text-rose-450">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-300">
                        Confirm Password
                    </label>
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            required
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-xs font-medium text-rose-450">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Action Submit */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                        {processing ? (
                            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </div>

                {/* Login Call to Action */}
                <div className="text-center pt-2">
                    <p className="text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
