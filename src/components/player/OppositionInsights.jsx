'use client';

import { FiInfo } from 'react-icons/fi';
import Link from 'next/link';

export default function OppositionInsights({ playerId }) {
  return (
    <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FiInfo className="text-amber-600" />
        Opposition Insights
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Get detailed dossiers on upcoming opponents with AI-powered analysis
      </p>
      <Link href="/head-to-head" className="btn-primary w-full text-center block">
        View Insights
      </Link>
    </div>
  );
}
