import React from "react";

type AnalyticsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
};

export default function AnalyticsCard({ title, value, icon, trend }: AnalyticsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl text-gray-700">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}
