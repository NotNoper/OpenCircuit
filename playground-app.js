function PlaygroundApp() {
  const [components, setComponents] = React.useState([
    { id: 1, type: "Battery", icon: "battery-charging", x: 120, y: 120, selected: false },
    { id: 2, type: "LED", icon: "lightbulb", x: 300, y: 180, selected: false },
    { id: 3, type: "Resistor", icon: "server", x: 200, y: 320, selected: false }
  ]);

  const [draggingId, setDraggingId] = React.useState(null);

  // DRAGGING
  React.useEffect(() => {
    function onMove(e) {
      if (!draggingId) return;

      setComponents(prev =>
        prev.map(c =>
          c.id === draggingId
            ? { ...c, x: c.x + e.movementX, y: c.y + e.movementY }
            : c
        )
      );
    }

    function stopDrag() {
      setDraggingId(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [draggingId]);

  function selectComponent(id) {
    setComponents(prev =>
      prev.map(c => ({ ...c, selected: c.id === id }))
    );
  }

  function addComponent(type) {
    setComponents(prev => [
      ...prev,
      {
        id: Date.now(),
        type,
        icon:
          type === "Battery"
            ? "battery-charging"
            : type === "LED"
            ? "lightbulb"
            : "cpu",
        x: 200,
        y: 200,
        selected: false
      }
    ]);
  }

  const selected = components.find(c => c.selected);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="playground" />

      <div className="flex-grow flex h-[calc(100vh-64px)]">
        {/* TOOLBOX */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col noselect">
          <div className="p-4 border-b border-slate-800 font-bold text-lg">
            Toolbox
          </div>
          <div className="p-4 space-y-2 overflow-y-auto flex-grow">
            {["Battery", "Resistor", "LED", "Capacitor", "Motor", "Switch"].map(
              item => (
                <div
                  key={item}
                  className="sidebar-item"
                  onClick={() => addComponent(item)}
                >
                  <div className="icon-cpu mr-3"></div>
                  {item}
                </div>
              )
            )}
          </div>
        </aside>

        {/* CANVAS */}
        <main className="flex-grow relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] noselect">
          {components.map(comp => (
            <div
              key={comp.id}
              className={`absolute component-node ${
                comp.selected ? "border-cyan-500" : ""
              }`}
              style={{ left: comp.x, top: comp.y }}
              onMouseDown={e => {
                e.stopPropagation();
                setDraggingId(comp.id);
              }}
              onClick={() => selectComponent(comp.id)}
            >
              <div
                className={`icon-${comp.icon} text-3xl ${
                  comp.selected ? "text-cyan-400" : "text-slate-300"
                }`}
              />
              <span className="text-xs font-mono">{comp.type}</span>

              <div className="absolute -left-1 top-1/2 w-2 h-2 bg-slate-400 rounded-full" />
              <div className="absolute -right-1 top-1/2 w-2 h-2 bg-slate-400 rounded-full" />
            </div>
          ))}
        </main>

        {/* PROPERTIES */}
        <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 noselect">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Properties
          </h3>

          {selected ? (
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="text-xs text-cyan-400 mb-2">SELECTED</div>
              <div className="font-bold text-lg mb-4">
                {selected.type}
              </div>

              <div className="text-sm text-slate-400">
                Position: ({Math.round(selected.x)}, {Math.round(selected.y)})
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm">
              Click a component to edit it
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PlaygroundApp />);
