import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Approach from './pages/Approach.tsx';
import Guardrails from './pages/Guardrails.tsx';
import Training from './pages/Training.tsx';
import ToolEvaluation from './pages/ToolEvaluation.tsx';
import CaseStudy from './pages/CaseStudy.tsx';
import PlaywrightPoc from './pages/PlaywrightPoc.tsx';
import About from './pages/About.tsx';
import DemoLayout from './demo/DemoLayout.tsx';
import DemoLogin from './demo/DemoLogin.tsx';
import DemoDashboard from './demo/DemoDashboard.tsx';
import DemoRegister from './demo/DemoRegister.tsx';
import DemoRequests from './demo/DemoRequests.tsx';

function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-24">
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-[0.9375rem] text-ink-soft">
        That page does not exist in this playbook.
      </p>
      <Link to="/" className="mt-6 inline-block text-sm text-accent hover:underline">
        Back to the start
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/guardrails" element={<Guardrails />} />
        <Route path="/training" element={<Training />} />
        <Route path="/tool-evaluation" element={<ToolEvaluation />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/playwright-poc" element={<PlaywrightPoc />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/demo" element={<DemoLayout />}>
        <Route index element={<Navigate to="/demo/login" replace />} />
        <Route path="login" element={<DemoLogin />} />
        <Route path="dashboard" element={<DemoDashboard />} />
        <Route path="register" element={<DemoRegister />} />
        <Route path="requests" element={<DemoRequests />} />
      </Route>
    </Routes>
  );
}
