import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Notifications
      </h1>

      <NotificationList />
    </div>
  );
}