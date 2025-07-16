import React from 'react';
import { XAxis as RechartsXAxis, XAxisProps } from 'recharts';

const CustomXAxis = ({
  width = 60,
  ...props
}: XAxisProps & { width?: number }) => {
  return <RechartsXAxis width={width} {...props} />;
};

export default CustomXAxis;
