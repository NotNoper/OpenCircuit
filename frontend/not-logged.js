function NotLoggedApp() {
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
                        <h1 className="text-2xl font-bold mb-2">You're not logged in!</h1>
                        <p className="text-slate-400">Sign in to access your projects and simulations.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);
