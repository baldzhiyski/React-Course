import Map from '../components/Map';
import SideBar from '../components/Sidebar';
import User from '../components/User';
import { useAuth } from '../context/FakeAuthContext';
import styles from './AppLayout.module.css';
function AppLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      {isAuthenticated ? <User /> : ''}
    </div>
  );
}

export default AppLayout;
