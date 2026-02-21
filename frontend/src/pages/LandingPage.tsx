import { motion } from 'framer-motion';
import { Activity, Ruler, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate = useNavigate();
    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        featuresSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans selection:bg-accent-cyan/30">
            {/* Hero Section */}
            <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/bg3.jpg" 
                        alt="Planet Background" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* <div className="absolute inset-0 bg-linear-to-b from-[#020617]/80 via-transparent to-[#020617]" /> */}
                </div>

                {/* Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 text-center px-4"
                >
                    <h1 className="text-6xl md:text-9xl font-thin tracking-[0.2em] text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        KEPLER AI
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 font-light tracking-[0.5em] uppercase mb-12">
                        Predicting the Unknown
                    </p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3 mx-auto group cursor-pointer"
                    >
                        <span className="text-sm tracking-[0.2em] uppercase font-medium text-white">Predict</span>
                        <ArrowRight className="w-4 h-4 text-accent-cyan group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* Navigation */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-20 z-20 flex gap-12 text-sm tracking-widest"
                >
                    <button onClick={scrollToFeatures} className="hover:text-accent-cyan transition-colors duration-300">ABOUT</button>
                </motion.div>
            </div>

            {/* Features Section */}
            <div id="features" className="min-h-screen relative z-10 bg-[#020617] py-24 px-6 md:px-20">
                <div className="max-w-7xl mx-auto space-y-32">
                    
                    {/* Classification Feature */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
                                    <Activity className="w-6 h-6 text-accent-cyan" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-light tracking-wide">Exoplanet Classification</h2>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Utilizing advanced machine learning algorithms to analyze light curves and transit data. 
                                Instantly distinguish between confirmed exoplanets and false positives with high confidence.
                            </p>
                            
                            <div className="flex gap-4 text-sm text-slate-500 font-mono">
                                <div className="px-4 py-2 border border-white/10 rounded-full">Recall: 98.5%</div>
                                <div className="px-4 py-2 border border-white/10 rounded-full">Precision: 97.2%</div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-80 bg-white/5 rounded-2xl border border-white/10 p-6 overflow-hidden group hover:border-accent-cyan/30 transition-colors duration-500"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Transit Light Curve Analysis</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={lightCurveData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis hide />
                                    <YAxis hide domain={['dataMin', 'dataMax']} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)' }} 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="flux" 
                                        stroke="#06b6d4" 
                                        strokeWidth={2}
                                        fillOpacity={1} 
                                        fill="url(#colorValue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* Regression Feature */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            className="order-2 lg:order-1 relative h-80 bg-white/5 rounded-2xl border border-white/10 p-6 overflow-hidden group hover:border-purple-500/30 transition-colors duration-500"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Radius Prediction Model</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={radiusData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }}
                                    />
                                    <Bar dataKey="radius" barSize={40} radius={[4, 4, 0, 0]}>
                                        {radiusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 2 ? '#a855f7' : '#334155'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div 
                            className="order-1 lg:order-2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20">
                                    <Ruler className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-light tracking-wide">Radius Estimation</h2>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Beyond simple classification, our regression models predict the physical characteristics of confirmed planets. 
                                Estimate planetary radius with precision to identify Earth-like candidates.
                            </p>
                            
                            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 group">
                                <span className="uppercase tracking-widest text-sm text-white">Start Analysis</span>
                                <ArrowRight className="w-4 h-4 text-accent-cyan group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Mock Data for Visualizations
const lightCurveData = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    flux: 1 - (i > 20 && i < 30 ? Math.sin((i - 20) * Math.PI / 10) * 0.05 : 0) + (Math.random() * 0.002 - 0.001)
}));

const radiusData = [
    { name: 'Mars', radius: 0.53 },
    { name: 'Earth', radius: 1.00 },
    { name: 'Kepler-452b', radius: 1.63 }, // Targeted example
    { name: 'Neptune', radius: 3.88 },
];
