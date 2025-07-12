import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';

/**
 * 🚀 Composant principal de l'application
 *
 * - Utilise un layout global qui inclut l'en-tête (`Header`)
 * - Entoure l'ensemble avec un `ErrorBoundary` pour capturer les erreurs runtime
 *
 * Structure :
 * <ErrorBoundary>
 *   <Layout>
 *     <AppRoutes />
 *   </Layout>
 * </ErrorBoundary>
 */
const App = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <AppRoutes />
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
