import { Outlet } from "react-router-dom";
import styles from "./styles/Layout.module.css";
import { useAuth } from "./AuthContext";
import { useNavigation } from './hooks/Navigation.jsx';

function Header(){
  const { user, loading, userLogout } = useAuth();
  const {openRegister, openMain} = useNavigation();

  if (loading) return null;

  const logout = async () => {
    userLogout();
    openRegister();
  }

  const username = user?.user_name;
  const profileSection = () => {
  if (user) {
    return (
      <>
        <span>{username}</span>
        <span onClick={() => logout()}>Выйти</span>
      </>
    );
  }

  return (
      <span onClick={() => openRegister()}>Войти/Зарегистрироваться</span>
  );
};

  return (
    <div className={styles.header}>
      <span onClick={() => openMain()}>TROLL</span>
      <div className={styles.profile}>
        {profileSection()}
      </div>
    </div>
  );
};

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>

      <Header />

      <div className={styles.content}>
        <Outlet />
      </div>

    </div>
  );
};