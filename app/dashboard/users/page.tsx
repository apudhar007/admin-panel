"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  lastActive?: any;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as User[];
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.email || "-"}</td>
                <td className="px-4 py-2">{u.name || "-"}</td>
                <td className="px-4 py-2">{u.role || "-"}</td>
                <td className="px-4 py-2">{u.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  {u.lastActive ? new Date(u.lastActive.seconds * 1000).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
