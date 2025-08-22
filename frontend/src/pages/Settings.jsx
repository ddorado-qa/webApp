import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const toggle = key => {
    const updated = { ...settings, [key]: !settings[key] };
    fetch('http://localhost:4000/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).then(() => setSettings(updated));
  };

  if (!settings) return <p>Loading settings...</p>;

  return (
    <div>
      <h2>Settings</h2>
      <p>
        Dark Mode: 
        <button onClick={() => toggle('darkMode')}>
          {settings.darkMode ? 'ON' : 'OFF'}
        </button>
      </p>
      <p>
        Notifications: 
        <button onClick={() => toggle('notifications')}>
          {settings.notifications ? 'ON' : 'OFF'}
        </button>
      </p>
      <p>Language: {settings.language}</p>
    </div>
  );
}
