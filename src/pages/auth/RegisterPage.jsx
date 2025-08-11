import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../features/auth/authSlice';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Handle successful registration
  useEffect(() => {
    if (registrationSuccess && !isLoading && !error) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); // Navigate to login after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, isLoading, error, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!fullName.trim()) {
      alert("Full name is required!");
      return;
    }

    if (!email.trim()) {
      alert("Email is required!");
      return;
    }

    if (!password) {
      alert("Password is required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Send data with correct field names matching backend expectations
    const resultAction = await dispatch(registerUser({
      full_name: fullName,
      email: email.trim(),
      password: password,
      confirm_password: confirmPassword
    }));

    // Check if registration was successful
    if (registerUser.fulfilled.match(resultAction)) {
      setRegistrationSuccess(true);
    }
  };

  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      {/* Left: Register Form */}
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="card shadow-xl w-full h-full flex items-center justify-center">
          <div className="w-full max-w-md p-0">
            <div className="mb-10 flex flex-col">
              <span href="/" className="text-3xl font-bold text-primary mb-[100px]">🌸 LazaHoa</span>
              <h2 className="text-lg font-semibold text-base-content">Sign Up</h2>
            </div>

            {/* Success Message */}
            {registrationSuccess && !error && (
              <div className="alert alert-success mb-4">
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="form-control">
                <label htmlFor="fullName" className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input input-bordered w-full"
                  autoComplete="name"
                  required
                  disabled={registrationSuccess}
                />
              </div>

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
                  disabled={registrationSuccess}
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
                    autoComplete="new-password"
                    required
                    minLength="6"
                    disabled={registrationSuccess}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-base-content/60"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={registrationSuccess}
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

              <div className="form-control">
                <label htmlFor="confirmPassword" className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input input-bordered w-full pr-10"
                    autoComplete="new-password"
                    required
                    disabled={registrationSuccess}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-base-content/60"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    disabled={registrationSuccess}
                  >
                    {showConfirmPassword ? (
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

              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || registrationSuccess}
              >
                {registrationSuccess ? 'Registration Successful!' : isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>

              <div className="text-center text-sm">
                <a href="/login" className="link link-primary">
                  Already have an account?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Right: Cover Image */}
      <div className="hidden md:block flex-1 h-screen bg-cover bg-center" style={{ backgroundImage: "url('/cover.png')" }}></div>
    </div>
  );
};

export default RegisterPage;