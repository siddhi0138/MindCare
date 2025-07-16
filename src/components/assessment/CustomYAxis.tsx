import React from 'react';
import { YAxis as RechartsYAxis, YAxisProps } from 'recharts';

const CustomYAxis = ({
  width = 40,
  ...props
}: YAxisProps & { width?: number }) => {
  return <RechartsYAxis width={width} {...props} />;
};

export default CustomYAxis;
