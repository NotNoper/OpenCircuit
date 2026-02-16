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
        const textOutput = document.getElementById("outputText");
        textOutput.innerHTML = "";

        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(result, null, 2);
        textOutput.appendChild(pre);

        
    } catch (err) {
        console.error("Failed:", err);
        alert("Failed.");
    }
}

function DatasheetsApp() {
    try {
        const [search, setSearch] = React.useState('');
        const [results, setResults] = React.useState([]);
        const [loading, setLoading] = React.useState(false);

        async function handleSearch() {
            if (!search.trim()) {
                alert("Enter a component.");
                return;
            }

            try {
                setLoading(true);

                const response = await fetch(
                    "https://nikovision.onrender.com/search-datasheet-information",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ componentName: search }),
                    }
                );

                const result = await response.json();

                if (Array.isArray(result)) {
                    setResults(result);
                } else {
                    setResults([result]);
                }

            } catch (err) {
                console.error("Failed:", err);
                alert("Failed.");
            } finally {
                setLoading(false);
            }
        }

        return (
            <div className="min-h-screen flex flex-col">
                <Navigation activePage="datasheets" />

                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-5xl mx-auto">

                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Component Datasheets</h1>
                            <p className="text-slate-400">
                                Search technical specifications, pinouts, and application notes.
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-8">
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 text-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
                                placeholder="Search by part number (e.g., NE555, LM358)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-center mb-10">
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary rounded-xl px-6 py-3"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>

                        {/* Results Table */}
                        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-md ring-1 ring-cyan-500/20 overflow-x-auto">

                            {results.length === 0 && !loading && (
                                <div className="text-center text-slate-500 py-8">
                                    No results yet.
                                </div>
                            )}

                            {results.length > 0 && (
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs tracking-wider">
                                            <th className="text-left py-3 px-4">Field</th>
                                            <th className="text-left py-3 px-4">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(results[0]).map(([key, value]) => (
                                            <tr
                                                key={key}
                                                className="border-b border-slate-700 hover:bg-slate-800 transition-colors"
                                            >
                                                <td className="py-3 px-4 text-cyan-400 font-medium">
                                                    {key}
                                                </td>
                                                <td className="py-3 px-4 text-slate-300">
                                                    {typeof value === "object"
                                                        ? JSON.stringify(value)
                                                        : value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

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