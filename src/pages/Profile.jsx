import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
  };

  const handleLogin = () => {
    login({ name: "John Doe", email: "john@example.com" });
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Please log in to view your profile.</p>
        <button
          onClick={handleLogin}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Login (Demo)
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Profile</h1>
      <p className="text-gray-700 mb-6">View and edit your profile information.</p>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;