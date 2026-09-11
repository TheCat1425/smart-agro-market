import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: 'green' | 'blue' | 'amber' | 'red' | 'purple';
}

const colorMap = {
  green: 'from-primary-500 to-primary-700',
  blue: 'from-blue-500 to-blue-700',
  amber: 'from-amber-500 to-amber-700',
  red: 'from-red-500 to-red-700',
  purple: 'from-purple-500 to-purple-700',
};

const bgMap = {
  green: 'bg-primary-50',
  blue: 'bg-blue-50',
  amber: 'bg-amber-50',
  red: 'bg-red-50',
  purple: 'bg-purple-50',
};

export default function StatCard({ title, value, change, changeLabel, icon, color = 'green' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-hover animate-[fade-in_0.5s_ease-out]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-3">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : change < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <Minus className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={`${bgMap[color]} p-4 rounded-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
