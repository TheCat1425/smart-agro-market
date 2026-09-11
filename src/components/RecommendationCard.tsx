import React from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Truck, Award } from 'lucide-react';
import { MarketRecommendation, getMarket, getCommodity, formatBDT } from '../data/mockData';

interface RecommendationCardProps {
  rec: MarketRecommendation;
  rank: number;
}

export default function RecommendationCard({ rec, rank }: RecommendationCardProps) {
  const market = getMarket(rec.marketId);
  const commodity = getCommodity(rec.commodityId);
  if (!market || !commodity) return null;

  const scoreColor = rec.score >= 85 ? 'text-green-600 bg-green-50' : rec.score >= 70 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rank <= 3 && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              rank === 1 ? 'bg-amber-100 text-amber-700' : rank === 2 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'
            }`}>
              #{rank}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{market.name}</h3>
            <p className="text-xs text-gray-400">{market.nameBn}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${scoreColor}`}>
          {rec.score}/100
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Price</p>
          <p className="text-sm font-bold text-gray-900">{formatBDT(rec.currentPrice)}/{commodity.unit}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Distance</p>
          <p className="text-sm font-bold text-gray-900">{rec.distance} km</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Transport</p>
          <p className="text-sm font-bold text-gray-900">{formatBDT(rec.transportCost)}/{commodity.unit}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 bg-primary-50 rounded-xl p-4">
        <Award className="w-4 h-4 text-primary-600 inline mr-1" />
        {rec.reason}
      </p>
    </div>
  );
}
