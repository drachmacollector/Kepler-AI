import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PredictionResponse } from '@/types/prediction';
import clsx from 'clsx';
import { VisualizationPanel } from '@/components/VisualizationPanel';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

interface ResultsPanelProps {
    result: PredictionResponse | null;
}

export const ResultsPanel = ({ result }: ResultsPanelProps) => {
    if (!result) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">Awaiting Analysis</h3>
                <p className="text-sm mt-2 max-w-xs">Enter stellar parameters and submit to classify the exoplanet candidate.</p>
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
                "h-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col",
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
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <h3 className="text-sm font-medium text-slate-300 mb-4">Model Confidence Analysis</h3>
                <VisualizationPanel result={result} />
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden mt-6">
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-accent-cyan/20 to-transparent" />
                <h3 className="text-sm font-medium text-slate-300 mb-4">Planet Radius Prediction</h3>

                {isConfirmed && result.radius !== undefined ? (
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={[
                                    { name: 'Earth', value: 1.0, fill: '#3b82f6' },
                                    { name: 'Planet', value: result.radius, fill: '#06b6d4' },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={60} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#fff'
                                    }}
                                    formatter={(value: any) => [`${Number(value).toFixed(2)} R⊕`, 'Radius']}
                                />
                                <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                                    <LabelList dataKey="value" position="right" fill="#fff" formatter={(val: any) => `${Number(val).toFixed(2)} R⊕`} />
                                    {
                                        [
                                            { name: 'Earth', value: 1.0, fill: '#3b82f6' },
                                            { name: 'Planet', value: result.radius, fill: '#06b6d4' },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            Predicted radius: <span className="text-accent-cyan font-mono">{result.radius.toFixed(2)}</span> Earth radii (R⊕)
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
