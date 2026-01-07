'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // In a real app with Supabase Auth configured:
        // const { error } = await supabase.auth.signInWithPassword({ email, password });

        // For DEMO purposes, we'll simulate a successful login with a "mock" check
        // REMOVE THIS for production
        if (email === 'admin@aurasalon.com' && password === 'admin') {
            // Set a cookie or local storage to simulate session for the demo
            localStorage.setItem('aura_admin_session', 'true');
            router.push('/admin');
            return;
        }

        // Real Supabase Auth fallback (if they actually connected it)
        const { error: supabaseError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (supabaseError) {
            setError(supabaseError.message);
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    return (
        <main className="min-h-screen grid place-items-center bg-cream-50 px-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl border border-cream-200 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-charcoal-900 rounded-full flex items-center justify-center mx-auto mb-4 text-cream-50">
                        <Lock size={20} />
                    </div>
                    <h1 className="font-serif text-2xl text-charcoal-900">Admin Access</h1>
                    <p className="text-charcoal-800/60 text-sm">Enter your credentials to view metrics.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-800/50 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-cream-50 focus:outline-none focus:border-terracotta-500 transition-colors"
                            placeholder="admin@aurasalon.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-800/50 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-cream-50 focus:outline-none focus:border-terracotta-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-charcoal-900 text-white rounded-lg font-medium hover:bg-terracotta-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </main>
    );
}
