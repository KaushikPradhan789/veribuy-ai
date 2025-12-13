import React, { useState, useRef } from 'react';
import { Upload, Scan, Loader2, LinkIcon as Link } from '../ui/Icons';

interface ScannerProps {
  onScanFile: (file: File) => void;
  onScanUrl: (url: string) => void;
  isScanning: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onScanFile, onScanUrl, isScanning }) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onScanFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onScanFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onScanUrl(urlInput.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-fade-in-up">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Verify. <span className="gradient-text">Optimize.</span> Buy.
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl">
          AI-powered authenticity checks, review intelligence, and smart price comparison.
        </p>
      </div>

      {isScanning ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
           <div className="relative">
              <div className="absolute inset-0 bg-accent blur-2xl opacity-20 animate-pulse"></div>
              <Loader2 className="w-20 h-20 text-accent animate-spin-slow relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl text-white font-medium animate-pulse">Analyzing Asset...</p>
              <p className="text-sm text-zinc-500">Retrieving market data & verifying details</p>
            </div>
        </div>
      ) : (
        <div className="w-full max-w-xl space-y-8">
          {/* File Upload Area */}
          <div 
            className={`
              relative w-full aspect-[2/1] rounded-3xl border-2 border-dashed 
              flex flex-col items-center justify-center cursor-pointer transition-all duration-300
              ${dragActive ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*"
            />
            
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/50">
                <Scan className="w-8 h-8 text-zinc-300 group-hover:text-white" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-medium text-white">Upload Product Image</p>
                <p className="text-sm text-zinc-500">Drag & drop or click to browse</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="h-[1px] bg-zinc-800 flex-1"></div>
            <span className="text-zinc-500 text-sm font-medium">OR</span>
            <div className="h-[1px] bg-zinc-800 flex-1"></div>
          </div>

          {/* URL Input */}
          <form onSubmit={handleUrlSubmit} className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-1 rounded-full blur transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-zinc-900 border border-zinc-700 rounded-full p-1 focus-within:border-zinc-500 transition-colors">
              <div className="pl-4 pr-2 text-zinc-500">
                <Link size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Paste product URL or name..." 
                className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 focus:outline-none py-3 px-2 text-base"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!urlInput.trim()}
                className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Scan <Scan size={16} />
              </button>
            </div>
          </form>

        </div>
      )}

      {!isScanning && (
        <div className="flex gap-6 text-sm text-zinc-500">
          <span className="flex items-center gap-2"><Scan size={14} /> Auto-Identification</span>
          <span className="flex items-center gap-2"><Upload size={14} /> Instant Analysis</span>
          <span className="flex items-center gap-2"><Link size={14} /> Universal Link Support</span>
        </div>
      )}
    </div>
  );
};

export default Scanner;