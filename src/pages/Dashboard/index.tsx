import React from 'react';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={signOut}>Log out</button>
    </div>
  );
};

export default Dashboard;
