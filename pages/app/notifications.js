import { useMemo } from 'react';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';
import useNotificationStore from '../../client/src/store/notificationStore';

export default function NotificationsPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const sorted = useMemo(() => notifications.slice(), [notifications]);

  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-600">{unreadCount} unread</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={markAllAsRead}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sorted.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              sorted.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    notification.read ? 'border-gray-200 bg-white' : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </ProtectedLayout>
    </RequireAuth>
  );
}
