import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, FunnelChart, Funnel, LabelList, LineChart, Line,
} from 'recharts';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import KpiCards from '../components/KpiCards';

const COLORS = ['#2563eb', '#f97316', '#10b981', '#a855f7', '#ef4444', '#eab308'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [sourceData, setSourceData] = useState([]);
  const [timeToHireData, setTimeToHireData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [summaryRes, sourceRes, timeRes, funnelRes, deptRes, monthlyRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/source-effectiveness'),
        api.get('/analytics/time-to-hire'),
        api.get('/analytics/funnel'),
        api.get('/analytics/department-hiring'),
        api.get('/analytics/monthly-trend'),
      ]);

      setSummary(summaryRes.data);
      setSourceData(sourceRes.data);
      setTimeToHireData(timeRes.data);
      setFunnelData(funnelRes.data);
      setDeptData(deptRes.data);
      setMonthlyData(
        monthlyRes.data.map((m) => ({
          ...m,
          label: `${m.month}/${m.year}`,
        }))
      );
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <KpiCards summary={summary} />

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Source-of-Hire Effectiveness</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalApplicants" fill="#93c5fd" name="Applicants" />
                    <Bar dataKey="totalHired" fill="#2563eb" name="Hired" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Avg. Time-to-Hire by Department (days)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={timeToHireData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgDaysToHire" fill="#f97316" name="Avg Days" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Recruitment Funnel</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="count" data={funnelData} isAnimationActive>
                      <LabelList position="right" dataKey="stage" fill="#374151" stroke="none" />
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Department-wise Hiring</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={deptData}
                      dataKey="totalHired"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                <h3>Monthly Hiring Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalApplicants" stroke="#93c5fd" name="Applicants" />
                    <Line type="monotone" dataKey="totalHired" stroke="#2563eb" name="Hired" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
