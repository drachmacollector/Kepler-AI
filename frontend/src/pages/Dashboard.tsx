import { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ErrorBanner } from '@/components/ErrorBanner';
import { predict } from '@/services/api';
import { PredictionResponse } from '@/types/prediction';
import { Sparkles, Activity } from 'lucide-react';

export const Dashboard = () => {
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
        <div className="min-h-screen bg-galaxy-900 text-white font-sans selection:bg-accent-cyan/30 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-8 py-5 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/20">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Kepler AI
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                            Exoplanet Classification & Prediction System
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <Activity className="w-3 h-3 text-green-400" />
                        SYSTEM ONLINE
                    </div>
                    <span>v2.4.0-RC1</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-purple/20 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-accent-cyan/10 blur-[120px]" />
                </div>

                <div className="relative z-10 h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
                    {/* Left Panel: Input Form */}
                    <div className="lg:col-span-4 h-full flex flex-col">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl h-full overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-white/5 bg-white/5">
                                <h2 className="text-sm font-semibold text-slate-300">Observation Parameters</h2>
                            </div>
                            <InputForm onSubmit={handlePrediction} isLoading={loading} />
                        </div>
                    </div>

                    {/* Right Panel: Results & Viz */}
                    <div className="lg:col-span-8 h-full flex flex-col">
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
