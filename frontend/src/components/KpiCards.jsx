import React from 'react';

export default function KpiCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { label: 'Total Applicants', value: summary.totalApplicants },
    { label: 'Total Hired', value: summary.totalHired },
    { label: 'Avg. Time to Hire (days)', value: summary.avgTimeToHireDays },
    { label: 'Offer Acceptance Rate', value: `${summary.offerAcceptanceRatePercent}%` },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <div className="kpi-card" key={card.label}>
          <div className="kpi-value">{card.value}</div>
          <div className="kpi-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
