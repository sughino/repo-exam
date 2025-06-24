import { ThemeProvider } from 'styled-components';
import { Theme } from './components/Variables';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataLayout } from './pages/DataLayout';
import Particles from './components/Particles';
import { SWRConfig } from 'swr';
import { ErrorPage } from './pages/ErrorPage';
import { fetcher } from './api/api.js';
import { ProtectedRoute } from './utils/ProtectedRoute';
import authServices from './services/authServices.js';
import { useEffect, Suspense  } from 'react';
import { useRoutes } from './context/RoutesContext.jsx';

function App() {
  const { fetchUser } = authServices.useMe();
  const routes = useRoutes();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SWRConfig value={{ fetcher }}>
      <ThemeProvider theme={Theme}>
        <Particles
          particleColors={[Theme.colors.primary, Theme.colors.primary]}
          particleCount={300}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={200}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />

        <BrowserRouter>
          <Routes>
            {routes
              .filter(r => r.visibleTo.includes('guest') || r.name === 'userProfile')
              .map(r => (
                <Route
                  key={r.name}
                  path={r.path}
                  element={
                    <Suspense fallback={r.loader}>
                      <r.component />
                    </Suspense>
                  }
                />
              ))
            }

            <Route element={<DataLayout />}>
              <Route element={<ProtectedRoute />}>
                {routes
                  .filter(r => (r.visibleTo.includes('user') || r.visibleTo.includes('admin') && r.name !== 'userProfile'))
                  .map(r => (
                    <Route
                      key={r.name}
                      path={r.path}
                      element={
                        <Suspense fallback={r.loader}>
                          <r.component />
                        </Suspense>
                      }
                    />
                  ))
                }
              </Route>

              <Route element={<ProtectedRoute adminOnly={true} />}>
                {routes
                  .filter(r => r.visibleTo.includes('admin') && !r.visibleTo.includes('user'))
                  .map(r => (
                    <Route
                      key={r.name}
                      path={r.path}
                      element={
                        <Suspense fallback={r.loader}>
                          <r.component />
                        </Suspense>
                      }
                    />
                  ))
                }
              </Route>
            </Route>

            <Route path="*" element={<ErrorPage />} />
            
          </Routes>
        </BrowserRouter>

      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;