import React from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TrendGraphProps {
  data: { label: string; value: number }[];
  title?: string;
  className?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({ data, title, className = '' }) => {
  return (
    <div className={`p-8 bg-neutral-900 border border-white/5 rounded-[2.5rem] ${className}`}>
      {title && <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">{title}</h4>}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="label" hide />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#10b981' }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
