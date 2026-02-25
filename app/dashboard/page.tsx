"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as User[];
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = async (e: any) => {
    e.preventDefault();
    if (!name || !email || !role) return;
    await addDoc(collection(db, "users"), { name, email, role });
    setName("");
    setEmail("");
    setRole("");
    fetchUsers();
  };

  // Delete user
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  // Open edit modal
  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (!editingUser) return;
    const ref = doc(db, "users", editingUser.id);
    await updateDoc(ref, { name: editName, email: editEmail, role: editRole });
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Dashboard</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 fade-in">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-lg p-6 border border-blue-500 card-hover">
          <h2 className="text-sm font-semibold text-blue-100 mb-2">Users</h2>
          <p className="text-4xl font-bold text-white">{users.length}</p>
          <p className="text-xs text-blue-200 mt-2">Realtime user count</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg rounded-lg p-6 border border-green-500 card-hover">
          <h2 className="text-sm font-semibold text-green-100 mb-2">Orders</h2>
          <p className="text-4xl font-bold text-white">75</p>
          <p className="text-xs text-green-200 mt-2">+5% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg rounded-lg p-6 border border-purple-500 card-hover">
          <h2 className="text-sm font-semibold text-purple-100 mb-2">Revenue</h2>
          <p className="text-4xl font-bold text-white">$12,400</p>
          <p className="text-xs text-purple-200 mt-2">+12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg rounded-lg p-6 border border-orange-500 card-hover">
          <h2 className="text-sm font-semibold text-orange-100 mb-2">Products</h2>
          <p className="text-4xl font-bold text-white">42</p>
          <p className="text-xs text-orange-200 mt-2">+3% from last month</p>
        </div>
      </div>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-6 card-bg shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded mr-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded mr-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          className="border p-2 rounded mr-2 mb-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add User</button>
      </form>

      {/* Users List */}
      <div className="card-bg shadow rounded p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="border-b py-2 flex justify-between items-center user-row">
              <div>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => openEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingUser(null)} />
          <form onSubmit={handleUpdate} className="relative bg-white dark:bg-slate-900 card-bg rounded shadow-lg p-6 w-full max-w-md z-10">
            <h3 className="text-lg font-semibold mb-3">Edit User</h3>
            <input className="w-full border p-2 rounded mb-2" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input className="w-full border p-2 rounded mb-2" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            <input className="w-full border p-2 rounded mb-4" value={editRole} onChange={(e) => setEditRole(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-1 rounded border" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
