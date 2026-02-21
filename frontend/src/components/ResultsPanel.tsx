import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PredictionResponse } from '@/types/prediction';
import clsx from 'clsx';
import { VisualizationPanel } from '@/components/VisualizationPanel';
// import {
//     ResponsiveContainer,
//     ScatterChart,
//     Scatter,
//     CartesianGrid,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Cell
// } from 'recharts';

interface ResultsPanelProps {
    result: PredictionResponse | null;
}

export const ResultsPanel = ({ result }: ResultsPanelProps) => {
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center text-slate-500 p-16 text-center bg-black/20  rounded-2xl border border-white/5 min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 opacity-90" />
                </div>
                <h3 className="text-lg font-medium text-slate-200">Awaiting Analysis</h3>
                <p className="text-sm mt-2 max-w-xs">Enter stellar parameters & submit to classify the exoplanet candidate & predict radius.</p>
            </div>
        );
    }

    const isConfirmed = result.label === 'CONFIRMED';
    const isCandidate = result.label === 'CANDIDATE';

    const statusColor = isConfirmed ? 'text-accent-cyan' : isCandidate ? 'text-amber-400' : 'text-red-500';
    const glowColor = isConfirmed ? 'shadow-accent-cyan/20' : isCandidate ? 'shadow-amber-400/20' : 'shadow-red-500/20';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={clsx(
                "p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col",
                glowColor
            )}
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-sm text-slate-400 uppercase tracking-widest">Classification Result</h2>
                    <div className="flex items-center gap-3 mt-2">
                        {isConfirmed ? (
                            <CheckCircle className="w-8 h-8 text-accent-cyan" />
                        ) : isCandidate ? (
                            <AlertCircle className="w-8 h-8 text-amber-400" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-500" />
                        )}
                        <span className={clsx("text-3xl font-bold tracking-tight", statusColor)}>
                            {result.label}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400">Confidence</div>
                    <div className="text-2xl font-mono text-white">{(result.probability * 100).toFixed(1)}%</div>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-white/20 to-transparent" />
                <h3 className="text-sm font-medium text-slate-300 mb-4">Model Confidence Analysis</h3>
                <VisualizationPanel result={result} />
            </div>

                {/* Planet Radius Prediction & Visualizer */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden mt-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-accent-cyan/20 to-transparent" />
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="text-sm font-medium text-slate-300">Planet Radius Prediction</h3>
                         {isConfirmed && result.radius !== undefined && (
                             <div className="text-right">
                                <span className="text-3xl font-bold text-accent-cyan tracking-tight">{result.radius.toFixed(2)}</span>
                                <span className="text-sm text-slate-500 ml-1">R⊕</span>
                             </div>
                         )}
                    </div>

                    {isConfirmed && result.radius !== undefined ? (
                        <div className="flex flex-col items-center">
                            {/* Visual Size Comparison */}
                            <div className="relative h-48 w-full flex items-center justify-center gap-12 my-4">
                                {/* Earth */}
                                <div className="flex flex-col items-center gap-3 group">
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center text-xs font-bold text-white z-10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-transparent" />
                                            Earth
                                        </div>
                                        <div className="absolute -inset-4 border border-dashed border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">1.00 R⊕</span>
                                </div>

                                {/* Comparison Line */}
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent max-w-[100px]" />

                                {/* Candidate Planet */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative flex items-center justify-center">
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                            style={{ 
                                                width: `${Math.min(180, Math.max(24, 64 * result.radius))}px`, 
                                                height: `${Math.min(180, Math.max(24, 64 * result.radius))}px` 
                                            }}
                                            className="rounded-full bg-accent-cyan shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center text-xs font-bold text-slate-900 border-2 border-white/20 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent" />
                                            Target
                                        </motion.div>
                                    </div>
                                    <span className="text-xs text-accent-cyan font-mono font-bold">{result.radius.toFixed(2)} R⊕</span>
                                </div>
                            </div>
                            <p className="text-s text-slate-400 mt-2 text-center max-w-m">
                                The candidate planet is approximately <span className="text-white font-medium">{result.radius.toFixed(1)}x</span> the size of Earth.
                            </p>
                        </div>
                    ) : (
                        <div className="h-24 flex items-center justify-center text-slate-500 text-sm italic border border-dashed border-white/10 rounded-lg">
                            Radius prediction is meaningful only for confirmed exoplanets.
                        </div>
                    )}
                </div>

            <div className="mt-auto items-end flex justify-between text-[10px] text-slate-600 font-mono">
                <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                <span>{new Date(result.timestamp).toLocaleString()}</span>
            </div>
        </motion.div>
    );
};
