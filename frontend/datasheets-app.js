function GetListData() {
    const promptEl = document.getElementById("projectPrompt");
    if (!promptEl.value) {
        alert("Enter a component.");
        return;
    }
    console.log(promptEl.value);
    SearchDatasheetInformation(promptEl.value);
}

async function SearchDatasheetInformation(componentName) {
    try {
        const response = await fetch(
            "https://nikovision.onrender.com/search-datasheet-information",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ componentName: componentName }),
            }
        );

        const result = await response.json();
        
        const textOutput = document.getElementById("textOutput");
        const text = document.createElement('p');
        text.innerHTML = result.result;
        textOutput.appendChild(text);
        
    } catch (err) {
        console.error("Failed:", err);
        alert("Failed.");
    }
}

function DatasheetsApp() {
    try {
        const [search, setSearch] = React.useState('');

        return (
            <div className="min-h-screen flex flex-col" data-name="datasheets-app">
                <Navigation activePage="datasheets" />
                
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Component Datasheets</h1>
                            <p className="text-slate-400">Search technical specifications, pinouts, and application notes.</p>
                        </div>

                        <div className="relative mb-12">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div className="icon-search text-slate-500"></div>
                            </div>
                            <input 
                                type="text" 
                                id="projectPrompt"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
                                placeholder="Search by part number (e.g., NE555, LM358)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-center">
                            <button 
                                class="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                onClick={() => GetListData()}>
                            <span class="bg-sky-400 shadow-sky-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                            Submit
                            </button>
                        </div>
                        <div className="mt-10 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 ring-1 ring-cyan-500/20">
                            <div id="outputText" className="max-h-[400px] overflow-y-auto pr-2 text-slate-300 whitespace-pre-wrap leading-relaxed">
                                
                            </div>
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