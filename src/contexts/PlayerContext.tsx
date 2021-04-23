import { createContext, useState, useContext, ReactNode } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (Episode) => void;
  playList: (list, index: number) => void;
  playNext: () => void;
  playPrev: () => void;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrev: boolean;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};

export const PlayerContextProvider = ({
  children,
}: PlayerContextProviderProps) => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  const hasNext = currentEpisodeIndex > 0;
  const hasPrev = currentEpisodeIndex < episodeList.length - 1;

  const playNext = () => {
    if (isShuffling) {
      const nextRandomEpisode = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisode);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  const playPrev = () => {
    if (hasPrev) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrev,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrev,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
