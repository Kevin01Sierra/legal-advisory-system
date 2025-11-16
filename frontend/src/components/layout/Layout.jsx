import Header from './Header';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;