"use client";

import { useNotifications } from "@/context/NotificationContext";
import { Bell, CheckCircle, Info, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationList() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle size={16} className="text-green-500" />;
      case "ERROR": return <XCircle size={16} className="text-red-500" />;
      case "WARNING": return <AlertCircle size={16} className="text-orange-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-black transition relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>
            )}
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <li 
                    key={notif._id} 
                    className={`p-4 transition hover:bg-gray-50 cursor-pointer ${notif.read ? 'opacity-60' : 'bg-blue-50/20'}`}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif._id);
                    }}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 flex-shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {notif.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                        {notif.actionUrl && (
                          <Link href={notif.actionUrl} className="text-blue-600 text-xs font-medium hover:underline mt-2 inline-block">
                            View details →
                          </Link>
                        )}
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
            <Link 
              href="/employee/notifications" 
              className="text-xs font-bold text-gray-600 hover:text-black transition"
              onClick={() => setIsOpen(false)}
            >
              View All Activity
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
