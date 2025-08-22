import React, { useEffect, useState } from 'react';

export default function Rating() {
  const [ratings, setRatings] = useState([]);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/rating')
      .then(res => res.json())
      .then(data => setRatings(data));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    fetch('http://localhost:4000/rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, stars, comment })
    })
      .then(res => res.json())
      .then(newRating => {
        setRatings([newRating, ...ratings]);
        setStars(5);
        setComment('');
      });
  };

  return (
    <div>
      <h2>Rate this App</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Stars:
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={stars} 
            onChange={e => setStars(Number(e.target.value))} 
          />
        </label>
        <textarea 
          placeholder="Comment" 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
        />
        <button type="submit">Submit</button>
      </form>

      <h3>All Ratings</h3>
      <ul>
        {ratings.map(r => (
          <li key={r.id}>
            ⭐ {r.stars} - {r.comment || 'No comment'}
          </li>
        ))}
      </ul>
    </div>
  );
}
