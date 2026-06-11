"use client";

import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, Info, XCircle, AlertCircle, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { notifications, markAsRead, unreadCount } = useNotifications();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "employee")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle size={24} className="text-green-500" />;
      case "ERROR": return <XCircle size={24} className="text-red-500" />;
      case "WARNING": return <AlertCircle size={24} className="text-orange-500" />;
      default: return <Info size={24} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Bell className="text-gray-400" size={28} /> Activity & Notifications
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Stay updated on your product submissions and approvals.</p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold text-sm">
              {unreadCount} Unread
            </div>
          )}
        </div>

        {/* List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Bell size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-500">When you submit a product for approval, admin feedback will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <li 
                  key={notif._id} 
                  className={`p-6 transition hover:bg-gray-50 ${notif.read ? 'opacity-70' : 'bg-blue-50/10'}`}
                >
                  <div className="flex gap-4">
                    <div className="mt-1 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-lg ${notif.read ? 'text-gray-700' : 'text-gray-900 font-bold'}`}>
                          {notif.message}
                        </p>
                        <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                          {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4">
                        {!notif.read && (
                          <button 
                            onClick={() => markAsRead(notif._id)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                          >
                            Mark as Read
                          </button>
                        )}
                        {notif.actionUrl && (
                          <Link 
                            href={notif.actionUrl} 
                            className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition flex items-center gap-2"
                          >
                            View Details <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
