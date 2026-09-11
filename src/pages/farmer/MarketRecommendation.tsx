import React, { useState, useMemo } from 'react';
import {
  MapPin, Truck, Award, TrendingUp, TrendingDown, Minus,
  Brain, Search, AlertTriangle, CheckCircle, Info, Star,
  Calculator, BarChart3, Lightbulb, ChevronDown, ChevronUp,
  Target, Zap, Shield, Package
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import {
  analyzeMarkets,
  validateInput,
  farmerLocations,
  SCORE_WEIGHTS,
  type FarmerInput,
  type MarketAnalysis,
  type RecommendationResult,
} from '../../data/recommendationEngine';
import { commodities, formatBDT } from '../../data/mockData';

// ── Default values for demo ──
function getDefaultHarvestDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

const DEFAULT_INPUT: FarmerInput = {
  commodityId: 'c1',
  quantity: 500,
  farmerLocation: 'Rajshahi',
  harvestDate: getDefaultHarvestDate(),
  minPricePerKg: 50,
};

export default function MarketRecommendation() {
  // Form state
  const [formData, setFormData] = useState<FarmerInput>({ ...DEFAULT_INPUT });
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);

  const handleChange = (field: keyof FarmerInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleAnalyze = () => {
    const validationErrors = validateInput(formData);
    if (validationErrors.length > 0) {
      const errMap: Record<string, string> = {};
      validationErrors.forEach((e) => { errMap[e.field] = e.message; });
      setErrors(errMap);
      return;
    }

    setIsAnalyzing(true);
    setErrors({});

    // Simulate a brief analysis delay for UX
    setTimeout(() => {
      const r = analyzeMarkets(formData);
      setResult(r);
      setIsAnalyzing(false);
    }, 600);
  };

  // Chart data
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.analyses
      .sort((a, b) => b.netReturn - a.netReturn)
      .map((a) => ({
        name: a.market.name.replace(' Market', '').replace(' Wholesale', ''),
        netReturn: Math.round(a.netReturn),
        isRecommended: a.isRecommended,
      }));
  }, [result]);

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* ═══ HERO HEADER ═══ */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-teal-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-1">Smart Market Recommendation</h2>
            <p className="text-white/80 text-sm max-w-2xl">
              Find the market with the highest <strong>net return</strong> — not just the highest price.
              Our algorithm calculates expected revenue minus transportation, platform fees, and other costs
              to recommend the most profitable selling destination.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full">
                <Zap className="w-3 h-3" /> Net Return Optimization
              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full">
                <Shield className="w-3 h-3" /> 5 Markets Analyzed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FORMULA BANNER ═══ */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Core Formula</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-indigo-100 font-mono text-sm text-gray-800">
          <p><strong className="text-primary-700">Net Return</strong> = Expected Selling Revenue − Transportation Cost − Platform Fee − Other Costs</p>
          <p className="text-gray-500 mt-1 text-xs">where: Expected Selling Revenue = Predicted Market Price × Quantity</p>
        </div>
      </div>

      {/* ═══ MARKET ANALYSIS FORM ═══ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-50 to-teal-50 px-7 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary-600" />
            Market Analysis Input
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Enter your crop details to find the most profitable market</p>
        </div>

        <div className="p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Commodity */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Commodity / Crop</label>
              <select
                value={formData.commodityId}
                onChange={(e) => handleChange('commodityId', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none transition-all ${
                  errors.commodityId ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.image} {c.name} ({c.nameBn})
                  </option>
                ))}
              </select>
              {errors.commodityId && (
                <p className="text-xs text-red-500 mt-1">{errors.commodityId}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Quantity (kg)</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 500"
                min="1"
                max="50000"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none transition-all ${
                  errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Farmer Location */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Your Location</label>
              <select
                value={formData.farmerLocation}
                onChange={(e) => handleChange('farmerLocation', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none transition-all ${
                  errors.farmerLocation ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                {farmerLocations.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    📍 {loc.label} ({loc.labelBn})
                  </option>
                ))}
              </select>
              {errors.farmerLocation && (
                <p className="text-xs text-red-500 mt-1">{errors.farmerLocation}</p>
              )}
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Expected Harvest Date</label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => handleChange('harvestDate', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none transition-all ${
                  errors.harvestDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.harvestDate && (
                <p className="text-xs text-red-500 mt-1">{errors.harvestDate}</p>
              )}
            </div>

            {/* Min Acceptable Price */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Minimum Acceptable Price (৳/kg)</label>
              <input
                type="number"
                value={formData.minPricePerKg}
                onChange={(e) => handleChange('minPricePerKg', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 50"
                min="0"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none transition-all ${
                  errors.minPricePerKg ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.minPricePerKg && (
                <p className="text-xs text-red-500 mt-1">{errors.minPricePerKg}</p>
              )}
            </div>

            {/* Analyze Button */}
            <div className="flex items-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-primary-600 to-teal-600 text-white font-semibold text-sm rounded-xl hover:from-primary-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Analyze Best Market
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RESULTS ═══ */}
      {result && (
        <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">

          {/* ── Warning: no market meets min price ── */}
          {!result.anyMeetsMinPrice && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">No market meets your minimum price</p>
                <p className="text-xs text-red-700 mt-0.5">
                  None of the analyzed markets have a predicted price at or above your minimum of {formatBDT(formData.minPricePerKg)}/kg.
                  The best available alternative is shown below.
                </p>
              </div>
            </div>
          )}

          {/* ══════ 1. AI RECOMMENDATION HERO CARD ══════ */}
          {result.recommended && (
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-teal-700 rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

              <div className="relative">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <Award className="w-3.5 h-3.5" />
                    AI RECOMMENDED — BEST CHOICE
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/15 text-white/90 text-xs font-medium px-2.5 py-1 rounded-full">
                    Score: {result.recommended.score}/100
                  </span>
                </div>

                <h3 className="text-lg lg:text-xl font-bold mb-0.5">{result.recommended.market.name}</h3>
                <p className="text-white/70 text-xs mb-5">{result.recommended.market.nameBn} • {result.recommended.market.type} Market • Highest Expected Net Return</p>

                {/* Big number */}
                <div className="mb-6">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Expected Net Return</p>
                  <p className="text-3xl lg:text-4xl font-extrabold tracking-tight">{formatBDT(Math.round(result.recommended.netReturn))}</p>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <MetricTile label="Predicted Price" value={`${formatBDT(result.recommended.predictedPrice)}/kg`} />
                  <MetricTile label="Quantity" value={`${result.recommended.quantity.toLocaleString()} kg`} />
                  <MetricTile label="Gross Revenue" value={formatBDT(Math.round(result.recommended.grossRevenue))} />
                  <MetricTile label="Transport Cost" value={formatBDT(Math.round(result.recommended.estimatedTransportCost))} />
                  <MetricTile label="Total Costs" value={formatBDT(Math.round(result.recommended.totalCosts))} />
                  <MetricTile label="Profit/kg" value={`${formatBDT(Math.round(result.recommended.profitPerKg * 100) / 100)}`} />
                </div>
              </div>
            </div>
          )}

          {/* ══════ 2. MARKET COMPARISON TABLE ══════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-7 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-600" />
                Market Comparison — Ranked by Net Return
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">All 5 markets analyzed for {commodities.find(c => c.id === formData.commodityId)?.name || 'your commodity'}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rank</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Market</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Current Price</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Predicted Price</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Distance</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Transport</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Revenue</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Total Costs</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Net Return</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {result.analyses.map((a) => (
                    <tr
                      key={a.market.id}
                      className={`border-b border-gray-50 transition-colors ${
                        a.isRecommended
                          ? 'bg-primary-50/60 hover:bg-primary-50'
                          : 'hover:bg-gray-50'
                      } ${!a.meetsMinPrice ? 'opacity-60' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          a.rank === 1 ? 'bg-amber-100 text-amber-700'
                            : a.rank === 2 ? 'bg-gray-100 text-gray-600'
                            : a.rank === 3 ? 'bg-orange-100 text-orange-600'
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                          #{a.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{a.market.name}</p>
                            <p className="text-xs text-gray-400">{a.market.type}</p>
                          </div>
                          {a.isRecommended && (
                            <span className="text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">
                              BEST
                            </span>
                          )}
                          {!a.meetsMinPrice && (
                            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              BELOW MIN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatBDT(a.currentPrice)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-medium">{formatBDT(a.predictedPrice)}</span>
                        <TrendIndicator trend={a.priceTrend} />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{a.estimatedDistanceKm} km</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatBDT(Math.round(a.estimatedTransportCost))}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatBDT(Math.round(a.grossRevenue))}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatBDT(Math.round(a.totalCosts))}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${a.isRecommended ? 'text-primary-700' : 'text-gray-900'}`}>
                          {formatBDT(Math.round(a.netReturn))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center justify-center w-10 h-6 rounded-full text-xs font-bold ${
                          a.score >= 80 ? 'bg-green-100 text-green-700'
                            : a.score >= 60 ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {a.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ══════ 3. NET RETURN BAR CHART ══════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-primary-600" />
              Net Return Comparison
            </h3>
            <p className="text-xs text-gray-500 mb-5">Expected net return (৳) per market, sorted highest to lowest</p>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatBDT(value), 'Net Return']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="netReturn" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isRecommended ? '#16a34a' : '#94a3b8'}
                      fillOpacity={entry.isRecommended ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-600 inline-block" />
                Recommended Market
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gray-400 opacity-60 inline-block" />
                Other Markets
              </span>
            </div>
          </div>

          {/* ══════ 4. PRICE VS PROFIT INSIGHT ══════ */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="bg-amber-200 p-2.5 rounded-xl flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 text-sm mb-1.5">
                  💡 Price ≠ Profit: Key Insight
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  "The market with the highest selling price is not always the most profitable."
                </p>
                <p className="text-sm text-amber-700 mt-2 leading-relaxed">
                  {result.insight}
                </p>
              </div>
            </div>
          </div>

          {/* ══════ 5. TRANSPORTATION DETAILS ══════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-blue-600" />
              Transportation Cost Breakdown
            </h3>
            <p className="text-xs text-gray-500 mb-4">Estimated distances and transport costs from {formData.farmerLocation}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.analyses
                .sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm)
                .map((a) => (
                <div key={a.market.id} className={`rounded-xl p-4 border ${
                  a.isRecommended ? 'border-primary-200 bg-primary-50/50' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-gray-900">{a.market.name}</p>
                    {a.isRecommended && (
                      <span className="text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">BEST</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Est. {a.estimatedDistanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {formatBDT(Math.round(a.estimatedTransportCost))}
                    </span>
                  </div>
                  {/* Cost formula mini-display */}
                  <div className="mt-2 text-[10px] text-gray-400">
                    {a.estimatedDistanceKm <= 5
                      ? `৳100 base + ৳${(a.quantity * 0.2).toFixed(0)} (${a.quantity}kg × ৳0.2)`
                      : `৳200 base + ৳${a.estimatedDistanceKm * 8} (${a.estimatedDistanceKm}km × ৳8) + ৳${(a.quantity * 0.5).toFixed(0)} (${a.quantity}kg × ৳0.5)`
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <strong>Estimation note:</strong> Distances and transport costs are estimated based on approximate road distances and a simplified formula
                (base + distance × ৳8/km + quantity × ৳0.5/kg). Actual costs may vary. This is not real GPS routing.
              </p>
            </div>
          </div>

          {/* ══════ 6. SCORE EXPLAINER ══════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowScoreExplainer(!showScoreExplainer)}
              className="w-full px-7 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                How the Score is Calculated
              </h3>
              {showScoreExplainer
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </button>

            {showScoreExplainer && (
              <div className="px-7 pb-6 animate-[fade-in_0.3s_ease-out]">
                <p className="text-xs text-gray-500 mb-4">
                  The recommendation score (0–100) combines four factors. Each factor is normalized
                  relative to the best value among all markets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  {SCORE_WEIGHTS.map((sw) => (
                    <div key={sw.label} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sw.color }} />
                        <span className="text-sm font-semibold text-gray-800">{sw.label}</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: sw.color }}>{sw.weight}</p>
                      <p className="text-xs text-gray-500 mt-1">{sw.description}</p>
                    </div>
                  ))}
                </div>

                {/* Score breakdown for recommended market */}
                {result.recommended && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-700 mb-3">
                      Score Breakdown — {result.recommended.market.name}
                    </p>
                    <div className="space-y-2">
                      <ScoreBar label="Net Return" value={result.recommended.scoreBreakdown.netReturnScore} max={50} color="#16a34a" />
                      <ScoreBar label="Predicted Price" value={result.recommended.scoreBreakdown.predictedPriceScore} max={20} color="#2563eb" />
                      <ScoreBar label="Transport Efficiency" value={result.recommended.scoreBreakdown.transportEfficiency} max={20} color="#f59e0b" />
                      <ScoreBar label="Price Trend" value={result.recommended.scoreBreakdown.priceTrendScore} max={10} color="#8b5cf6" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">Total Score</span>
                      <span className="text-lg font-extrabold text-primary-700">{result.recommended.score}/100</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ══════ 7. AI EXPLANATION ══════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-indigo-600" />
              Why This Market?
            </h3>
            <div className="space-y-2.5">
              {result.aiExplanation.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  {bullet.startsWith('⚠') ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══════ COST DETAILS FOR RECOMMENDED ══════ */}
          {result.recommended && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-primary-600" />
                Detailed Cost Breakdown — {result.recommended.market.name}
              </h3>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="space-y-3">
                  <CostRow label="Expected Selling Revenue" sublabel={`${formatBDT(result.recommended.predictedPrice)}/kg × ${result.recommended.quantity.toLocaleString()} kg`} value={result.recommended.grossRevenue} positive />
                  <div className="border-t border-gray-200 pt-3">
                    <CostRow label="Transportation Cost" sublabel={`${result.recommended.estimatedDistanceKm} km from ${formData.farmerLocation}`} value={result.recommended.estimatedTransportCost} />
                    <CostRow label="Platform Fee (1%)" sublabel="Smart Agro Market commission" value={result.recommended.platformFee} />
                    <CostRow label="Other Costs" sublabel="Loading, unloading, wastage allowance" value={result.recommended.otherCosts} />
                  </div>
                  <div className="border-t-2 border-primary-200 pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Expected Net Return</p>
                      <p className="text-xs text-gray-500">Profit per kg: {formatBDT(Math.round(result.recommended.profitPerKg * 100) / 100)}</p>
                    </div>
                    <p className="text-2xl font-extrabold text-primary-700">{formatBDT(Math.round(result.recommended.netReturn))}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════ DISCLAIMER ══════ */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Prototype Disclaimer</p>
              <p className="text-xs text-amber-700 mt-0.5">
                This recommendation is based on estimated market data, predicted prices, and simplified cost models.
                Actual market conditions, transport costs, and fees may vary. This tool is designed as a decision-support
                system to help farmers make more informed choices — it does not guarantee specific returns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small helper components ──

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-xl px-3 py-2.5">
      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-white font-bold text-sm">{value}</p>
    </div>
  );
}

function TrendIndicator({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500 inline ml-1" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500 inline ml-1" />;
  return <Minus className="w-3 h-3 text-gray-400 inline ml-1" />;
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-36">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-12 text-right">{value}/{max}</span>
    </div>
  );
}

function CostRow({ label, sublabel, value, positive }: { label: string; sublabel: string; value: number; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      <p className={`text-sm font-semibold ${positive ? 'text-primary-700' : 'text-red-600'}`}>
        {positive ? '' : '−'}{formatBDT(Math.round(value))}
      </p>
    </div>
  );
}
