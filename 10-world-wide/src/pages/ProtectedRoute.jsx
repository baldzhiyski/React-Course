import { useEffect } from 'react';
import { useAuth } from '../context/FakeAuthContext';
import { useNavigate } from 'react-router';
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate('/');
    },
    [isAuthenticated, navigate]
  );

  return children;
}

export default ProtectedRoute;
