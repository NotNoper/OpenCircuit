import res from "express/lib/response";

let components = [];

async function FindPart(imgBase64) {
    try {
        const response = await fetch(
            "https://nikovision.onrender.com/upload-image",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64: imgBase64 }),
            }
        );

        const result = await response.json();
        console.log("Detected:", result);

        const video = document.getElementById("camera");
        const canvas = document.getElementById("canvas");

        video.style.display = "block";
        canvas.style.display = "none";

        document
            .querySelectorAll(".container")
            .forEach((e) => (e.style.display = "none"));

        AddComponent(result);
    } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image recognition failed.");
    }
}

async function FindPart(componentName) {
    try {
        const response = await fetch(
            "https://nikovision.onrender.com/seach-datasheet-information",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ componentName: componentName }),
            }
        );

        const result = await response.json();
        console.log(result.summary);
        console.log(result.absoluteMaximumRatings);
        console.log(result.sda);
        console.log(result.scl);
        console.log(result.i2c);
        console.log(result.currentConsumption);
        console.log(result.vcc);
        console.log(result.voltage);
        
    } catch (err) {
        console.error("Failed:", err);
        alert("Failed.");
    }
}

function Capture() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    video.style.display = "none";
    canvas.style.display = "block";

    const dataURL = canvas.toDataURL("image/png");
    const base64 = dataURL.split(",")[1];
    FindPart(base64);
}

function RevealCamera() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            const video = document.getElementById("camera");
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.error("Camera error:", err);
            alert("Camera access denied.");
        });
}

function AddComponent(knownComponent = null) {
    const formContainer = document.getElementById("componentListContainer");
    const container = document.createElement('div');
    container.className = 'componentList';

    const selectComponent = document.createElement('select');
    selectComponent.innerHTML = `
        <option value="">Select component</option>
        <option value="Microcontroller">Microcontroller</option>
        <option value="IC">IC</option>
        <option value="LED">LED</option>
        <option value="Resistor">Resistor</option>
        <option value="Diode">Diode</option>
        <option value="Transistor">Transistor</option>

        <option value="Battery">Battery</option>
        <option value="Relay">Relay</option>
        <option value="Capacitor">Capacitor</option>
        <option value="Potentiometer">Potentiometer</option>
        <option value="Buzzer">Buzzer</option>
        <option value="Accelerometer">Accelerometer</option>
        <option value="Gyroscope">Gyroscope</option>
    `;
    
    container.appendChild(selectComponent);

    const detailsDiv = document.createElement('div');
    container.appendChild(detailsDiv);

    selectComponent.addEventListener('change', () => {
        detailsDiv.innerHTML = '';
        const selected = selectComponent.value;
        if (selected === "Microcontroller" || selected === 'IC' || selected === 'Battery' || selected === 'Accelerometer' || selected === 'Gyroscope' || selected === 'Transistor' || selected === 'Diode' || selected === 'Relay' || selected === 'Capacitor') {
            const label = document.createElement('label');
            label.textContent = 'Model: ';
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Enter model';
            if(knownComponent)
            {
                input.value = knownComponent.model;
            }
            label.appendChild(input);
            detailsDiv.appendChild(label);
        } 
        else if (selected === 'Resistor' || selected === 'Potentiometer' || selected === 'LED') {
            const info = document.createElement('p');
            info.textContent = 'No additional input needed for this component.';
            detailsDiv.appendChild(info);
        } 
    });
    
    if(knownComponent)
    {
        selectComponent.value = knownComponent.component_name;
        selectComponent.dispatchEvent(new Event('change'));
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.marginTop = "10px";
    deleteButton.onclick = function () {
        formContainer.removeChild(container);
    };
    container.appendChild(deleteButton);

    formContainer.appendChild(container);
}


function GetListData() {
    const formContainer = document.getElementById("componentListContainer");
    const promptEl = document.getElementById("projectPrompt");
    if (!promptEl.value) {
        alert("Enter a project description.");
        return;
    }

    components.length = 0;

    for (const div of formContainer.children) {
        const select = div.querySelector("select");
        if (!select || !select.value) continue;

        const data = { type: select.value };

        const input = div.querySelector("input");
        if (input && !input.value) {
            alert("Missing model name.");
            return;
        }

        if (input) data.model = input.value;
        components.push(data);
    }

    CheckWithAI(
        `Project: ${promptEl.value}\nComponents:\n${JSON.stringify(
            components
        )}`
    );
}

async function CheckWithAI(prompt) {
    try {
        const res = await fetch(
            "https://nikovision.onrender.com/check-ai",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            }
        );

        const data = await res.json();

        const wiring = document.getElementById("componentWiringContainer");
        wiring.innerHTML = "";

        data.components.forEach((c) => {
            const table = document.createElement("table");
            table.className = "mt-4 border";

            Object.entries(c).forEach(([k, v]) => {
                if (k === "pins") {
                    Object.entries(v).forEach(([p, t]) => {
                        const r = table.insertRow();
                        r.insertCell().textContent = p;
                        r.insertCell().textContent = t;
                    });
                } else {
                    const r = table.insertRow();
                    r.insertCell().textContent = k;
                    r.insertCell().textContent = v;
                }
            });

            wiring.appendChild(table);
        });

        document.getElementById("code").innerHTML = data.code
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    } catch (err) {
        console.error(err);
    }
}

function AssemblyApp() {
    const [showCamera, setShowCamera] = React.useState(false);

    React.useEffect(() => {
        if (showCamera) RevealCamera();
    }, [showCamera]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation activePage="assembly" />

            <main className="flex-grow flex justify-center px-4 py-12">
                <div className="w-full max-w-2xl space-y-6">

                    <h1 className="text-4xl font-bold mb-4 text-center">
                        Assembly Assistant
                    </h1>
                    <p className="text-slate-400 text-center">Identify components and generate wiring guidance for your project.</p>

                    <input
                        id="projectPrompt"
                        className="input-field"
                        placeholder="What would you like to build?"
                    />

                    <div className="flex justify-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => AddComponent()}
                        >
                            Add Component
                        </button>
                    </div>

                    <ul
                        id="componentListContainer"
                        className="styled-list"
                    ></ul>

                    {!showCamera && (
                        <div className="flex justify-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCamera(true)}
                            >
                                Add by picture
                            </button>
                        </div>
                    )}

                    {showCamera && (
                        <div id="camContainer">
                            <video id="camera" autoPlay />
                            <canvas id="canvas" style={{ display: "none" }} />
                            <button
                                className="btn btn-primary mt-3 w-full"
                                onClick={Capture}
                            >
                                Capture
                            </button>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button 
                            class="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                            onClick={() => GetListData()}>
                        <span class="bg-sky-400 shadow-sky-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        Submit
                        </button>
                    </div>

                    <div id="componentWiringContainer" class="styled-table"/>
                    <pre id="code" class="styled-pre"/>
                </div>
            </main>

            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AssemblyApp />);
