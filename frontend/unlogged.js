function UnloggedApp() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="playground" />

      <div className="flex-grow flex h-[calc(100vh-64px)]">
        <p>Youre not logged in!</p>

        
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PlaygroundApp />);
