function solveLinear(A, b) {
  const n = b.length;

  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    // Eliminate
    for (let k = i + 1; k < n; k++) {
      let c = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= c * A[i][j];
      }
      b[k] -= c * b[i];
    }
  }

  // Back substitution
  let x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i + 1; j < n; j++) {
      sum -= A[i][j] * x[j];
    }
    x[i] = sum / A[i][i];
  }

  return x;
}


class Circuit {
  constructor() {
    this.nodes = new Set([0]);
    this.components = [];
  }

  addNode(node) {
    this.nodes.add(node);
  }

  addComp(c) {
    this.components.push(c);
    this.addNode(c.n1);
    this.addNode(c.n2);
  }

  solveDC() {
    const nodesArray = Array.from(this.nodes).sort((a, b) => a - b);
    const N = nodesArray.length;
    const idx = {};
    for (let i = 0; i < N; i++) idx[nodesArray[i]] = i;

    let voltageSources = this.components.filter(c => c.type === "V");
    let M = N - 1 + voltageSources.length;

    let G = Array.from({ length: M }, () => Array(M).fill(0));
    let I = Array(M).fill(0);

    this.components.forEach(c => {
      if (c.stamp) {
        c.stamp(G, I, idx);
      } else if (c.type === "R") {
        let n1 = c.n1 === 0 ? -1 : idx[c.n1] - 1;
        let n2 = c.n2 === 0 ? -1 : idx[c.n2] - 1;
        let g = 1 / c.value;

        if (n1 >= 0) G[n1][n1] += g;
        if (n2 >= 0) G[n2][n2] += g;
        if (n1 >= 0 && n2 >= 0) {
          G[n1][n2] -= g;
          G[n2][n1] -= g;
        }
      }
    });

    voltageSources.forEach((vs, k) => {
      let row = N - 1 + k;
      let n1 = vs.n1 === 0 ? -1 : idx[vs.n1] - 1;
      let n2 = vs.n2 === 0 ? -1 : idx[vs.n2] - 1;

      if (n1 >= 0) {
        G[row][n1] = 1;
        G[n1][row] = 1;
      }
      if (n2 >= 0) {
        G[row][n2] = -1;
        G[n2][row] = -1;
      }
      I[row] = vs.value;
    });

    let x = solveLinear(G, I);

    let voltages = {};
    nodesArray.forEach((node, i) => {
      voltages[node] = node === 0 ? 0 : x[i - 1];
    });

    this.components.forEach(c => {
      if (c.computeCurrent) c.computeCurrent(voltages);
    });

    return voltages;
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
    this.current = (v[this.n1] - v[this.n2]) / this.value;
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

  stamp(G, I, idx) {
    let n1 = this.n1 === 0 ? -1 : idx[this.n1] - 1;
    let n2 = this.n2 === 0 ? -1 : idx[this.n2] - 1;
    let g = 1 / this.Rseries;

    if (n1 >= 0) G[n1][n1] += g;
    if (n2 >= 0) G[n2][n2] += g;
    if (n1 >= 0 && n2 >= 0) {
      G[n1][n2] -= g;
      G[n2][n1] -= g;
    }

    if (n1 >= 0) I[n1] += this.Vf / this.Rseries;
    if (n2 >= 0) I[n2] -= this.Vf / this.Rseries;
  }

  computeCurrent(v) {
    this.current = (v[this.n1] - v[this.n2] - this.Vf) / this.Rseries;
  }

  isOn() {
    return this.current > 0.001;
  }
}

// ====== APP ======
function PlaygroundApp() {
  const circuitRef = React.useRef(new Circuit());
  const c = circuitRef.current;

  const [components, setComponents] = React.useState([]);
  const [draggingId, setDraggingId] = React.useState(null);
  const [wires, setWires] = React.useState([]);
  const [dragWire, setDragWire] = React.useState(null);
  const nodeCounter = React.useRef(1);
  const pinNodes = React.useRef({});
  // Dragging
  React.useEffect(() => {
    function move(e) {
      if (!draggingId) return;
      setComponents(prev =>
        prev.map(x =>
          x.id === draggingId
            ? { ...x, x: x.x + e.movementX, y: x.y + e.movementY }
            : x
        )
      );
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", () => setDraggingId(null));
    return () => window.removeEventListener("mousemove", move);
  }, [draggingId]);

  React.useEffect(() => {
  function move(e) {
    if (!dragWire) return;
    setDragWire(w => ({ ...w, x: e.clientX, y: e.clientY }));
  }

  function up(e) {
    if (!dragWire) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const pin = target?.closest("[data-pin]");

    if (pin) {
      const id = Number(pin.dataset.id);
      const side = pin.dataset.side;
      connectPins(dragWire.from, { id, side });
    }

    setDragWire(null);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragWire]);

  function addComponent(type) {
    const id = Date.now();
    setComponents(p => [
      ...p,
      {
        id,
        type,
        icon: type === "Battery" ? "battery-charging" : type === "LED" ? "lightbulb" : "cpu",
        x: 150 + p.length * 40,
        y: 150 + p.length * 40,
        selected: false
      }
    ]);
  }

  function assignNode(id, side, node) {
    let comp = c.components.find(x => x.id === id);
    const ui = components.find(x => x.id === id);

    if (!comp) {
      if (ui.type === "Battery") comp = new VoltageSource(id, 0, 0, 9);
      if (ui.type === "Resistor") comp = new Resistor(id, 0, 0, 1000);
      if (ui.type === "LED") comp = new LED(id, 0, 0, 2);
      c.addComp(comp);
    }

    if (side === "left") comp.n1 = node;
    else comp.n2 = node;

    c.addNode(node);
  }

  function connectPins(a, b) {
    const keyA = `${a.id}-${a.side}`;
    const keyB = `${b.id}-${b.side}`;

    let nodeA = pinNodes.current[keyA];
    let nodeB = pinNodes.current[keyB];

    let node;

    if (nodeA) node = nodeA;
    else if (nodeB) node = nodeB;
    else node = nodeCounter.current++;

    pinNodes.current[keyA] = node;
    pinNodes.current[keyB] = node;

    assignNode(a.id, a.side, node);
    assignNode(b.id, b.side, node);

    setWires(w => [...w, { a, b }]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="playground" />

      <div className="flex-grow flex h-[calc(100vh-64px)]">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 noselect">
          {["Battery", "Resistor", "LED"].map(t => (
            <div key={t} className="sidebar-item" onClick={() => addComponent(t)}>
              {t}
            </div>
          ))}
        </aside>

        <main className="flex-grow relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] noselect">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {wires.map((w, i) => {
              const a = components.find(c => c.id === w.a.id);
              const b = components.find(c => c.id === w.b.id);
              if (!a || !b) return null;

              return (
                <line
                  key={i}
                  x1={a.x + (w.a.side === "left" ? 0 : 128)}
                  y1={a.y + 64}
                  x2={b.x + (w.b.side === "left" ? 0 : 128)}
                  y2={b.y + 64}
                  stroke="#22d3ee"
                  strokeWidth="3"
                />
              );
            })}
            {dragWire && (() => {
              const a = components.find(c => c.id === dragWire.from.id);
              if (!a) return null;

              const x1 = a.x + (dragWire.from.side === "left" ? 0 : 128);
              const y1 = a.y + 64;

              return (
                <line
                  x1={x1}
                  y1={y1}
                  x2={dragWire.x}
                  y2={dragWire.y}
                  stroke="#22d3ee"
                  strokeWidth="3"
                />
              );
            })()}

          </svg>

          {components.map(comp => {
            const ccomp = c.components.find(x => x.id === comp.id);
            const on = ccomp?.type === "LED" && ccomp.isOn();

            return (
              <div
                key={comp.id}
                className="absolute component-node"
                style={{ left: comp.x, top: comp.y }}
                onMouseDown={() => setDraggingId(comp.id)}
              >
                <div className={`icon-${comp.icon} text-3xl ${on ? "text-yellow-300" : "text-slate-300"}`} />
                <div
                  data-pin
                  data-id={comp.id}
                  data-side="left"
                  onMouseDown={e => {
                    e.stopPropagation();
                    setDragWire({
                      from: { id: comp.id, side: "left" },
                      x: e.clientX,
                      y: e.clientY
                    });
                  }}
                  className="absolute -left-1 top-1/2 w-3 h-3 bg-slate-400 rounded-full"
                />

                <div
                  data-pin
                  data-id={comp.id}
                  data-side="right"
                  onMouseDown={e => {
                    e.stopPropagation();
                    setDragWire({
                      from: { id: comp.id, side: "right" },
                      x: e.clientX,
                      y: e.clientY
                    });
                  }}
                  className="absolute -right-1 top-1/2 w-3 h-3 bg-slate-400 rounded-full"
                />
              </div>
            );
          })}

          <button
            className="absolute bottom-6 right-6 bg-cyan-500 px-6 py-3 rounded-xl"
            onClick={() => {
              c.solveDC();
              setComponents([...components]);
            }}
          >
            ▶ Start Simulation
          </button>
        </main>

        <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 noselect">
          Properties
        </aside>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PlaygroundApp />);
