function FeatureCard({ title, description, icon, link, actionText, color, delay }) {
    try {
        return (
            <a href={link} className="block group">
                <div className="card h-full flex flex-col items-start relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300">
                    {/* Hover Glow */}
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${color.replace('text-', 'bg-')}`}></div>
                    
                    <div className={`w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${color}`}>
                        <div className={`icon-${icon} text-2xl`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{title}</h3>
                    <p className="text-slate-400 mb-6 flex-grow leading-relaxed">
                        {description}
                    </p>
                    
                    <div className={`flex items-center text-sm font-bold ${color}`}>
                        {actionText}
                        <div className="icon-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></div>
                    </div>
                </div>
            </a>
        );
    } catch (error) {
        console.error("FeatureCard Error:", error);
        return null;
    }
}