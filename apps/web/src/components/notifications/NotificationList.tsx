"use client";

import { useEffect, useState } from "react";

import {
getNotifications,
markNotificationAsRead,
} from "@/services/notification.service";

interface Notification {
id: string;
title: string;
message: string;
isRead: boolean;
createdAt: string;
}

export default function NotificationList() {
const [notifications, setNotifications] =
useState<Notification[]>([]);

const [loading, setLoading] =
useState(true);

useEffect(() => {
const loadNotifications = async () => {
try {
const response =
await getNotifications();

setNotifications(response.data);
} catch (error) {
console.error(error);
} finally {
setLoading(false);
}
};

loadNotifications();
}, []);

const handleRead = async (
id: string
) => {
try {
await markNotificationAsRead(id);

setNotifications((prev) =>
prev.map((notification) =>
notification.id === id
? {
...notification,
isRead: true,
}
: notification
)
);
} catch (error) {
console.error(error);
}
};

if (loading) {
return <p>Loading notifications...</p>;
}

if (notifications.length === 0) {
return <p>No notifications yet.</p>;
}

return (
  <div className="space-y-4">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`rounded-lg border p-4 ${
          notification.isRead
            ? "bg-white"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <h3 className="font-semibold">
          {notification.title}
        </h3>

        <p className="mt-1 text-gray-600">
          {notification.message}
        </p>

        <p className="mt-2 text-sm text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </p>

        {!notification.isRead && (
          <button
            onClick={() => handleRead(notification.id)}
            className="mt-3 rounded bg-blue-600 px-4 py-2 text-white"
          >
            Mark as Read
          </button>
        )}
      </div>
    ))}
  </div>
);
}