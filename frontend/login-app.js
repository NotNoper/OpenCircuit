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
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Logging in with:', email);
        await Login(email, password);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation component */}
            <Navigation activePage="login" />

            <main className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
                {/* background blurs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-md bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl relative z-10">
                    {/* form content */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);