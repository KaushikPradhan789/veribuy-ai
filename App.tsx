
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import ProductList from './components/ProductList';
import { AppView, DashboardData, ProductInfo } from './types';
import { scanProductImage, scanProductUrl, checkAuthenticity, analyzeReviews, findBetterPrices } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Persistence States
  const [history, setHistory] = useState<DashboardData[]>([]);
  const [savedItems, setSavedItems] = useState<DashboardData[]>([]);

  // Initialize persistence on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('veribuy_history');
      const savedBookmarks = localStorage.getItem('veribuy_saved');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedBookmarks) setSavedItems(JSON.parse(savedBookmarks));
    } catch (e) {
      console.error("Failed to load persistence", e);
    }
  }, []);

  // Save helpers
  const updateHistory = (newItem: DashboardData) => {
    const newHistory = [newItem, ...history].slice(0, 20); // Keep max 20
    setHistory(newHistory);
    localStorage.setItem('veribuy_history', JSON.stringify(newHistory));
  };

  const toggleSaveItem = (item: DashboardData) => {
    const exists = savedItems.find(i => i.id === item.id);
    let newSaved;
    if (exists) {
        newSaved = savedItems.filter(i => i.id !== item.id);
    } else {
        newSaved = [item, ...savedItems];
    }
    setSavedItems(newSaved);
    localStorage.setItem('veribuy_saved', JSON.stringify(newSaved));
  };

  const deleteFromHistory = (id: string) => {
     const newHistory = history.filter(i => i.id !== id);
     setHistory(newHistory);
     localStorage.setItem('veribuy_history', JSON.stringify(newHistory));
  };

  // Convert File to Base64 helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const performAnalysis = async (productInfo: ProductInfo) => {
    const [authResult, reviewsResult, dealsResult] = await Promise.all([
      checkAuthenticity(productInfo),
      analyzeReviews(productInfo.name),
      findBetterPrices(productInfo.name)
    ]);

    const newData: DashboardData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      product: productInfo,
      authenticity: authResult,
      reviews: reviewsResult,
      deals: dealsResult
    };

    setDashboardData(newData);
    updateHistory(newData);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleFileScan = async (file: File) => {
    setIsScanning(true);
    setCurrentView(AppView.SCANNING);

    try {
      const base64 = await fileToBase64(file);
      const productInfo = await scanProductImage(base64);
      productInfo.imageUrl = `data:image/jpeg;base64,${base64}`;
      await performAnalysis(productInfo);
    } catch (error: any) {
      console.error("File Scan failed", error);
      alert("Analysis failed. Please try again with a different image.");
      setCurrentView(AppView.LANDING);
    } finally {
      setIsScanning(false);
    }
  };

  const handleUrlScan = async (url: string) => {
    setIsScanning(true);
    setCurrentView(AppView.SCANNING);

    try {
      const productInfo = await scanProductUrl(url);
      await performAnalysis(productInfo);
    } catch (error: any) {
      console.error("URL Scan failed", error);
      alert("Failed to analyze product from that URL. Please try searching for the product name instead.");
      setCurrentView(AppView.LANDING);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectHistoryItem = (item: DashboardData) => {
      setDashboardData(item);
      setCurrentView(AppView.DASHBOARD);
  };

  const isCurrentItemSaved = dashboardData 
    ? savedItems.some(i => i.id === dashboardData.id) 
    : false;

  const renderContent = () => {
    switch(currentView) {
        case AppView.LANDING:
        case AppView.SCANNING:
            return <Scanner onScanFile={handleFileScan} onScanUrl={handleUrlScan} isScanning={isScanning} />;
        
        case AppView.DASHBOARD:
            return dashboardData && (
                <Dashboard 
                    data={dashboardData} 
                    onSave={toggleSaveItem} 
                    isSaved={isCurrentItemSaved}
                />
            );
        
        case AppView.HISTORY:
            return (
                <ProductList 
                    title="History" 
                    items={history} 
                    onSelect={handleSelectHistoryItem}
                    onDelete={deleteFromHistory}
                    emptyMessage="No products scanned yet. Try the scanner!"
                />
            );

        case AppView.SAVED:
            return (
                <ProductList 
                    title="Saved Items" 
                    items={savedItems} 
                    onSelect={handleSelectHistoryItem}
                    onDelete={(id) => {
                        const item = savedItems.find(i => i.id === id);
                        if (item) toggleSaveItem(item);
                    }}
                    emptyMessage="No saved items found. Bookmark products to see them here."
                />
            );
        default:
            return null;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      <div className="animate-in fade-in duration-700">
        {renderContent()}
      </div>
      <ChatAssistant />
    </Layout>
  );
};

export default App;
