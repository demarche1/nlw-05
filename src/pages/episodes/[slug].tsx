import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./episodes.module.scss";
import useApi from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  durationAsString: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
};

const Episode = ({ episode }: EpisodeProps) => {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={150}
          objectFit="cover"
          src={episode.thumbnail}
        />

        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
};
export default Episode;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const [fetchEpisode] = useApi({
    method: "GET",
    url: `/episodes/${slug}`,
  });

  const response = await fetchEpisode({});

  const episode = {
    id: response.data.id,
    title: response.data.title,
    members: response.data.members,
    publishedAt: format(parseISO(response.data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    thumbnail: response.data.thumbnail,
    description: response.data.description,
    url: response.data.file.url,
    duration: Number(response.data.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(response.data.file.duration)
    ),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};
