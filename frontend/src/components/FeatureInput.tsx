import { AlertCircle } from 'lucide-react';
import { FeatureConfig } from '@/types/prediction';
import clsx from 'clsx';

interface FeatureInputProps {
    config: FeatureConfig;
    value: number | '';
    onChange: (value: number | '') => void;
    error?: string;
}

export const FeatureInput = ({ config, value, onChange, error }: FeatureInputProps) => {
    return (
        <div className="flex flex-col gap-1.5 group">
            <div className="flex justify-between items-baseline">
                <label className="text-xs font-medium text-slate-200 group-hover:text-accent-cyan transition-colors duration-300">
                    {config.label}
                </label>
                {/* <span className="text-[10px] text-slate-600 px-1 border border-slate-800 rounded">
          {config.id}
        </span> */}
            </div>

            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? '' : parseFloat(val));
                    }}
                    placeholder={`${config.min} - ${config.max}`}
                    className={clsx(
                        "w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all duration-300 placeholder:text-slate-700",
                        "focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,221,235,0.1)]",
                        error
                            ? "border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                            : "border-white/10 focus:border-accent-cyan/50 hover:border-white/20"
                    )}
                />
                {error && (
                    <div className="absolute right-3 top-2.5 text-red-400 animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                )}
            </div>

            {error ? (
                <span className="text-[10px] text-red-400 ml-1">{error}</span>
            ) : (
                <span className="text-[10px] text-slate-400 ml-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {config.description}
                </span>
            )}
        </div>
    );
};
