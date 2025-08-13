import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500">
        Please log in to manage your settings.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Settings</h1>
      <p className="text-gray-700 mb-6">Manage your preferences and account settings.</p>
      <div className="max-w-md">
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              disabled
            />
            Receive email notifications (Coming soon)
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              disabled
            />
            Dark mode (Coming soon)
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;