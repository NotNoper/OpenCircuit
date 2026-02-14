async function Login(email, password) {
    try {
        const response = await fetch(
            "https://nikovision.onrender.com/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        const result = await response.text(); 
        console.log(result);
        if(result == null ) {
            alert("Email or Password is wrong");
        }
        else
        {
            alert("Loggin in!");
            window.location.href = 'index.html';
        }
    } catch (err) {
        console.error("Failed:", err);
        alert("Failed.");
    }
}

function LoginApp() {
    try {
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');

        const handleLogin = (e) => {
            e.preventDefault();
            console.log('Logging in with:', email);
            Login(email, password);
        };

        return (
            <div className="min-h-screen flex flex-col" data-name="login-app">
                <Navigation activePage="login" />
                
                <main className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 mb-4">
                                <div className="icon-lock text-cyan-400 text-xl"></div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                            <p className="text-slate-400">Sign in to access your projects and simulations.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
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
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer">
                                    <div className="content">
                                        <label className="checkBox">
                                            <input id="ch1" type="checkbox" />
                                            <div className="transition"></div>
                                        </label>
                                    </div>
                                    <label htmlFor="ch1">Remember me</label>
                                </div>

                                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                                    Forgot password?
                                </a>
                            </div>

                            <style>{`
                                .checkBox {
                                display: block;
                                cursor: pointer;
                                width: 18px;
                                height: 18px;
                                border: 3px solid rgba(255, 255, 255, 0);
                                border-radius: 10px;
                                position: relative;
                                overflow: hidden;
                                box-shadow: 0px 0px 0px 2px #fff;
                                }

                                .checkBox div {
                                width: 60px;
                                height: 60px;
                                background-color: #fff;
                                top: -52px;
                                left: -52px;
                                position: absolute;
                                transform: rotateZ(45deg);
                                z-index: 100;
                                }

                                .checkBox input[type=checkbox]:checked + div {
                                left: -10px;
                                top: -10px;
                                }

                                .checkBox input[type=checkbox] {
                                position: absolute;
                                left: 50px;
                                visibility: hidden;
                                }

                                .transition {
                                transition: 300ms ease;
                                }
                                `}</style>

                            <button type="submit" className="btn btn-primary w-full py-3">
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-400">
                            Don't have an account? <a href="signup.html" className="text-cyan-400 hover:text-cyan-300 font-medium">Create one now</a>
                        </div>
                    </div>
                </main>
                
                <Footer />
            </div>
        );
    } catch (error) {
        console.error("LoginApp Error:", error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);