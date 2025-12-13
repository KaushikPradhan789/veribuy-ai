import React from 'react';

export const ResponsiveContainer: React.FC<any> = ({ width = '100%', height = '100%', children }) => (
  <div style={{ width, height, minHeight: 100 }}>{children}</div>
);

export const PieChart: React.FC<any> = ({ children }) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">{children}</svg>
);

export const Pie: React.FC<any> = ({ children }) => (
  <g>{children}</g>
);

export const Cell: React.FC<any> = ({ fill = '#000', ...rest }) => (
  <path d="" fill={fill} {...rest} />
);

export const Tooltip: React.FC<any> = () => null;

export const PieTooltip = Tooltip;

export const BarChart: React.FC<any> = ({ children }) => <div>{children}</div>;
export const Bar: React.FC<any> = ({ children }) => <div>{children}</div>;
export const XAxis: React.FC<any> = () => null;

export default { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis };
