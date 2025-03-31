
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import Documents from "./pages/Documents";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";
import ClientManagement from "./pages/ClientManagement";
import UCIDRequests from "./pages/UCIDRequests";
import MailmarkData from "./pages/MailmarkData";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a query client
const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="app-container min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/jobs/:jobId" element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                } />
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/clients" element={
                  <ProtectedRoute requiredRole="admin">
                    <ClientManagement />
                  </ProtectedRoute>
                } />
                <Route path="/ucid-requests" element={
                  <ProtectedRoute requiredRole="admin">
                    <UCIDRequests />
                  </ProtectedRoute>
                } />
                <Route path="/mailmark-data" element={
                  <ProtectedRoute>
                    <MailmarkData />
                  </ProtectedRoute>
                } />
                <Route path="/user-profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
