import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('dd_users').select('*');
    setUsers(data);
  }

  async function addUser() {
    await supabase.from('dd_users').insert([newUser]);
    setNewUser({ email: '', role: 'user' });
    fetchUsers();
  }

  return (
    <div>
      <h2>Manage Users</h2>
      <input
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        placeholder="User Email"
        style={{ display: 'block', margin: '10px 0' }}
      />
      <select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        style={{ display: 'block', margin: '10px 0' }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={addUser}>Add User</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}
export default UsersManager;
