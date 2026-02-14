class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
          <div className="text-center p-8 bg-[var(--bg-card)] rounded-xl border border-red-900/50">
            <div className="icon-triangle-alert text-4xl text-red-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-white mb-2">System Malfunction</h1>
            <p className="text-gray-400 mb-6">Critical error detected in the core loop.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LandingPage() {
    try {
        return (
            <div className="min-h-screen flex flex-col relative overflow-x-hidden" data-name="landing-page" data-file="unlogged.js">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none z-0"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--primary-color)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

                <Navigation activePage="home" />

                <main className="flex-grow relative z-10">
                    <Hero />
                  
                    <p>You're not logged in!</p>
                    <section className="py-20 border-t border-slate-800 bg-slate-900/50">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-2xl font-bold mb-8">Ready to energize your workflow?</h2>
                            <a href="playground.html" className="btn btn-primary text-lg">
                                <span className="mr-2">Start Building</span>
                                <div className="icon-arrow-right"></div>
                            </a>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        );
    } catch (error) {
        console.error("LandingPage Error:", error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LandingPage />
  </ErrorBoundary>
);