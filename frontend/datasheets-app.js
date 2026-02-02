function DatasheetsApp() {
    const [search, setSearch] = React.useState('');
    const [result, setResult] = React.useState('');
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

            const data = await response.json();
            setResult(data.result);

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
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Component Datasheets</h1>
                        <p className="text-slate-400">
                            Search technical specifications, pinouts, and application notes.
                        </p>
                    </div>

                    <div className="relative mb-12">
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-4 pr-4 text-lg"
                            placeholder="Search by part number (e.g., NE555, LM358)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            className="bg-sky-950 text-sky-400 border border-sky-400 px-4 py-2 rounded-md"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Submit"}
                        </button>
                    </div>

                    {result && (
                        <div className="mt-10 bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
                            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {result}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}