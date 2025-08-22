import React, { useEffect, useState } from 'react';

export default function Support() {
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/support')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    fetch('http://localhost:4000/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, subject, message })
    })
      .then(res => res.json())
      .then(newMsg => {
        setMessages([newMsg, ...messages]);
        setSubject('');
        setMessage('');
      });
  };

  return (
    <div>
      <h2>Support</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Subject" 
          value={subject} 
          onChange={e => setSubject(e.target.value)} 
        />
        <textarea 
          placeholder="Message" 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
        />
        <button type="submit">Send</button>
      </form>

      <h3>Messages</h3>
      <ul>
        {messages.map(m => (
          <li key={m.id}>
            <b>{m.subject}:</b> {m.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
