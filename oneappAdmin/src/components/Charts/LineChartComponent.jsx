import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const LineChartComponent = ({ 
  data, 
  title, 
  revenue, 
  color = '#f97316',
  xDataKey = 'month',
  yDataKey = 'earnings'
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="md:text-xl font-semibold text-gray-800 font-poppins tracking-tight">
          {title}
        </h3>
        <div className="flex flex-col md:flex-row space-x-4 items-center font-poppins tracking-tight font-medium">
          <p className="md:text-md text-sm">{revenue}</p>
          <div className="hidden md:flex space-x-2">
            <select className="px-3 py-2 text-sm border font-poppins bg-white tracking-tight rounded-lg focus:outline-none focus:ring-2" style={{ '--tw-ring-color': color }}>
              <option value="Last Year">Last Year</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xDataKey}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "5px",
            }}
            labelStyle={{ color: "#6b7280" }}
            cursor={{ stroke: color, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey={yDataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ r: 6, fill: "#fff", stroke: color, strokeWidth: 2 }}
            activeDot={{ r: 8, fill: color, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

LineChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  revenue: PropTypes.string.isRequired,
  color: PropTypes.string,
  xDataKey: PropTypes.string,
  yDataKey: PropTypes.string
};

export default LineChartComponent;