import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Market } from '../data/mockData';
import Badge from './Badge';

interface MarketCardProps {
  market: Market;
  highlight?: boolean;
}

export default function MarketCard({ market, highlight = false }: MarketCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-7 shadow-sm border card-hover ${highlight ? 'border-primary-300 ring-2 ring-primary-100' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 p-3.5 rounded-xl">
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{market.name}</h3>
            <p className="text-xs text-gray-400">{market.nameBn}</p>
          </div>
        </div>
        <Badge variant={market.type === 'Wholesale' ? 'primary' : 'default'}>{market.type}</Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {market.district}
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {market.dailyTraders} traders/day
        </div>
      </div>
    </div>
  );
}
