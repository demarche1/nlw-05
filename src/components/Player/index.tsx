import Image from "next/image";
import Slider from "rc-slider";

import { useRef, useEffect, useState } from "react";
import { usePlayerContext } from "../../contexts/PlayerContext";

import "rc-slider/assets/index.css";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export const Player = () => {
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrev,
    hasNext,
    hasPrev,
    setPlayingState,
  } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement>(null);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleProgress = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  const progressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            objectFit="cover"
            src={episode.thumbnail}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode && styles.empty}>
        <div className={styles.progress}>
          <span>
            {episode ? convertDurationToTimeString(progress) : "00:00:00"}
          </span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleProgress}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ backgroundColor: "#04d361" }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>
            {episode
              ? convertDurationToTimeString(episode.duration)
              : "00:00:00"}
          </span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onEnded={playNext}
            onPause={() => setPlayingState(false)}
            onPlay={() => setPlayingState(true)}
            onLoadedMetadata={progressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            className={!isShuffling && styles.disabledToggle}
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={isShuffling ? false : !episode || !hasPrev}
            onClick={playPrev}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            className={styles.playButton}
            type="button"
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            disabled={isShuffling ? false : !episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próximo" />
          </button>

          <button
            className={!isLooping && styles.disabledToggle}
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
};
