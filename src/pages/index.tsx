import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import styles from "./home.module.scss";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import useApi from "../services/api";

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  durationAsString: string;
  publishedAt: string;
};

type HomeProps = {
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((item, index) => (
            <li key={index}>
              <Image
                width={192}
                height={192}
                src={item.thumbnail}
                alt={item.title}
                objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <Link href={`episodes/${item.id}`}>
                  <a>{item.title}</a>
                </Link>
                <p>{item.members}</p>
                <span>{item.publishedAt}</span>
                <span>{item.durationAsString}</span>
              </div>
              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio"></img>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((item) => (
              <tr key={item.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={item.thumbnail}
                    alt={item.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`episodes/${item.id}`}>
                    <a>{item.title}</a>
                  </Link>
                </td>
                <td>{item.members}</td>
                <td style={{ width: 100 }}>{item.publishedAt}</td>
                <td>{item.durationAsString}</td>
                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [fetchEpisodes] = useApi({
    method: "GET",
    url: "episodes",
    params: {
      _limit: 12,
      sort: "published_at",
      order: "desc",
    },
  });

  const response = await fetchEpisodes({});

  const episodes = response.data.map((episode) => ({
    id: episode.id,
    title: episode.title,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    thumbnail: episode.thumbnail,
    url: episode.file.url,
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration)
    ),
  }));

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(0, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
