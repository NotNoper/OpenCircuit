function LearningApp() {
    try {

        const [selectedModule, setSelectedModule] = React.useState(null);

        const modules = [
            {
                id: "breadboard",
                title: "Using a Breadboard",
                description: "Breadboards allow you to prototype circuits without soldering.",
                content: [
                    {
                        type: "text",
                        value: "A breadboard has rows of connected holes that allow components to share electrical connections."
                    },
                    {
                        type: "image",
                        value: "/images/breadboard.png"
                    },
                    {
                        type: "list",
                        value: [
                            "Power rails run vertically",
                            "Terminal strips run horizontally",
                            "ICs usually sit across the center gap"
                        ]
                    }
                ]
            },

            {
                id: "component-pins",
                title: "Component Pin Names",
                description: "Common pin names used in electronics.",
                content: [
                    {
                        type: "list",
                        value: [
                            "VCC / VDD – Power input",
                            "GND – Ground",
                            "IN – Input",
                            "OUT – Output",
                            "EN – Enable pin",
                            "RST – Reset pin"
                        ]
                    }
                ]
            },

            {
                id: "site-parts",
                title: "Parts of This Site",
                description: "Overview of the tools available on this platform.",
                content: [
                    {
                        type: "list",
                        value: [
                            "Datasheets – Lookup technical specifications",
                            "Learning – Robotics and electronics basics",
                            "Projects – Example circuits and builds"
                        ]
                    }
                ]
            }
        ];

        const current = modules.find(m => m.id === selectedModule);

        return (
            <div className="min-h-screen flex flex-col">
                <Navigation activePage="learning" />

                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">

                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">
                                Robotics Learning Center
                            </h1>
                            <p className="text-slate-400">
                                Learn the fundamentals of electronics and robotics.
                            </p>
                        </div>


                        {!selectedModule && (

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {modules.map(module => (
                                    <div
                                        key={module.id}
                                        onClick={() => setSelectedModule(module.id)}
                                        className="cursor-pointer bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-400 hover:shadow-lg transition"
                                    >
                                        <h2 className="text-xl font-semibold text-cyan-400 mb-2">
                                            {module.title}
                                        </h2>

                                        <p className="text-slate-400 text-sm">
                                            {module.description}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        )}


                        {selectedModule && current && (

                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">

                                <button
                                    className="mb-6 text-cyan-400 hover:underline"
                                    onClick={() => setSelectedModule(null)}
                                >
                                    ← Back
                                </button>

                                <h2 className="text-3xl font-bold mb-4">
                                    {current.title}
                                </h2>

                                <p className="text-slate-400 mb-8">
                                    {current.description}
                                </p>


                                <div className="space-y-6">

                                    {current.content.map((block, index) => {

                                        if (block.type === "text") {
                                            return (
                                                <p key={index} className="text-slate-300">
                                                    {block.value}
                                                </p>
                                            );
                                        }

                                        if (block.type === "image") {
                                            return (
                                                <img
                                                    key={index}
                                                    src={block.value}
                                                    className="rounded-xl border border-slate-700"
                                                />
                                            );
                                        }

                                        if (block.type === "list") {
                                            return (
                                                <ul
                                                    key={index}
                                                    className="list-disc list-inside text-slate-300 space-y-1"
                                                >
                                                    {block.value.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            );
                                        }

                                        return null;
                                    })}

                                </div>

                            </div>

                        )}

                    </div>
                </main>

                <Footer />
            </div>
        );

    } catch (error) {
        console.error("LearningApp Error:", error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LearningApp />);