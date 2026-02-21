import { useState, useEffect } from 'react';
import { AlertCircle, Check, Copy, FileJson } from 'lucide-react';
import clsx from 'clsx';

interface JsonInputProps {
    value: Record<string, number | ''>;
    onChange: (values: Record<string, number | ''>) => void;
    onDirtyChange?: (isDirty: boolean) => void;
}

export const JsonInput = ({ value, onChange, onDirtyChange }: JsonInputProps) => {
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Initialize text from props when mounting or when switching back to this view
    useEffect(() => {
        // Filter out empty values for cleaner JSON
        const cleanValues = Object.entries(value).reduce((acc, [key, val]) => {
            if (val !== '') acc[key] = val;
            return acc;
        }, {} as Record<string, any>);
        
        const initialText = JSON.stringify(cleanValues, null, 2);
        setText(initialText);
        if (onDirtyChange) onDirtyChange(false);
    }, []);

    const handleTextChange = (newText: string) => {
        setText(newText);
        if (onDirtyChange) onDirtyChange(true);
        
        try {
            if (!newText.trim()) {
                setError(null);
                return;
            }

            const parsed = JSON.parse(newText);
            
            // Basic validation - check if it's an object
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                setError('Input must be a JSON object');
                return;
            }

            // Validate values are numbers
            const invalidKeys = Object.entries(parsed).filter(([_, val]) => typeof val !== 'number');
            if (invalidKeys.length > 0) {
                setError(`Values must be numbers. Invalid keys: ${invalidKeys.map(k => k[0]).join(', ')}`);
                return;
            }

            setError(null);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const handleApply = () => {
        try {
            const parsed = JSON.parse(text);
            // Merge with existing structure to ensure type safety if needed, 
            // though here we just trust the parsed object after validation
            onChange(parsed);
            if (onDirtyChange) onDirtyChange(false);
        } catch (e) {
            // Should be caught by handleTextChange, but safety net
            setError("Invalid JSON");
        }
    };

    return (
        <div className="flex flex-col h-full gap-4 relative">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-accent-cyan" />
                    JSON Structure
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(text);
                        }}
                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative flex-1 ">
                <textarea
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className={clsx(
                        "w-full h-full bg-slate-900/50 border rounded-lg p-4 font-mono text-sm leading-relaxed outline-none resize-none transition-all duration-300",
                        "focus:bg-slate-900/80 focus:shadow-[0_0_15px_rgba(0,221,235,0.1)]",
                        error
                            ? "border-red-500/50 focus:border-red-500 text-red-100"
                            : "border-white/10 focus:border-accent-cyan/50 text-slate-200"
                    )}
                    spellCheck={false}
                    placeholder={` Paste your JSON string here. For example 
{ 
  "koi_period": 2.525591777,
  "koi_duration": 1.6545,
  "koi_depth": 603.3,
  "koi_impact": 0.701,
  "koi_model_snr": 40.9,
  ......
}`}                
                    />
                
                {error && (
                    <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 backdrop-blur-sm">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-red-300 font-mono">{error}</span>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    onClick={handleApply}
                    disabled={!!error || !text.trim()}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300",
                        !error && text.trim()
                            ? "bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/20"
                            : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                    )}
                >
                    <Check className="w-4 h-4" />
                    Apply Changes
                </button>
            </div>
        </div>
    );
};
