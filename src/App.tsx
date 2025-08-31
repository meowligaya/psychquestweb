import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅ Make sure this file exists
import LocalServices from "./pages/LocalServices";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import LessonViewer from "./pages/LessonViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Landing Page */}
          <Route path="/" element={<Login />} />

          {/* ✅ Signup Page */}
          <Route path="/signup" element={<Signup />} />

          <Route path="/local-services" element={<LocalServices />} />

          <Route path="/index" element={<Index />} />

          <Route path="/lesson/:lessonName" element={<LessonViewer />} />

          {/* ✅ Catch-All for invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
