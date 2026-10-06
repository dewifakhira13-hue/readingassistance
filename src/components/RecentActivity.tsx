import React from 'react';
import {
  Clock,
  Sparkles,
  Lightbulb,
  UploadCloud,
  Eye,
  BarChart2,
} from 'lucide-react';

interface RecentActivityProps {
  onViewAll?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ onViewAll }) => {
  const activities = [
    {
      id: 'act-1',
      title: 'AI analysis completed for Class VIII-A',
      time: 'Today, 10:24 AM',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'act-2',
      title: 'New recommendation generated for EXP-5007',
      time: 'Today, 09:47 AM',
      icon: Lightbulb,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'act-3',
      title: 'Reading test (Session 5) uploaded',
      time: 'Today, 08:30 AM',
      icon: UploadCloud,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'act-4',
      title: 'Teacher viewed student report (EXP-5003)',
      time: 'Yesterday, 04:12 PM',
      icon: Eye,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'act-5',
      title: 'Engagement data updated',
      time: 'Yesterday, 02:17 PM',
      icon: BarChart2,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/50 px-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700 truncate">
                  {item.title}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 font-normal">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
