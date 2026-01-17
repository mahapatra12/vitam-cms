import React, { useState } from 'react';
import axios from 'axios';
import { 
    Search, User, TrendingUp, AlertTriangle, 
    BookOpen, CheckCircle, Loader2, Brain 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentAnalytics = () => {
    const [studentId, setStudentId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleAnalyze = async (e) => {
        e.preventDefault();
        if(!studentId) return;
        setLoading(true);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/faculty-ai/analyze-student`,
                { studentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <header className="flex items-center gap-4">
                <div className="bg-purple-600 p-3 rounded-2xl text-white shadow-lg shadow-purple-200">
                    <Brain size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI Student Insight</h1>
                    <p className="text-gray-500">Real-time risk assessment & mentoring strategies</p>
                </div>
            </header>

            {/* Input Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <form onSubmit={handleAnalyze} className="flex gap-4">
                    <div className="relative flex-1">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Enter Student ID (e.g. 64f1...)"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !studentId}
                        className="px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Analyze Risk'}
                    </button>
                </form>
            </div>

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Status Card */}
                        <div className={`col-span-1 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between ${
                            result.category === 'At Risk' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                            result.category === 'Average' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                            'bg-gradient-to-br from-emerald-400 to-green-600'
                        }`}>
                            <div>
                                <h2 className="text-lg opacity-90 font-medium">Status Assessment</h2>
                                <h1 className="text-4xl font-bold mt-2">{result.category}</h1>
                            </div>
                            <div className="mt-8 bg-white/20 backdrop-blur-md p-4 rounded-xl">
                                <h3 className="font-bold text-sm opacity-80 uppercase tracking-wide">Primary Weakness</h3>
                                <p className="text-xl font-semibold mt-1">{result.weakSubject || 'None'}</p>
                            </div>
                        </div>

                        {/* Analysis Details */}
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            
                            {/* Risk Explanation */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="flex items-center gap-2 font-bold text-gray-800 dark:text-white mb-3">
                                    <AlertTriangle className="text-orange-500" /> AI Risk Factor Analysis
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {result.riskFactor}
                                </p>
                            </div>

                            {/* Mentoring Strategy */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                                <h3 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 mb-4">
                                    <CheckCircle /> Recommended Faculty Actions
                                </h3>
                                <div className="space-y-3">
                                    {result.mentoringPlan.map((plan, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                                            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-lg shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-gray-700 dark:text-gray-300 pt-1">{plan}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentAnalytics;
