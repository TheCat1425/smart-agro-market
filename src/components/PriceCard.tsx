import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatBDT } from '../data/mockData';

interface PriceCardProps {
  commodityName: string;
  commodityEmoji: string;
  price: number;
  previousPrice: number;
  unit: string;
  marketName: string;
}

export default function PriceCard({ commodityName, commodityEmoji, price, previousPrice, unit, marketName }: PriceCardProps) {
  const diff = price - previousPrice;
  const percent = previousPrice > 0 ? ((diff / previousPrice) * 100).toFixed(1) : '0';
  const isUp = diff > 0;
  const isDown = diff < 0;

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-hover">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{commodityEmoji}</span>
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{commodityName}</h3>
          <p className="text-sm text-gray-500">{marketName}</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{formatBDT(price)}</p>
          <p className="text-sm text-gray-400 mt-1">per {unit}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold ${
          isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          {isUp ? '+' : ''}{percent}%
        </div>
      </div>
    </div>
  );
}
