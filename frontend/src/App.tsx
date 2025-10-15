import { useEffect, useState } from "react";
import { healthCheck, getPublicKey } from "./services/api";

function App() {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [hasPublicKey, setHasPublicKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin Panel";

    const init = async () => {
      try {
        const health = await healthCheck();
        setIsBackendConnected(health);

        if (health) {
          const keyData = await getPublicKey();
          setHasPublicKey(!!keyData.publicKey);
        }
      } catch {
        setIsBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Connecting...</div>;

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
      <h1>Admin Panel</h1>

      <div style={{ margin: "20px 0" }}>
        <div style={{ fontSize: 50, color: isBackendConnected ? "green" : "red" }}>
          {isBackendConnected ? "✔" : "✖"}
        </div>
        <p>{isBackendConnected ? "API Connected" : "Backend Disconnected"}</p>
      </div>

      {isBackendConnected && (
        <div style={{ marginTop: 20 }}>
          <p>Health Check: OK</p>
          {hasPublicKey && <p>Public Key Loaded</p>}
        </div>
      )}


    </div>
  );
}

export default App;
