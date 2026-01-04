
import React from 'react';
/* Added Sparkles to the named imports to fix the undefined variable error */
import { ShieldCheck, AlertTriangle, CheckCircle, TrendingDown, ExternalLink, Heart, Sparkles } from './ui/Icons';
import { DashboardData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  data: DashboardData;
  onSave: (data: DashboardData) => void;
  isSaved: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onSave, isSaved }) => {
  const { product, authenticity, reviews, deals } = data;

  if (!product || !authenticity || !reviews) return null;

  const authColor = authenticity.verdict === 'Likely Genuine' ? '#10b981' : authenticity.verdict === 'Suspicious' ? '#f59e0b' : '#ef4444';
  
  const sentimentData = [
    { name: 'Positive', value: reviews.sentiment.positive, color: '#10b981' },
    { name: 'Neutral', value: reviews.sentiment.neutral, color: '#64748b' },
    { name: 'Negative', value: reviews.sentiment.negative, color: '#ef4444' },
  ];

  return (
    <div className="relative animate-fade-in w-full pb-12">
      {/* Dynamic Background */}
      {product.imageUrl && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 blur-[100px] scale-110 transform"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
        </div>
      )}

      <div className="space-y-8 relative z-10">
        {/* Header Card */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col lg:flex-row gap-8 items-start relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-accent uppercase tracking-widest">
                      {product.category}
                  </span>
                  <button 
                      onClick={() => onSave(data)}
                      className={`p-2.5 rounded-full border transition-all duration-500 hover:scale-110 ${isSaved ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'}`}
                      aria-label={isSaved ? "Remove from saved" : "Save product"}
                  >
                      <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                  </button>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{product.name}</h2>
              <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed">{product.description}</p>
              
              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                  {product.estimatedPrice}
                </span>
                <span className="text-sm text-zinc-500 font-medium">Market Average</span>
              </div>
            </div>
            
            {/* Trust Meter */}
            <div className="p-8 rounded-3xl bg-zinc-950/50 border border-white/10 min-w-[320px] backdrop-blur-md shadow-inner">
              <div className="flex items-center justify-between mb-6">
                  <span className="text-zinc-400 font-semibold tracking-wide text-sm uppercase">Authenticity Score</span>
                  <ShieldCheck className="w-6 h-6" style={{ color: authColor }} />
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black text-white">{authenticity.score}</span>
                  <span className="text-2xl text-zinc-600">/100</span>
              </div>
              <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ width: `${authenticity.score}%`, backgroundColor: authColor }}></div>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                <p className="text-lg font-bold" style={{ color: authColor }}>{authenticity.verdict}</p>
                <p className="text-xs text-zinc-500 line-clamp-2">{authenticity.reasoning}</p>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Insights Section */}
            <div className="glass-panel p-8 rounded-[2rem] lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10"><CheckCircle className="w-5 h-5 text-purple-500" /></div>
                      Review Intelligence
                  </h3>
                  <div className="text-xs font-mono text-zinc-500 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    Updated Real-time
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                  itemStyle={{ color: '#f4f4f5' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-white">Sentiment</span>
                          <span className="text-xs text-zinc-500">Distribution</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 relative group">
                            <div className="absolute -top-3 -right-3 p-2 bg-zinc-800 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                              <Sparkles className="w-4 h-4 text-accent" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Summary</span>
                            <p className="text-zinc-300 mt-3 text-sm leading-relaxed italic">"{reviews.summary}"</p>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-red-500/5 p-4 rounded-2xl border border-red-500/20">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                              <AlertTriangle size={20} className="text-red-400" />
                            </div>
                            <p className="text-sm">
                              <span className="text-red-400 font-bold">{reviews.fakeReviewCount}</span> suspected inorganic reviews filtered out.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle size={14} /> Key Strengths
                        </h4>
                        <ul className="space-y-3">
                            {reviews.pros.map((pro, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={14} /> Potential Downsides
                        </h4>
                        <ul className="space-y-3">
                            {reviews.cons.map((con, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Market Comparison Card */}
            <div className="glass-panel p-8 rounded-[2rem] flex flex-col h-full border-accent/20">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10"><TrendingDown className="w-5 h-5 text-cyan-500" /></div>
                      Price Comparison
                  </h3>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                
                <div className="space-y-4 flex-1">
                    {deals.length > 0 ? deals.map((deal, idx) => (
                        <a 
                            key={idx} 
                            href={deal.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all group"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="text-white font-bold group-hover:text-accent transition-colors text-base truncate">{deal.retailer}</h4>
                                    <p className="text-xs text-zinc-500 mt-1 truncate">{deal.title}</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-accent group-hover:text-black transition-colors">
                                  <ExternalLink size={16} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Live Offer</span>
                                <span className="text-xl font-mono font-black text-accent">{deal.price}</span>
                            </div>
                        </a>
                    )) : (
                      <div className="text-center py-12 text-zinc-500 text-sm italic">
                        No live deals found. Check back in a moment.
                      </div>
                    )}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                      <Sparkles size={24} className="text-indigo-400" />
                    </div>
                    <h4 className="text-xs font-black text-indigo-400 mb-2 uppercase tracking-[0.2em]">Strategy Engine</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
                        Based on historical price volatility for {product.brand} products, we recommend purchasing now if the price is below {product.estimatedPrice}.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
