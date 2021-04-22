import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import styles from "./styles.module.scss";
export const Header = () => {
  const formatDate = format(new Date(), "EEEEEE d MMMM", { locale: ptBR });
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="podcastr_Logo" />
      <p>O Melhor para você ouvir, sempre</p>
      <span>{formatDate}</span>
    </header>
  );
};
