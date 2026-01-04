import React from 'react';
import { Clock, ShieldCheck, ChevronRight, Calendar, Trash2 } from './ui/Icons';
import { DashboardData } from '../types';

interface ProductListProps {
  title: string;
  items: DashboardData[];
  onSelect: (item: DashboardData) => void;
  onDelete?: (id: string) => void;
  emptyMessage: string;
}

const ProductList: React.FC<ProductListProps> = ({ title, items, onSelect, onDelete, emptyMessage }) => {
  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        {title === 'History' ? <Clock className="text-zinc-500" /> : <ShieldCheck className="text-accent" />}
        {title}
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            if (!item.product || !item.authenticity) return null;
            
            const authColor = item.authenticity.verdict === 'Likely Genuine' ? 'text-green-500' : item.authenticity.verdict === 'Suspicious' ? 'text-amber-500' : 'text-red-500';
            const date = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Unknown Date';

            return (
              <div 
                key={item.id}
                className="group relative glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:bg-white/5 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wide">
                        {item.product.category}
                       </span>
                       <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <Calendar size={10} /> {date}
                       </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors line-clamp-1">{item.product.name}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-1">{item.product.brand}</p>
                  </div>
                  
                  {onDelete && item.id && (
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id!);
                        }}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors z-10"
                     >
                        <Trash2 size={16} />
                     </button>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className={authColor} />
                        <span className={`text-sm font-medium ${authColor}`}>
                            {item.authenticity.score}/100
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-white transition-colors">
                        View Details <ChevronRight size={14} />
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;