class Circuit {
  constructor() {
    this.nodes = new Set([0]);
    this.components = [];
  }

  addNode(node) {
    this.nodes.add(node);
  }

  addComp(component) {
    this.components.push(component);
    this.addNode(component.n1);
    this.addNode(component.n2);
  }

  solveLinearSystem(A, b) {
    const n = A.length;
    if (n === 0) return [];

    const M = A.map(row => [...row]);
    const B = [...b];

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(M[r][i]) > Math.abs(M[maxRow][i])) maxRow = r;
      }

      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      [B[i], B[maxRow]] = [B[maxRow], B[i]];

      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) continue;

      for (let r = i + 1; r < n; r++) {
        const factor = M[r][i] / pivot;
        for (let c = i; c < n; c++) M[r][c] -= factor * M[i][c];
        B[r] -= factor * B[i];
      }
    }

    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) sum += M[i][j] * x[j];
      x[i] = Math.abs(M[i][i]) < 1e-12 ? 0 : (B[i] - sum) / M[i][i];
    }

    return x;
  }

  solveDC() {
    const nodesArray = Array.from(this.nodes).sort((a, b) => a - b);
    const nodeCount = nodesArray.length;
    const nodeIndex = {};
    for (let i = 0; i < nodeCount; i++) nodeIndex[nodesArray[i]] = i;

    const voltageSources = this.components.filter(c => c.type === "V");
    const matrixSize = Math.max(0, nodeCount - 1 + voltageSources.length);

    if (matrixSize === 0) {
      return { voltages: { 0: 0 }, components: [] };
    }

    const G = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
    const I = Array(matrixSize).fill(0);

    this.components.forEach(c => {
      if (c.stamp) {
        c.stamp(G, I, nodeIndex);
        return;
      }

      if (c.type === "R") {
        const n1 = c.n1 === 0 ? -1 : nodeIndex[c.n1] - 1;
        const n2 = c.n2 === 0 ? -1 : nodeIndex[c.n2] - 1;
        const conductance = c.value > 0 ? 1 / c.value : 0;

        if (n1 >= 0) G[n1][n1] += conductance;
        if (n2 >= 0) G[n2][n2] += conductance;
        if (n1 >= 0 && n2 >= 0) {
          G[n1][n2] -= conductance;
          G[n2][n1] -= conductance;
        }
      }
    });

    voltageSources.forEach((source, k) => {
      const row = nodeCount - 1 + k;
      const n1 = source.n1 === 0 ? -1 : nodeIndex[source.n1] - 1;
      const n2 = source.n2 === 0 ? -1 : nodeIndex[source.n2] - 1;

      if (n1 >= 0) {
        G[row][n1] = 1;
        G[n1][row] = 1;
      }
      if (n2 >= 0) {
        G[row][n2] = -1;
        G[n2][row] = -1;
      }
      I[row] = source.value;
    });

    const x = this.solveLinearSystem(G, I);

    const voltages = {};
    nodesArray.forEach((node, idx) => {
      voltages[node] = node === 0 ? 0 : x[idx - 1] ?? 0;
    });

    this.components.forEach(c => {
      if (c.computeCurrent) c.computeCurrent(voltages);
    });

    return {
      voltages,
      components: this.components.map(c => ({
        id: c.id,
        type: c.type,
        n1: c.n1,
        n2: c.n2,
        current: c.current ?? null,
        value: c.value ?? null
      }))
    };
  }
}

class Resistor {
  constructor(id, n1, n2, value) {
    this.id = id;
    this.type = "R";
    this.n1 = n1;
    this.n2 = n2;
    this.value = value;
    this.current = 0;
  }

  computeCurrent(v) {
    const v1 = v[this.n1] ?? 0;
    const v2 = v[this.n2] ?? 0;
    this.current = this.value > 0 ? (v1 - v2) / this.value : 0;
  }
}

class VoltageSource {
  constructor(id, n1, n2, value) {
    this.id = id;
    this.type = "V";
    this.n1 = n1;
    this.n2 = n2;
    this.value = value;
  }
}

