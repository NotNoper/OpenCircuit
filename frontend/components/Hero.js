function Hero() {
    try {
        return (
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        v1.0 Public Beta is Live
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Build Robots <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 text-glow">Faster</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The all-in-one platform for robotics engineers. Simulate circuits, get AI-powered assembly guides, and find specs in seconds.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a href="playground.html" className="btn btn-primary text-lg w-full md:w-auto group">
                            Launch Playground
                            <div className="icon-zap ml-2 group-hover:text-yellow-300 transition-colors"></div>
                        </a>
                        <a href="#features" className="btn btn-outline text-lg w-full md:w-auto">
                            Explore Tools
                        </a>
                    </div>
                </div>
                
                {/* Decorative circuit lines */}
                <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform -translate-y-1/2 -rotate-12 opacity-30"></div>
                <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transform translate-y-1/2 rotate-12 opacity-30"></div>
            </section>
        );
    } catch (error) {
        console.error("Hero Error:", error);
        return null;
    }
}