import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '@/api/auth/auth.hooks';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from ?? '/';
    const [showPass, setShowPass] = useState(false);
    const loginMutation = useLogin();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await loginMutation.mutateAsync(data);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Login failed');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-ivory) 100%)' }}
        >
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="text-3xl tracking-widest font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)', letterSpacing: '0.3em' }}>
                        MAISON
                    </Link>
                    <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: 'var(--color-stone)' }}>Welcome Back</p>
                    <div className="section-divider mx-auto mt-4" />
                </div>

                {/* Form */}
                <div className="p-8" style={{ background: 'var(--color-white)', border: '1px solid #EDE7D9' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--color-stone)' }}>Email</label>
                            <input type="email" {...register('email')} className="input-field" placeholder="your@email.com" />
                            {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: 'var(--color-stone)' }}>Password</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} {...register('password')} className="input-field pr-10" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-stone)' }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password.message}</p>}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-6">
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px" style={{ background: '#EDE7D9' }} />
                        <span className="text-xs" style={{ color: 'var(--color-stone)' }}>or</span>
                        <div className="flex-1 h-px" style={{ background: '#EDE7D9' }} />
                    </div>

                    {/* Google */}
                    <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 text-sm font-medium transition-all hover:bg-ivory border" style={{ borderColor: '#D4C9B5', color: 'var(--color-charcoal)' }}>
                        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" /><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" /><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" /><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" /></svg>
                        Continue with Google
                    </button>
                </div>

                <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-stone)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium hover:opacity-70" style={{ color: 'var(--color-brown)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
}
