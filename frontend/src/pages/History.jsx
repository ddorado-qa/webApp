import React, { useEffect, useState } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/history')
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  return (
    <div>
      <h2>History</h2>
      {history.length === 0 ? (
        <p>No actions recorded.</p>
      ) : (
        <ul>
          {history.map(item => (
            <li key={item.id}>
              [{item.timestamp}] User {item.userId}: {item.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
