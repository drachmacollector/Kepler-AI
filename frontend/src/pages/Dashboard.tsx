import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputForm } from '@/components/InputForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ErrorBanner } from '@/components/ErrorBanner';
import { predict } from '@/services/api';
import { PredictionResponse } from '@/types/prediction';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePrediction = async (features: Record<string, number>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await predict(features);
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-galaxy-900 text-white font-sans selection:bg-accent-cyan/30 flex flex-col overflow-hidden">
            {/* Global background image */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src="/bg3.jpg" alt="" className="w-full h-full object-cover " />
            </div>

            {/* Floating Dock Navbar */}
            <header className="relative z-50 flex-none pt-3 pb-0 w-full flex justify-center pointer-events-none">
                <nav className="pointer-events-auto flex items-center gap-8 px-8 py-3.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg shadow-emerald-900/10">
                    <div className="flex items-center gap-4 pr-8 border-r border-white/10">
                        <img src="/3947771.png" alt="Kepler AI" className="h-8 w-8 object-contain" />
                        <span className="text-lg font-bold tracking-wider text-white">Kepler AI</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm tracking-widest uppercase font-medium">
                        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">Home</button>
                        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">About</button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 min-h-0 relative z-10">
                <div className="relative z-10 h-full max-w-[2000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                    {/* Left Panel: Input Form */}
                    <div className="lg:col-span-4 min-h-0 h-full flex flex-col">
                        <div className="bg-black/35 border backdrop-blur-xs border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-full">
                            <div className="px-5 py-3.5 border-b border-white/5 bg-white/5 flex-none">
                                <h2 className="text-sm font-bold text-slate-200 tracking-wide">Observation Parameters</h2>
                            </div>
                            <InputForm onSubmit={handlePrediction} isLoading={loading} />
                        </div>
                    </div>

                    {/* Right Panel: Results & Viz */}
                    <div className="lg:col-span-8 min-h-0 flex flex-col overflow-y-auto custom-scrollbar">
                        <ResultsPanel result={result} />
                    </div>
                </div>
            </main>

            {/* Overlays */}
            {loading && <LoadingOverlay />}
            <ErrorBanner message={error || ''} onClose={() => setError(null)} />
        </div>
    );
};
