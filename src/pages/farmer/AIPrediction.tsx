import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Area, AreaChart } from 'recharts';
import ChartCard from '../../components/ChartCard';
import Badge from '../../components/Badge';
import DemoModeBanner from '../../components/DemoModeBanner';
import { predictions as mockPredictions, monthlyPrices, commodities, markets, getCommodity, getMarket, formatBDT } from '../../data/mockData';
import { useApiData } from '../../hooks/useApiData';
import { fetchPredictions } from '../../api/predictions';
import type { ApiPrediction } from '../../api/types';

// Map commodity string IDs to numeric IDs for the API
const COMMODITY_ID_MAP: Record<string, number> = { c1: 1, c2: 2, c3: 3, c4: 4, c5: 5 };

/**
 * Convert API predictions to the shape the existing UI expects.
 */
function mapApiPrediction(pred: ApiPrediction, currentPriceEstimate: number): {
  commodityId: string;
  marketId: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  factors: string[];
  marketName: string;
  modelName: string | null;
} {
  const priceDelta = pred.predicted_price - currentPriceEstimate;
  const trend: 'up' | 'down' | 'stable' =
    priceDelta > currentPriceEstimate * 0.02 ? 'up'
    : priceDelta < -currentPriceEstimate * 0.02 ? 'down'
    : 'stable';

  return {
    commodityId: `c${pred.commodity_id}`,
    marketId: `m${pred.market_id}`,
    currentPrice: currentPriceEstimate,
    predictedPrice: pred.predicted_price,
    confidence: pred.confidence_score ?? 70,
    trend,
    period: `Predicted for ${pred.target_date}`,
    factors: [
      `Model: ${pred.model_name || 'XGBoost'}${pred.model_version ? ` (${pred.model_version})` : ''}`,
      `Prediction date: ${pred.prediction_date}`,
      `Target: ${pred.target_date}`,
    ],
    marketName: pred.market_name,
    modelName: pred.model_name,
  };
}

export default function AIPrediction() {
  const [selectedCommodity, setSelectedCommodity] = useState('c1');

  const numericId = COMMODITY_ID_MAP[selectedCommodity] || 1;

  // Fetch predictions from API with mock fallback
  const { data: apiPreds, loading, isDemo } = useApiData(
    () => fetchPredictions(numericId),
    [] as ApiPrediction[],
    [numericId]
  );

  const commodity = getCommodity(selectedCommodity);

  // Build prediction list — API or mock
  const useMock = isDemo || apiPreds.length === 0;

  const displayPredictions = useMock
    ? mockPredictions.filter(p => p.commodityId === selectedCommodity)
    : apiPreds.map(pred => mapApiPrediction(pred, pred.predicted_price * 0.95)); // estimate current as 95% of predicted

  const trendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const trendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'danger';
      default: return 'default';
    }
  };

  // Commodity key for chart
  const commodityKey = commodity?.name.toLowerCase() || 'tomato';

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Demo Mode Banner */}
      <DemoModeBanner isDemo={isDemo} />

      {/* AI Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-1">AI Price Prediction Engine</h2>
            <p className="text-white/80 text-sm max-w-xl">
              Machine learning model analyzes historical prices, weather patterns, supply chain data, and seasonal trends to predict future commodity prices.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>
                {isDemo ? 'Demo Data' : 'Model Active'}
              </Badge>
              <span className="text-xs text-white/60">
                {isDemo ? 'Prototype predictions' : `Last updated: ${new Date().toLocaleDateString()}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Selector */}
      <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <label className="block text-xs font-medium text-gray-500 mb-2">Select Commodity for Prediction</label>
        <div className="flex flex-wrap gap-2">
          {commodities.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCommodity(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedCommodity === c.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{c.image}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading AI predictions...</p>
        </div>
      )}

      {/* Predictions Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayPredictions.map((pred, i) => {
            const marketName = useMock
              ? getMarket((pred as typeof mockPredictions[0]).marketId)?.name || ''
              : (pred as ReturnType<typeof mapApiPrediction>).marketName;

            const priceDiff = pred.predictedPrice - pred.currentPrice;
            const percentChange = ((priceDiff / pred.currentPrice) * 100).toFixed(1);

            return (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{marketName}</h3>
                    <p className="text-xs text-gray-400">{pred.period}</p>
                  </div>
                  {trendIcon(pred.trend)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Current Price</p>
                    <p className="text-lg font-bold text-gray-900">{formatBDT(pred.currentPrice)}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${pred.trend === 'up' ? 'bg-green-50' : pred.trend === 'down' ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <p className="text-xs text-gray-500 mb-0.5">Predicted Price</p>
                    <p className={`text-lg font-bold ${pred.trend === 'up' ? 'text-green-700' : pred.trend === 'down' ? 'text-red-700' : 'text-gray-900'}`}>
                      {formatBDT(pred.predictedPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={trendColor(pred.trend) as 'success' | 'danger' | 'default'}>
                      {priceDiff > 0 ? '+' : ''}{percentChange}%
                    </Badge>
                    <span className="text-xs text-gray-500">({priceDiff > 0 ? '+' : ''}{formatBDT(priceDiff)}/kg)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-xs text-gray-500">Confidence:</div>
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pred.confidence >= 80 ? 'bg-green-500' : pred.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{pred.confidence}%</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Contributing Factors
                  </p>
                  <ul className="space-y-0.5">
                    {pred.factors.map((f, j) => (
                      <li key={j} className="text-xs text-blue-600">• {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Price Forecast Chart */}
      <ChartCard
        title={`${commodity?.name || ''} Price Forecast`}
        subtitle="Historical + Predicted (asterisk months are predictions)"
      >
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyPrices}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
            <Tooltip formatter={(value: number) => [`৳${value}`, commodity?.name || '']} />
            <ReferenceLine x="Sep" stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Today', position: 'top', fontSize: 11, fill: '#94a3b8' }} />
            <Area type="monotone" dataKey={commodityKey} stroke="#16a34a" strokeWidth={2} fill="url(#colorPrice)" dot={{ fill: '#16a34a', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Prediction Disclaimer</p>
          <p className="text-xs text-amber-700 mt-0.5">
            AI predictions are based on historical data and statistical models. Actual market prices may vary due to unforeseen circumstances such as natural disasters, policy changes, or sudden supply/demand shifts. Use predictions as guidance, not guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}
