import { Header, Player } from "../components/index";
import styles from "../styles/app.module.scss";
import "../styles/global.scss";
function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrepper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  );
}

export default MyApp;
