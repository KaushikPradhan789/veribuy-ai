import React, { useState } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import { AppView, DashboardData, ProductInfo } from './types';
import { scanProductImage, scanProductUrl, checkAuthenticity, analyzeReviews, findBetterPrices } from './services/geminiService';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

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

    setDashboardData({
      product: productInfo,
      authenticity: authResult,
      reviews: reviewsResult,
      deals: dealsResult
    });

    setCurrentView(AppView.DASHBOARD);
  };

  const handleFileScan = async (file: File) => {
    setIsScanning(true);
    setCurrentView(AppView.SCANNING);

    try {
      const base64 = await fileToBase64(file);
      const productInfo = await scanProductImage(base64);
      await performAnalysis(productInfo);
    } catch (error) {
      console.error('File Scan failed', error);
      alert('Failed to analyze product image. Please try again.');
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
    } catch (error) {
      console.error('URL Scan failed', error);
      alert('Failed to analyze URL. Please check the link and try again.');
      setCurrentView(AppView.LANDING);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Layout onHomeClick={() => setCurrentView(AppView.LANDING)}>
      {currentView === AppView.LANDING || currentView === AppView.SCANNING ? (
        <Scanner onScanFile={handleFileScan} onScanUrl={handleUrlScan} isScanning={isScanning} />
      ) : (
        dashboardData && <Dashboard data={dashboardData} />
      )}

      <ChatAssistant />
    </Layout>
  );
};

export default MainApp;
