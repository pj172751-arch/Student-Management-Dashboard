import { useState, useEffect } from 'react';
import { UsersIcon, AwardIcon, CheckCircleIcon, TrophyIcon } from './Icons';

function AnimatedCounter({ end, duration = 1200, isDecimal = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startVal = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (end - startVal) * eased;
      setCount(isDecimal ? parseFloat(current.toFixed(2)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration, isDecimal]);

  return <span>{isDecimal ? count.toFixed(2) : count}</span>;
}

function StatsPanel({ students }) {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const avgGpa = students.length > 0
    ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length)
    : 0;
  const topPerformers = students.filter(s => s.gpa >= 3.5).length;
  const activeRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  const stats = [
    {
      id: 'stat-total-students',
      label: 'Total Enrollment',
      value: totalStudents,
      isDecimal: false,
      icon: UsersIcon,
      accentColor: 'var(--primary)',
      trend: '+12% this academic term',
      badge: 'All Programs'
    },
    {
      id: 'stat-avg-gpa',
      label: 'Cumulative GPA Average',
      value: avgGpa,
      isDecimal: true,
      icon: AwardIcon,
      accentColor: 'var(--cyan)',
      trend: 'Scale: 4.0 Max',
      badge: 'Institution Mean'
    },
    {
      id: 'stat-active-students',
      label: 'Active Standing',
      value: activeStudents,
      isDecimal: false,
      icon: CheckCircleIcon,
      accentColor: 'var(--emerald)',
      trend: `${activeRate}% overall retention`,
      badge: 'Enrolled'
    },
    {
      id: 'stat-top-performers',
      label: "Dean's List Honors",
      value: topPerformers,
      isDecimal: false,
      icon: TrophyIcon,
      accentColor: 'var(--amber)',
      trend: 'GPA 3.50 or higher',
      badge: 'High Honors'
    }
  ];

  return (
    <section className="stats-panel-section" id="stats-panel">
      <div className="stats-grid">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.id}
              id={stat.id}
              className="stat-kpi-card"
              style={{ '--card-accent': stat.accentColor }}
            >
              <div className="stat-kpi-header">
                <span className="stat-kpi-label">{stat.label}</span>
                <div className="stat-kpi-icon-wrap">
                  <IconComponent size={18} />
                </div>
              </div>

              <div className="stat-kpi-value-row">
                <span className="stat-kpi-value">
                  <AnimatedCounter end={stat.value} isDecimal={stat.isDecimal} />
                </span>
                <span className="stat-kpi-badge">{stat.badge}</span>
              </div>

              <div className="stat-kpi-footer">
                <span className="stat-kpi-trend">{stat.trend}</span>
              </div>

              
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsPanel;