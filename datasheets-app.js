function DatasheetsApp() {
    try {
        const [search, setSearch] = React.useState('');
        const results = [
            { name: 'ATMega328P', type: 'Microcontroller', package: 'DIP-28', voltage: '1.8V - 5.5V' },
            { name: 'LM7805', type: 'Voltage Regulator', package: 'TO-220', voltage: 'Output 5V' },
            { name: 'NE555', type: 'Timer IC', package: 'DIP-8', voltage: '4.5V - 15V' },
            { name: 'MPU-6050', type: 'IMU Sensor', package: 'QFN-24', voltage: '2.375V - 3.46V' },
            { name: 'L298N', type: 'Motor Driver', package: 'Multiwatt15', voltage: 'Up to 46V' },
        ];

        return (
            <div className="min-h-screen flex flex-col" data-name="datasheets-app">
                <Navigation activePage="datasheets" />
                
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Component Datasheets</h1>
                            <p className="text-slate-400">Search technical specifications, pinouts, and application notes.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative mb-12">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div className="icon-search text-slate-500"></div>
                            </div>
                            <input 
                                type="text" 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
                                placeholder="Search by part number (e.g., NE555, LM358)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Results Table */}
                        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-4">Part Number</div>
                                <div className="col-span-3">Type</div>
                                <div className="col-span-2">Package</div>
                                <div className="col-span-2">Voltage</div>
                                <div className="col-span-1 text-right">Action</div>
                            </div>
                            
                            {results.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 hover:bg-slate-800/50 items-center transition-colors group">
                                    <div className="col-span-4 font-mono font-bold text-cyan-300">{item.name}</div>
                                    <div className="col-span-3 text-slate-300">{item.type}</div>
                                    <div className="col-span-2 text-slate-400 text-sm">{item.package}</div>
                                    <div className="col-span-2 text-slate-400 text-sm">{item.voltage}</div>
                                    <div className="col-span-1 text-right">
                                        <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                                            <div className="icon-download"></div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    } catch (error) {
        console.error("DatasheetsApp Error:", error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DatasheetsApp />);