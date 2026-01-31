function Footer() {
    try {
        return (
            <footer className="border-t border-slate-800 bg-[var(--bg-dark)] py-12 mt-auto">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="icon-cpu text-cyan-400"></div>
                                <span className="font-bold text-xl">Open Circuit</span>
                            </div>
                            <p className="text-slate-400 max-w-sm mb-4">
                                Empowering makers and engineers with next-generation tools for robotics development and simulation.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-500 transition-all">
                                    <div className="icon-twitter w-4 h-4"></div>
                                </a>
                                <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-500 transition-all">
                                    <div className="icon-github w-4 h-4"></div>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold mb-4">Tools</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="playground.html" className="hover:text-cyan-400 transition-colors">Component Playground</a></li>
                                <li><a href="assembly.html" className="hover:text-cyan-400 transition-colors">Assembly Assistant</a></li>
                                <li><a href="datasheets.html" className="hover:text-cyan-400 transition-colors">Datasheet Lookup</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-bold mb-4">Community</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Forum</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Project Hub</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                        <p>&copy; 2026 Open Circuit. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-300">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    } catch (error) {
        console.error("Footer Error:", error);
        return null;
    }
}