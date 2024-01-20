import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editUserId) {
      // Update existing user
      try {
        await axios.put(`${API_URL}/${editUserId}`, formData);
        setEditUserId(null);
        setFormData({ name: '', email: '', phone: '' });
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      // Add new user
      try {
        await axios.post(API_URL, formData);
        setFormData({ name: '', email: '', phone: '' });
        fetchUsers();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="app">
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <button type="submit">{editUserId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.phone}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
