import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, TrendingDown, ExternalLink } from '../ui/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from '../lib/recharts';

interface DashboardProps {
    data: any;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { product, authenticity, reviews, deals } = data;

  if (!product || !authenticity || !reviews) return null;

  const authColor = authenticity.verdict === 'Likely Genuine' ? '#10b981' : authenticity.verdict === 'Suspicious' ? '#f59e0b' : '#ef4444';
  
  const sentimentData = [
    { name: 'Positive', value: reviews.sentiment.positive, color: '#10b981' },
    { name: 'Neutral', value: reviews.sentiment.neutral, color: '#64748b' },
    { name: 'Negative', value: reviews.sentiment.negative, color: '#ef4444' },
  ];

    return (
        <div className="space-y-6 animate-fade-in">
      {/* Top Section: Product Header */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400">
            {product.category}
          </div>
          <h2 className="text-3xl font-bold text-white">{product.name}</h2>
          <p className="text-zinc-400">{product.description}</p>
          <div className="text-2xl font-semibold text-accent mt-2">{product.estimatedPrice} <span className="text-sm text-zinc-500 font-normal">est. market value</span></div>
        </div>
        
        {/* Authenticity Badge */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 font-medium">Authenticity Score</span>
            <ShieldCheck className="w-5 h-5" style={{ color: authColor }} />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold text-white">{authenticity.score}</span>
            <span className="text-xl text-zinc-500 mb-1">/100</span>
          </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${authenticity.score}%`, backgroundColor: authColor }} />
                    </div>
          <p className="mt-3 text-sm font-medium" style={{ color: authColor }}>{authenticity.verdict}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Review Intelligence */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-2">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" /> Review Intelligence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {sentimentData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs text-zinc-400 mt-2">
                        {sentimentData.map((item: any) => (
                            <span key={item.name} className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{background: item.color}}></span> {item.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Analysis Summary</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed">{reviews.summary}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertTriangle size={16} />
                        <span>Detected <strong>{reviews.fakeReviewCount}</strong> potentially fake reviews.</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-2">Pros</h4>
                    <ul className="space-y-2">
                        {reviews.pros.map((pro: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                <span className="text-green-500 mt-1">●</span> {pro}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-2">Cons</h4>
                    <ul className="space-y-2">
                        {reviews.cons.map((con: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                <span className="text-red-500 mt-1">●</span> {con}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Price Comparison */}
        <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-cyan-500" /> Price Watch
            </h3>
            
            <div className="space-y-3">
                {deals.map((deal: any, idx: number) => (
                    <a 
                        key={idx} 
                        href={deal.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-white font-medium group-hover:text-accent transition-colors text-sm line-clamp-1">{deal.retailer}</h4>
                                <p className="text-xs text-zinc-500 mt-1 w-full truncate max-w-[150px]">{deal.title}</p>
                            </div>
                            <ExternalLink size={14} className="text-zinc-600 group-hover:text-white" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                             <span className="text-xs text-zinc-400">View Deal</span>
                             <span className="font-mono text-accent">{deal.price}</span>
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20">
                <h4 className="text-sm font-bold text-indigo-300 mb-1">AI Recommendation</h4>
                <p className="text-xs text-indigo-200/80">
                    Wait for a seasonal sale if looking for a 15% discount, otherwise the current price at the top retailer is fair.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;