class LED {
  constructor(id, n1, n2, Vf = 2, Rseries = 100) {
    this.id = id;
    this.type = "LED";
    this.n1 = n1;
    this.n2 = n2;
    this.Vf = Vf;
    this.Rseries = Rseries;
    this.current = 0;
  }

  stamp(G, I, nodeIndex) {
    const n1 = this.n1 === 0 ? -1 : nodeIndex[this.n1] - 1;
    const n2 = this.n2 === 0 ? -1 : nodeIndex[this.n2] - 1;
    const g = this.Rseries > 0 ? 1 / this.Rseries : 0;

    if (n1 >= 0) G[n1][n1] += g;
    if (n2 >= 0) G[n2][n2] += g;
    if (n1 >= 0 && n2 >= 0) {
      G[n1][n2] -= g;
      G[n2][n1] -= g;
    }

    if (n1 >= 0) I[n1] += this.Vf * g;
    if (n2 >= 0) I[n2] -= this.Vf * g;
  }

  computeCurrent(v) {
    const v1 = v[this.n1] ?? 0;
    const v2 = v[this.n2] ?? 0;
    this.current = this.Rseries > 0 ? (v1 - v2 - this.Vf) / this.Rseries : 0;
  }

  isOn() {
    return this.current > 0.001;
  }
}

class UnionFind {
  constructor() {
    this.parent = new Map();
  }

  ensure(x) {
    if (!this.parent.has(x)) this.parent.set(x, x);
  }

  find(x) {
    this.ensure(x);
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root);

