import { useCallback, useMemo, useState } from "react";
import { clientUserTableAPI } from "../../services/clientUser";
import "./Authtable.css";

function toRows(data) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function Authtable() {
  const [apiKey, setApiKey] = useState("");
  const [authData, setAuthData] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const rows = useMemo(() => toRows(authData), [authData]);

  const columns = useMemo(() => {
    const keys = new Set();

    rows.forEach((row) => {
      if (row && typeof row === "object") {
        Object.keys(row).forEach((key) => keys.add(key));
      }
    });

    return Array.from(keys);
  }, [rows]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setStatus("error");
      console.log("trimed Error");
      setMessage("API Key is required");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");
      console.log(apiKey);
      const response = await clientUserTableAPI.getTable(apiKey);
      console.log("res : ",response);

      const data = response.data.result;

      const nextRows = toRows(data);

      setAuthData(nextRows);

      setStatus(nextRows.length ? "success" : "empty");

      setMessage(
        nextRows.length ? "" : "No data found for this API key"
      );
    } catch (error) {
      setAuthData([]);
      setStatus("error");

      setMessage(
        error?.response?.data?.message || error.message
      );
    }
  }, [apiKey]);

  return (
    <main className="auth-page">
      <section className="auth-toolbar">
        <h1>Auth Table Lookup</h1>

        <form onSubmit={handleSubmit} className="auth-search">
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
          />

          <button disabled={status === "loading"}>
            {status === "loading" ? "Loading..." : "Search"}
          </button>
        </form>
      </section>

      {message && (
        <p className={`auth-message auth-message-${status}`}>
          {message}
        </p>
      )}

      <section className="auth-results">
        {status === "idle" && <p>Enter API key to search</p>}

        {status === "loading" && <p>Loading...</p>}

        {status === "success" && (
          <div className="auth-table-wrap">
            <table className="auth-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col}>
                        {formatValue(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}