
import { Navigate } from 'react-router-dom';

// Redirect to the HomePage
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
