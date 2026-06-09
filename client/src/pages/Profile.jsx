// src/pages/Profile.jsx
// User profile page — view and update name

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import { formatDate } from "../utils/helpers";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setNameError("Name is required");
    if (name.trim().length < 2) return setNameError("Name must be at least 2 characters");
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { name: name.trim() });
      updateUser(res.data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* Avatar + info card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Member since {formatDate(user?.createdAt, "MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* Update name form */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Update Name</h3>
        <form onSubmit={handleNameUpdate} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              className={`input-field ${nameError ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="Your full name"
            />
            {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
          </div>
          <div>
            <label className="label-text">Email Address</label>
            <input type="email" value={user?.email} disabled
              className="input-field opacity-60 cursor-not-allowed" />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Email cannot be changed.</p>
          </div>
          <button type="submit" disabled={saving || name.trim() === user?.name} className="btn-primary">
            {saving ? <><Spinner size="sm" /> Saving...</> : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Account Details</h3>
        <div className="space-y-3">
          {[
            { label: "User ID", value: user?._id },
            { label: "Account Created", value: formatDate(user?.createdAt, "PPP") },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono break-all">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
