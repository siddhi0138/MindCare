
import { PropsWithChildren } from 'react';
import Header from './Header';
import Footer from './Footer';
import EmergencySOS from '../common/EmergencySOS';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <EmergencySOS />
      <Footer />
    </div>
  );
};

export default MainLayout;
