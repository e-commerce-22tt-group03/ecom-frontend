import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!email.trim()) {
            alert("Email is required!");
            return;
        }
        
        if (!password) {
            alert("Password is required!");
            return;
        }
        
        dispatch(loginUser({ 
            email: email.trim(), 
            password: password 
        }));
    };

    return (
        <div className="flex min-h-screen w-screen overflow-hidden">
            {/* Left: Login Form */}
            <div className="flex-1 flex items-center justify-center h-screen">
                <div className="card shadow-xl w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-md p-0">
                        <div className="mb-10 flex flex-col">
                            <span href="/" className="text-3xl font-bold text-primary mb-[100px]">🌸 LazaHoa</span>
                            <h2 className="text-lg font-semibold text-base-content">Login</h2>
                        </div>
                        
                        {/* Error Display */}
                        {error && (
                            <div className="alert alert-error mb-4">
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="form-control">
                                <label htmlFor="email" className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered w-full"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="password" className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input input-bordered w-full pr-10"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-2 flex items-center text-base-content/60"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.036 3.807 6.06 6.75 9.75 6.75 1.563 0 3.06-.362 4.396-1.01M6.53 6.53A10.45 10.45 0 0 1 12 5.25c3.69 0 7.714 2.943 9.75 6.75a10.49 10.49 0 0 1-2.042 2.73M6.53 6.53l10.94 10.94M6.53 6.53 3.98 8.223M17.47 17.47l2.55-1.693" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S6.273 5.25 12 5.25 21.75 12 21.75 12 17.727 18.75 12 18.75 2.25 12 2.25 12z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                                <a className="link link-hover text-primary" href="/register">Create an account</a>
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary px-8 ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'LOGIN'}
                                </button>
                            </div>
                        </form>
                        <div className="flex justify-between mt-10 text-xs text-base-content/60">
                            <a href="#" className="link link-hover">Terms & Conditions</a>
                            <a href="#" className="link link-hover">Privacy Policy</a>
                            <a href="#" className="link link-hover">Forgot password</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right: Cover Image */}
            <div className="hidden md:block flex-1 h-screen bg-cover bg-center" style={{ backgroundImage: "url('/cover.png')" }}></div>
        </div>
    );
};

export default LoginPage;