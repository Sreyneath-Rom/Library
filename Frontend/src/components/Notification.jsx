const Notifications = ({ className }) => {
  const notifications = [
    { id: 1, message: 'New book added to your library.' },
    { id: 2, message: 'Your subscription will expire soon.' },
    { id: 3, message: 'Reminder: Review pending approvals.' },
  ];

  return (
    <div className={`bg-white shadow-lg rounded-md p-4 w-72 ${className}`}>
      <h3 className="text-lg font-semibold mb-2 text-sky-600">Notifications</h3>
      <ul className="space-y-2">
        {notifications.map((note) => (
          <li key={note.id} className="text-sm text-gray-700 hover:text-sky-500 cursor-pointer">
            {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;