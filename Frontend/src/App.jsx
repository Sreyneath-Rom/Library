import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Categories from './pages/Categories';
import MyBooks from './pages/MyBooks';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => (
  <AuthProvider>
    <Navigation />
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/category/:category" element={<Browse />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  </AuthProvider>
);

export default App;