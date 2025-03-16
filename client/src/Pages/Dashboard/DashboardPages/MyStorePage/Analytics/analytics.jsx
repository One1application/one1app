import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as LucideIcons from 'lucide-react';
import { config } from './analysicsConfig';
import styles from './analytics.module.css';

const iconMap = {
  users: LucideIcons.Users,
  mousePointerClick: LucideIcons.MousePointerClick,
  clock: LucideIcons.Clock,
  timer: LucideIcons.Timer,
  moreVertical: LucideIcons.MoreVertical
};

const DonutChart = ({ data, title }) => {
    const [activeView, setActiveView] = React.useState('list');
  
    return (
      <div className={styles.donutSection}>
        <div className={styles.donutHeader}>
          <h3 className={styles.donutTitle}>{title}</h3>
          <div className={styles.toggleContainer}>
            <button 
              className={`${styles.toggleButton} ${activeView === 'list' ? styles.toggleButtonActive : ''}`}
              onClick={() => setActiveView('list')}
            >
              List
            </button>
            <button 
              className={`${styles.toggleButton} ${activeView === 'unique' ? styles.toggleButtonActive : ''}`}
              onClick={() => setActiveView('unique')}
            >
              Unique
            </button>
          </div>
        </div>
  
        <div className={styles.donutContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={450}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    strokeWidth={0}
                  />
                ))}
                {data.map((entry, index) => {
                  const radius = 95;
                  const x = Math.cos(-((entry.value / 100 * 360) / 2 + index * (360 / data.length)) * Math.PI / 180) * radius;
                  const y = Math.sin(-((entry.value / 100 * 360) / 2 + index * (360 / data.length)) * Math.PI / 180) * radius;
                  return (
                    <text
                      key={`percentage-${index}`}
                      x={x}
                      y={y}
                      fill="#666"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm"
                    >
                      {entry.percentage}
                    </text>
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
  
          <div className={styles.donutLegend}>
            {data.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <div 
                  className={styles.legendDot}
                  style={{ backgroundColor: item.color }}
                />
                <span className={styles.legendText}>{item.name}</span>
              </div>
            ))}
          </div>
  
          {data.every(item => item.value === 0) && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="font-medium text-gray-900">This is example Data!</p>
              <p className="text-gray-500">No activity in selected time range.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MetricCard = ({ iconType, label, value, iconColor }) => {
    const Icon = iconMap[iconType];
    const MoreVertical = iconMap.moreVertical;
  
    return (
      <div className={styles.metricCard}>
        <button className={styles.dotsButton}>
          <MoreVertical className="w-4 h-4" />
        </button>
        <div className={styles.metricContent}>
          <div className={styles.metricIcon}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
            {value}
          </div>
          <div className={styles.metricLabel}>{label}</div>
        </div>
      </div>
    );
  };

const AnalyticsDashboard = () => {
  const hasNoData = config.chartData.every(d => 
    d.uniqueVisits === 0 && 
    d.totalVisits === 0 && 
    d.totalClicks === 0 && 
    d.uniqueClicks === 0
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Activity</h2>
        <select className={styles.dropdown}>
          {config.timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.metricsGrid}>
        {config.metrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartLegend}>
          {config.chartLegend.map(({ color, label }) => (
            <div key={label} className={styles.legendItem}>
              <div className={`${styles.legendDot} ${color}`}></div>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={config.chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              {config.chartLegend.map(({ dataKey }) => (
                <Bar 
                  key={dataKey}
                  dataKey={dataKey}
                  fill={config.chartColors[dataKey]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DonutChart 
          data={config.referrersData} 
          title="Top Referrers" 
        />
        <DonutChart 
          data={config.devicesData} 
          title="Top Devices" 
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;