    let cur = x;
    while (this.parent.get(cur) !== cur) {
      const next = this.parent.get(cur);
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }

  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

function makeId() {
  return Date.now() + Math.floor(Math.random() * 1000000);
}

function pinKey(componentId, side) {
  return `${componentId}:${side}`;
}

function defaultComponent(type, index) {
  return {
    id: makeId(),
    type,
    icon: type === "Battery" ? "battery-charging" : type === "LED" ? "lightbulb" : "cpu",
    x: 150 + index * 40,
    y: 150 + index * 40,
    props: {
      resistance: type === "Resistor" ? 1000 : undefined,
      voltage: type === "Battery" ? 9 : undefined,
      vf: type === "LED" ? 2 : undefined,
      seriesR: type === "LED" ? 100 : undefined
    }
  };
}

function buildPinNodeMap(components, wires) {
  const uf = new UnionFind();

  components.forEach(c => {
    uf.ensure(pinKey(c.id, "left"));
    uf.ensure(pinKey(c.id, "right"));
  });

  wires.forEach(w => {
    uf.union(pinKey(w.a.id, w.a.side), pinKey(w.b.id, w.b.side));
  });

  const batteryGroundRoots = new Set();
  components
    .filter(c => c.type === "Battery")
    .forEach(c => {
      batteryGroundRoots.add(uf.find(pinKey(c.id, "right")));
    });

  const rootToNode = new Map();
  let nextNode = 1;

  function nodeForRoot(root) {
    if (batteryGroundRoots.has(root)) return 0;
    if (!rootToNode.has(root)) {
      rootToNode.set(root, nextNode);
      nextNode += 1;
    }
    return rootToNode.get(root);
  }

  const pinNodeMap = {};
  components.forEach(c => {
    ["left", "right"].forEach(side => {
      const key = pinKey(c.id, side);
      const root = uf.find(key);
      pinNodeMap[key] = nodeForRoot(root);
    });
  });

  return pinNodeMap;
}

function componentFromUI(c, pinNodeMap) {
  const n1 = pinNodeMap[pinKey(c.id, "left")] ?? 0;
  const n2 = pinNodeMap[pinKey(c.id, "right")] ?? 0;

  if (c.type === "Battery") return new VoltageSource(c.id, n1, n2, Number(c.props.voltage ?? 9));
  if (c.type === "Resistor") return new Resistor(c.id, n1, n2, Math.max(1e-9, Number(c.props.resistance ?? 1000)));
  if (c.type === "LED") {
    return new LED(
      c.id,
      n1,
      n2,
      Number(c.props.vf ?? 2),
      Math.max(1e-9, Number(c.props.seriesR ?? 100))
    );
  }

  return null;
}

function simulateCircuit(components, wires) {
  const pinNodeMap = buildPinNodeMap(components, wires);
  const circuit = new Circuit();

  components.forEach(c => {
    const comp = componentFromUI(c, pinNodeMap);
    if (comp) circuit.addComp(comp);
  });

  const result = circuit.solveDC();
  return { ...result, pinNodeMap, circuit };
}

function wirePointFor(comp, side) {
  return {
    x: comp.x + (side === "left" ? 0 : 128),
    y: comp.y + 64
  };
}

function sameWire(a, b) {
  const direct = a.a.id === b.a.id && a.a.side === b.a.side && a.b.id === b.b.id && a.b.side === b.b.side;
  const reverse = a.a.id === b.b.id && a.a.side === b.b.side && a.b.id === b.a.id && a.b.side === b.a.side;
  return direct || reverse;
}

function PlaygroundApp() {
  const [components, setComponents] = React.useState([]);
  const [wires, setWires] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [pendingPin, setPendingPin] = React.useState(null);
  const [draggingId, setDraggingId] = React.useState(null);
  const [simResult, setSimResult] = React.useState({ voltages: { 0: 0 }, components: [] });

  const circuitRef = React.useRef(new Circuit());

  const selectedComponent = components.find(c => c.id === selectedId) || null;

  function addComponent(type) {
    setComponents(prev => [...prev, defaultComponent(type, prev.length)]);
  }

  function removeComponent(componentId) {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setWires(prev => prev.filter(w => w.a.id !== componentId && w.b.id !== componentId));
    if (selectedId === componentId) setSelectedId(null);
    if (pendingPin && pendingPin.id === componentId) setPendingPin(null);
  }

  function updateComponentProps(componentId, patch) {
    setComponents(prev =>
      prev.map(c =>
        c.id === componentId
          ? {
              ...c,
              props: { ...c.props, ...patch }
            }
          : c
      )
    );
  }

  function runSimulation() {
    const result = simulateCircuit(components, wires);
    circuitRef.current = result.circuit;
    setSimResult({ voltages: result.voltages, components: result.components });

    console.log("=== Circuit Simulation ===");
    console.log("Voltages:", result.voltages);
    result.components.forEach(c => {
      if (c.type === "LED") {
        const led = result.circuit.components.find(x => x.id === c.id);
        const state = led && led.isOn ? (led.isOn() ? "ON" : "OFF") : "OFF";
        console.log(`LED ${c.id}: ${state}, Current: ${(c.current ?? 0).toFixed(4)} A`);
      }
      if (c.type === "R") console.log(`Resistor ${c.id}: ${(c.current ?? 0).toFixed(4)} A`);
      if (c.type === "V") console.log(`Voltage Source ${c.id}: ${c.value} V`);
    });
  }

  function pinClick(id, side) {
    const point = { id, side };
    if (!pendingPin) {
      setPendingPin(point);
      return;
    }

    if (pendingPin.id === id && pendingPin.side === side) {
      setPendingPin(null);
      return;
    }

    const newWire = { a: pendingPin, b: point };
    setWires(prev => {
      if (prev.some(w => sameWire(w, newWire))) return prev;
      return [...prev, newWire];
    });
    setPendingPin(null);
  }

  React.useEffect(() => {
    function onMove(e) {
      if (!draggingId) return;
      setComponents(prev =>
        prev.map(c =>
          c.id === draggingId ? { ...c, x: c.x + e.movementX, y: c.y + e.movementY } : c
        )
      );
    }

    function onUp() {
      setDraggingId(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [draggingId]);

  const selectedSolvedComponent = selectedComponent
    ? simResult.components.find(c => c.id === selectedComponent.id)
    : null;
  const leftNodeVoltage = selectedSolvedComponent ? Number(simResult.voltages[selectedSolvedComponent.n1] ?? 0) : null;
  const rightNodeVoltage = selectedSolvedComponent ? Number(simResult.voltages[selectedSolvedComponent.n2] ?? 0) : null;
  const leftTerminalLabel =
    selectedComponent?.type === "Battery" || selectedComponent?.type === "LED" ? "Positive Terminal" : "Left Terminal";
  const rightTerminalLabel =
    selectedComponent?.type === "Battery" || selectedComponent?.type === "LED" ? "Negative Terminal" : "Right Terminal";
  const voltageDrop =
    leftNodeVoltage == null || rightNodeVoltage == null ? null : leftNodeVoltage - rightNodeVoltage;

  const relatedComponents = selectedSolvedComponent
    ? simResult.components.filter(c =>
        c.id !== selectedSolvedComponent.id &&
        (c.n1 === selectedSolvedComponent.n1 ||
          c.n2 === selectedSolvedComponent.n1 ||
          c.n1 === selectedSolvedComponent.n2 ||
          c.n2 === selectedSolvedComponent.n2)
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="playground" />

      <div className="flex-grow flex h-[calc(100vh-64px)]">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 noselect">
          {["Battery", "Resistor", "LED"].map(type => (
            <div key={type} className="sidebar-item" onClick={() => addComponent(type)}>
              {type}
            </div>
          ))}

          <button className="mt-6 w-full bg-cyan-500 px-4 py-2 rounded-lg font-semibold" onClick={runSimulation}>
            ▶ Start Simulation
          </button>
        </aside>

        <main
          className="flex-grow relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] noselect"
          onClick={() => {
            setSelectedId(null);
            setPendingPin(null);
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {wires.map((wire, i) => {
              const aComp = components.find(c => c.id === wire.a.id);
              const bComp = components.find(c => c.id === wire.b.id);
              if (!aComp || !bComp) return null;

              const p1 = wirePointFor(aComp, wire.a.side);
              const p2 = wirePointFor(bComp, wire.b.side);

              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#22d3ee"
                  strokeWidth="3"
                  style={{ pointerEvents: "auto", cursor: "pointer" }}
                  onClick={e => {
                    e.stopPropagation();
                    setWires(prev => prev.filter((_, idx) => idx !== i));
                  }}
                />
              );
            })}
          </svg>

          {components.map(comp => {
            const solved = circuitRef.current.components.find(x => x.id === comp.id);
            const ledOn = solved?.type === "LED" && solved.isOn && solved.isOn();

            return (
              <div
                key={comp.id}
                className={`absolute component-node ${selectedId === comp.id ? "ring-2 ring-cyan-400" : ""}`}
                style={{ left: comp.x, top: comp.y }}
                onMouseDown={e => {
                  if (e.target.closest(".pin")) return;
                  e.stopPropagation();
                  setDraggingId(comp.id);
                  setSelectedId(comp.id);
                }}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedId(comp.id);
                }}
              >
                <div className={`icon-${comp.icon} text-3xl ${ledOn ? "text-yellow-300" : "text-slate-300"}`} />

                <div
                  className={`pin absolute -left-1 top-1/2 w-3 h-3 rounded-full flex items-center justify-center text-xs text-white ${
                    pendingPin && pendingPin.id === comp.id && pendingPin.side === "left" ? "bg-cyan-400" : "bg-slate-400"
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    pinClick(comp.id, "left");
                  }}
                >
                  <span className="text-[10px] font-bold">
                    {comp.type === "Battery" || comp.type === "LED" ? "+" : ""}
                  </span>
                </div>

                <div
                  className={`pin absolute -right-1 top-1/2 w-3 h-3 rounded-full flex items-center justify-center text-xs text-white ${
                    pendingPin && pendingPin.id === comp.id && pendingPin.side === "right" ? "bg-cyan-400" : "bg-slate-400"
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    pinClick(comp.id, "right");
                  }}
                >
                  <span className="text-[10px] font-bold">
                    {comp.type === "Battery" || comp.type === "LED" ? "−" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </main>

        <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 noselect">
          <h3 className="font-bold mb-4">Properties</h3>

          {!selectedComponent && <div className="text-slate-400">Select a component to edit or delete it.</div>}

          {selectedComponent && (
            <div>
              <div className="mb-2">
                Type: <strong>{selectedComponent.type}</strong>
              </div>

              {selectedComponent.type === "Resistor" && (
                <div className="mb-2">
                  <label className="block text-sm">Resistance (ohms)</label>
                  <input
                    type="number"
                    value={selectedComponent.props.resistance}
                    className="input-field w-full bg-slate-800 text-white border border-slate-700"
                    onChange={e => updateComponentProps(selectedComponent.id, { resistance: Number(e.target.value) || 0 })}
                  />
                </div>
              )}

              {selectedComponent.type === "Battery" && (
                <div className="mb-2">
                  <label className="block text-sm">Voltage (V)</label>
                  <input
                    type="number"
                    value={selectedComponent.props.voltage}
                    className="input-field w-full bg-slate-800 text-white border border-slate-700"
                    onChange={e => updateComponentProps(selectedComponent.id, { voltage: Number(e.target.value) || 0 })}
                  />
                </div>
              )}

              {selectedComponent.type === "LED" && (
                <div className="mb-2">
                  <label className="block text-sm">Forward Voltage (Vf)</label>
                  <input
                    type="number"
                    value={selectedComponent.props.vf}
                    className="input-field w-full bg-slate-800 text-white border border-slate-700"
                    onChange={e => updateComponentProps(selectedComponent.id, { vf: Number(e.target.value) || 0 })}
                  />

                  <label className="block text-sm mt-2">Series Resistance (ohms)</label>
                  <input
                    type="number"
                    value={selectedComponent.props.seriesR}
                    className="input-field w-full bg-slate-800 text-white border border-slate-700"
                    onChange={e => updateComponentProps(selectedComponent.id, { seriesR: Number(e.target.value) || 0 })}
                  />
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary" onClick={runSimulation}>
                  Simulate
                </button>
                <button className="btn btn-outline" onClick={() => removeComponent(selectedComponent.id)}>
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-slate-800 pt-4">
            <h4 className="font-semibold mb-2">Simulation Output</h4>
            <div className="text-xs text-slate-300 max-h-64 overflow-auto space-y-2">
              {!selectedComponent && (
                <div className="text-slate-400">Select a component in the build area to view its electrical output.</div>
              )}

              {selectedComponent && !selectedSolvedComponent && (
                <div className="text-slate-400">Run simulation to view output for the selected component.</div>
              )}

              {selectedComponent && selectedSolvedComponent && (
                <>
                  <div>
                    <div className="font-semibold text-slate-100">Selected Component</div>
                    <div>
                      {selectedComponent.type} #{selectedComponent.id}
                    </div>
                    <div className="mt-1">
                      Current: {selectedSolvedComponent.current == null ? "-" : `${Number(selectedSolvedComponent.current).toFixed(4)} A`}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100">Terminal Voltages</div>
                    <div>{leftTerminalLabel}: {leftNodeVoltage?.toFixed(4)} V</div>
                    <div>{rightTerminalLabel}: {rightNodeVoltage?.toFixed(4)} V</div>
                    <div className="mt-1">Voltage Across Component: {voltageDrop?.toFixed(4)} V</div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100">Connected Nearby Components</div>
                    {relatedComponents.length === 0 && (
                      <div className="text-slate-400">No directly connected components.</div>
                    )}
                    {relatedComponents.map(c => (
                      <div key={c.id}>
                        {c.type} #{c.id}: {c.current == null ? "-" : `${Number(c.current).toFixed(4)} A`}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PlaygroundApp />);
