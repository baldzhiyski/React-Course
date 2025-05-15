import { NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';
import Logo from './Logo';
import { useAuth } from '../context/FakeAuthContext';
import Button from './Button';
function PageNav() {
  const { isAuthenticated, user } = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>

        {isAuthenticated ? (
          <li>
            <Button type="primary">Log Out</Button>
          </li>
        ) : (
          <li>
            <NavLink className={styles.ctaLink} to="/login">
              Log In
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
