async function Signup() {
    try {
        const response = await fetch(
            "https://nikovision.onrender.com/signup",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            }
        );

        window.location.href = 'login.html';
    } catch (err) {
        console.error("Failed:", err);
        alert("Failed.");
    }
}

function SignupApp() {
    try {
        const [fullName, setFullName] = React.useState('');
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');

        const handleSignup = (e) => {
            e.preventDefault();
            console.log('Signing up with:', { fullName, email });
            SignupApp();
        };

        return (
            <div className="min-h-screen flex flex-col" data-name="signup-app">
                <Navigation activePage="signup" />
                
                <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 mb-4">
                                <div className="icon-user-plus text-cyan-400 text-xl"></div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                            <p className="text-slate-400">Join the community of robotics engineers.</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="icon-user text-slate-500"></div>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="input-field pl-10" 
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="icon-mail text-slate-500"></div>
                                    </div>
                                    <input 
                                        type="email" 
                                        className="input-field pl-10" 
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="icon-key text-slate-500"></div>
                                    </div>
                                    <input 
                                        type="password" 
                                        className="input-field pl-10" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters long.</p>
                            </div>

                            <button type="submit" className="btn btn-primary w-full py-3">
                                Create Account
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-400">
                            Already have an account? <a href="login.html" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</a>
                        </div>
                    </div>
                </main>
                
                <Footer />
            </div>
        );
    } catch (error) {
        console.error("SignupApp Error:", error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SignupApp />);