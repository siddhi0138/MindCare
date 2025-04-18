import { Navigate } from 'react-router-dom';
import HomePage from './HomePage';

// Redirect to the new HomePage component
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
