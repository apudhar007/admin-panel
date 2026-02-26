"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db, storage, auth } from "../../firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  lastActive?: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { isActive: false });
    }
    await auth.signOut();
    router.push("/login");
  };
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  // active user count
  const [activeUsers, setActiveUsers] = useState(0);

  // content management
  interface ContentItem {
    id: string;
    text: string;
    imageUrl: string;
    createdAt: any;
  }
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [contentText, setContentText] = useState("");
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as User[];
    setUsers(data);
    // calculate active users (based on isActive flag)
    const activeCount = data.filter((u) => (u as any).isActive).length;
    setActiveUsers(activeCount);
    setLoading(false);
  };

  const fetchContents = async () => {
    const q = query(collection(db, "contents"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ContentItem[];
    // sort by createdAt desc if available
    items.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    setContents(items);
  };

  useEffect(() => {
    fetchUsers();
    fetchContents();
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

  const handleContentUpload = async (e: any) => {
    e.preventDefault();
    if (!contentText || !contentFile) return;
    setUploading(true);
    const fileRef = storageRef(storage, `uploads/${Date.now()}_${contentFile.name}`);
    await uploadBytes(fileRef, contentFile);
    const url = await getDownloadURL(fileRef);
    await addDoc(collection(db, "contents"), {
      text: contentText,
      imageUrl: url,
      createdAt: new Date(),
    });
    setContentText("");
    setContentFile(null);
    setUploading(false);
    fetchContents();
  };

  const deleteContent = async (id: string) => {
    await deleteDoc(doc(db, "contents", id));
    fetchContents();
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Users Dashboard</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 fade-in">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-lg p-6 border border-blue-500 card-hover">
          <h2 className="text-sm font-semibold text-blue-100 mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-white">{users.length}</p>
          <p className="text-xs text-blue-200 mt-2">Realtime user count</p>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg rounded-lg p-6 border border-teal-500 card-hover">
          <h2 className="text-sm font-semibold text-teal-100 mb-2">Active Users</h2>
          <p className="text-4xl font-bold text-white">{activeUsers}</p>
          <p className="text-xs text-teal-200 mt-2">Users currently marked active</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg rounded-lg p-6 border border-purple-500 card-hover">
          <h2 className="text-sm font-semibold text-purple-100 mb-2">Contents</h2>
          <p className="text-4xl font-bold text-white">{contents.length}</p>
          <p className="text-xs text-purple-200 mt-2">Items for Android app</p>
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

      {/* Content Management */}
      <div className="mb-8 card-bg shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Add Content for Android App</h2>
        <form onSubmit={handleContentUpload} className="flex flex-col gap-2">
          <textarea
            placeholder="Text to display"
            className="border p-2 rounded w-full"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
          />
          {/* styled file input with label for better visibility */}
          <label className="mt-2 inline-block">
            <span className="px-3 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300">
              Choose Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setContentFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {contentFile && <span className="ml-2 text-sm">{contentFile.name}</span>}
          </label>
          <button
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading || !contentFile}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Existing Items</h3>
          {contents.length === 0 && <p>No content yet.</p>}
          {contents.map((c) => (
            <div key={c.id} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center gap-4">
                {c.imageUrl && <img src={c.imageUrl} alt="" className="w-16 h-16 object-cover rounded" />}
                <span>{c.text}</span>
              </div>
              <button
                className="text-red-600 hover:underline text-sm"
                onClick={() => deleteContent(c.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
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
