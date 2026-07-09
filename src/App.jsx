import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Home from '@/pages/Home';
import AdminLogin from '@/pages/admin/AdminLogin';
import Admin from '@/pages/admin/Admin';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { AdminAuthProvider } from '@/lib/AdminAuthContext';

function App() {

  return (
    <AuthProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </QueryClientProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App