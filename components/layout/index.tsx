import HeaderPage from "./header";
import AsiderPage from "./asider";
interface layoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: layoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <HeaderPage />
      <div className="flex flex-1 overflow-hidden">
        <AsiderPage />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
