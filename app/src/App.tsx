import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="container mx-auto max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}