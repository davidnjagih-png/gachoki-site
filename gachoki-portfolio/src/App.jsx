import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ContentProvider from "./lib/ContentProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Career from "./pages/Career";
import Vision from "./pages/Vision";
import Press from "./pages/Press";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// The admin area is a separate chunk: visitors never download it.
const Admin = lazy(() => import("./pages/admin/Admin"));

function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="career" element={<Career />} />
          <Route path="vision" element={<Vision />} />
          <Route path="press" element={<Press />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/*" element={<Suspense fallback={<p className="admin-loading">Loading...</p>}><Admin /></Suspense>} />
      </Routes>
    </ContentProvider>
  );
}

export default App;
