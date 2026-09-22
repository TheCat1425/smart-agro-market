import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import PriceCard from '../../components/PriceCard';
import ChartCard from '../../components/ChartCard';
import MarketCard from '../../components/MarketCard';
import DemoModeBanner from '../../components/DemoModeBanner';
import { priceData, historicalPrices, commodities, markets, getCommodity, getMarket, formatBDT } from '../../data/mockData';
import { useApiData } from '../../hooks/useApiData';
import { fetchLatestPrices } from '../../api/marketPrices';
import type { ApiMarketPrice } from '../../api/types';

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#8b5cf6'];

/**
 * Convert API market prices to the same shape the existing PriceCard expects.
 * Returns a unified array that works with the existing filter/render logic.
 */
function mapApiPricesToLocal(apiPrices: ApiMarketPrice[]): Array<{
  commodityId: string;
  marketId: string;
  price: number;
  previousPrice: number;
  unit: string;
  commodityName: string;
  marketName: string;
}> {
  return apiPrices.map(p => ({
    commodityId: String(p.commodity_id),
    marketId: String(p.market_id),
    price: p.price,
    previousPrice: p.min_price ?? p.price, // Use min_price as "previous" for trend arrow
    unit: p.unit,
    commodityName: p.commodity_name,
    marketName: p.market_name,
  }));
}

export default function MarketPrices() {
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');

  // Fetch latest prices from API with mock fallback
  const { data: apiPrices, loading, isDemo } = useApiData(
    () => fetchLatestPrices(),
    [] as ApiMarketPrice[]
  );

  // Choose data source: API mapped data or mock data
  const useMock = isDemo || apiPrices.length === 0;
  const livePrices = useMock ? null : mapApiPricesToLocal(apiPrices);

  // Filter logic — works on both mock and API data
  const filteredPrices = useMock
    ? priceData.filter(p =>
        (selectedCommodity === 'all' || p.commodityId === selectedCommodity) &&
        (selectedMarket === 'all' || p.marketId === selectedMarket)
      )
    : livePrices!.filter(p =>
        (selectedCommodity === 'all' || p.commodityId === selectedCommodity) &&
        (selectedMarket === 'all' || p.marketId === selectedMarket)
      );

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Demo Mode Banner */}
      <DemoModeBanner isDemo={isDemo} />

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading market prices...</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Commodity</label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 min-w-[160px]"
            >
              <option value="all">All Commodities</option>
              {commodities.map(c => (
                <option key={c.id} value={c.id}>{c.image} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Market</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 min-w-[200px]"
            >
              <option value="all">All Markets</option>
              {markets.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPrices.map((p, i) => {
            if (useMock) {
              // Mock data path — use getCommodity/getMarket lookup
              const mockP = p as typeof priceData[0];
              const commodity = getCommodity(mockP.commodityId);
              const market = getMarket(mockP.marketId);
              if (!commodity || !market) return null;
              return (
                <PriceCard
                  key={i}
                  commodityName={commodity.name}
                  commodityEmoji={commodity.image}
                  price={mockP.price}
                  previousPrice={mockP.previousPrice}
                  unit={mockP.unit}
                  marketName={market.name}
                />
              );
            } else {
              // API data path — names already embedded
              const apiP = p as ReturnType<typeof mapApiPricesToLocal>[0];
              return (
                <PriceCard
                  key={i}
                  commodityName={apiP.commodityName}
                  commodityEmoji="🌾"
                  price={apiP.price}
                  previousPrice={apiP.previousPrice}
                  unit={apiP.unit}
                  marketName={apiP.marketName}
                />
              );
            }
          })}
        </div>
      )}

      {/* Price Trend Chart */}
      <ChartCard
        title="7-Day Price Trends"
        subtitle="All commodities — Rajshahi Central Market"
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={historicalPrices}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
            <Tooltip formatter={(value: number, name: string) => [`৳${value}`, name.charAt(0).toUpperCase() + name.slice(1)]} />
            <Legend />
            <Line type="monotone" dataKey="tomato" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} name="Tomato" />
            <Line type="monotone" dataKey="potato" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 3 }} name="Potato" />
            <Line type="monotone" dataKey="onion" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 3 }} name="Onion" />
            <Line type="monotone" dataKey="rice" stroke={COLORS[3]} strokeWidth={2} dot={{ r: 3 }} name="Rice" />
            <Line type="monotone" dataKey="brinjal" stroke={COLORS[4]} strokeWidth={2} dot={{ r: 3 }} name="Brinjal" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Markets List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Markets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>

      {/* Price Comparison Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-7 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Price Comparison Table</h3>
          <p className="text-xs text-gray-400 mt-0.5">Today's prices across all markets (per kg)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Commodity</th>
                {markets.map(m => (
                  <th key={m.id} className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">{m.district}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {commodities.map(commodity => (
                <tr key={commodity.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <span className="mr-2">{commodity.image}</span>
                    {commodity.name}
                  </td>
                  {markets.map(market => {
                    const price = priceData.find(p => p.commodityId === commodity.id && p.marketId === market.id);
                    return (
                      <td key={market.id} className="px-6 py-4 text-center text-sm">
                        {price ? (
                          <span className="font-semibold text-gray-900">{formatBDT(price.price)}</span>
                        ) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
