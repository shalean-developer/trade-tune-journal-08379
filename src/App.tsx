import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';

// Import landing page
const HavenArkCompanyLandingPage = lazy(() => import('@/pages/HavenArkCompanyLandingPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const MasterclassPage = lazy(() => import('@/pages/MasterclassPage'));
const OfflineProgramPage = lazy(() => import('@/pages/OfflineProgramPage'));
const OnlineProgramPage = lazy(() => import('@/pages/OnlineProgramPage'));
const AcademyPage = lazy(() => import('@/pages/AcademyPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));

// Haven Ark auth
const HavenArkSignupPage = lazy(() => import('@/pages/HavenArkSignupPage'));

// Booking components removed

// Feature showcase pages
const EmotionsPage = lazy(() => import('@/pages/features/EmotionsPage'));
const TradeEntryPage = lazy(() => import('@/pages/features/TradeEntryPage'));
const FeaturePlaybooksPage = lazy(() => import('@/pages/features/PlaybooksPage'));
const SmartTradeImportPage = lazy(() => import('@/pages/features/SmartTradeImportPage'));

function App() {
  const queryClient = new QueryClient();
  
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="wiggly-theme">
        <Toaster />
        <SonnerToaster richColors position="top-right" />
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>
            <Routes>
              {/* Root route - Haven ARK Company Landing Page */}
              <Route path="/" element={<HavenArkCompanyLandingPage />} />
              
              {/* Haven Ark auth routes */}
              <Route path="/haven-ark/signup" element={<HavenArkSignupPage />} />
              
              {/* Info pages */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/masterclass" element={<MasterclassPage />} />
              <Route path="/offline-program" element={<OfflineProgramPage />} />
              <Route path="/online-program" element={<OnlineProgramPage />} />
              <Route path="/academy" element={<AcademyPage />} />
              
              {/* Feature showcase pages - accessible to all users */}
              <Route path="/features/emotions" element={<EmotionsPage />} />
              <Route path="/features/trade-entry" element={<TradeEntryPage />} />
              <Route path="/features/playbooks" element={<FeaturePlaybooksPage />} />
              <Route path="/features/smart-trade-import" element={<SmartTradeImportPage />} />

              {/* Booking routes removed */}
              
              {/* Not found */}
              <Route path="/not-found" element={<NotFoundPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
