import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/profile/1')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div>
      <h2>Profile</h2>
      <ul>
        <li><b>Username:</b> {profile.username}</li>
        <li><b>Email:</b> {profile.email}</li>
        <li><b>Role:</b> {profile.role}</li>
        <li><b>Subscribed:</b> {profile.subscribed ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
}
