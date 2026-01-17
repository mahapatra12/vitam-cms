import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen relative">
      {/* Background Orbs for Atmosphere */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none z-0" />
      
      <Sidebar />
      
      <main className="flex-1 ml-[340px] p-8 relative z-10 max-w-[1600px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
