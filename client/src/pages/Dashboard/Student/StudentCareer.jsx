import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Briefcase, AlertTriangle, CheckCircle, 
  Brain, Target, ArrowRight, Loader2, Award 
} from 'lucide-react';
import api from '../../utils/api';

const StudentCareer = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const response = await api.get('/career/guidance');
        setAnalysis(response.data);
      } catch (error) {
        console.error("Failed to load career guidance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Analyzing your profile...</h2>
        <p className="text-gray-500">Our AI is reviewing your academic performance.</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Analysis Failed</h2>
        <p className="text-gray-600">Could not generate report. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Briefcase className="text-blue-600" size={32} />
            AI Career Guidance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Personalized career roadmap based on your academic performance
          </p>
        </div>
      </div>

      {/* Hero Section: Readiness Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award size={120} />
          </div>
          <h3 className="text-lg font-medium opacity-90 mb-2">Job Readiness Score</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold">{analysis.readinessScore}</span>
            <span className="text-2xl opacity-75">/100</span>
          </div>
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${analysis.readinessScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-white h-2 rounded-full" 
            />
          </div>
          <p className="mt-4 text-sm opacity-90">
            {analysis.readinessScore > 75 
              ? "🚀 You are in good shape! Focus on internships." 
              : "⚠️ You have some gaps to fill. See the action plan below."}
          </p>
        </motion.div>

        {/* Suggested Roles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Target className="text-purple-500" />
            Recommended Career Paths
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {analysis.suggestedRoles.map((role, idx) => (
              <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors">
                  {role}
                </h4>
                <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Roadmap <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths & Weaknesses */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="text-blue-500" />
            Skill Analysis
            </h3>

            <div className="space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                <CheckCircle size={16} /> Key Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                {analysis.strengths.map((str, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full border border-green-100 dark:border-green-800">
                    {str}
                    </span>
                ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-red-500 dark:text-red-400 mb-2 flex items-center gap-2">
                <TrendingUp size={16} /> Areas for Improvement
                </h4>
                <div className="flex flex-wrap gap-2">
                {analysis.weaknesses.map((weak, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-full border border-red-100 dark:border-red-800">
                    {weak}
                    </span>
                ))}
                </div>
            </div>
            </div>
        </motion.div>

        {/* Action Plan */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col"
        >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Strategic Action Plan
            </h3>

            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800 mb-6">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 text-sm mb-1"> identified Skill Gap:</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                    {analysis.skillGap}
                </p>
            </div>

            <div className="space-y-3 flex-1">
                {analysis.actionPlan.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs flex-shrink-0 mt-0.5">
                            {idx + 1}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{action}</p>
                    </div>
                ))}
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default StudentCareer;
