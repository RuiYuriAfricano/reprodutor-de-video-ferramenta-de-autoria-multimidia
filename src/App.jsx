import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

// Importando os vídeos do diretório medias
import video1 from './medias/Sandra Mbuyi - Goodness (clip officiel).mp4';
import video2 from './medias/Grace Zola - Deus de Promessas (Official Music Video).mp4';
import video3 from './medias/Rosny Kayiba - Mon meilleur ami ( Clip officiel).mp4';
import video4 from './medias/Grace Zola - Oza Monene feat. Ruth Kuniasa (Official Music Video).mp4';
import video5 from './medias/Rhema Loseke - Yaya ( Clip Officiel).mp4';

// Importando as imagens das capas
import capa1 from './medias/Capa1.jpg';
import capa2 from './medias/Capa2.jpg';
import capa3 from './medias/Capa3.jpg';
import capa4 from './medias/Capa4.jpg';
import capa5 from './medias/Capa5.jpg';

// Lista de vídeos
const videoList = [
  { id: 1, title: 'Sandra Mbuyi - Goodness', url: video1, capa: capa1 },
  { id: 2, title: 'Grace Zola - Deus de Promessas', url: video2, capa: capa2 },
  { id: 3, title: 'Rosny Kayiba - Mon meilleur ami', url: video3, capa: capa3 },
  { id: 4, title: 'Grace Zola - Oza Monene feat. Ruth Kuniasa', url: video4, capa: capa4 },
  { id: 5, title: 'Rhema Loseke - Yaya', url: video5, capa: capa5 }
];

function App() {
  // Estados para controlar o vídeo
  const [currentVideo, setCurrentVideo] = useState(videoList[0]); // Vídeo atual
  const [playing, setPlaying] = useState(false); // Estado de reprodução (play/pause)
  const [muted, setMuted] = useState(false); // Estado de mutado
  const [volume, setVolume] = useState(0.5); // Volume do vídeo
  const [played, setPlayed] = useState(0); // Tempo de reprodução do vídeo
  const [seeking, setSeeking] = useState(false); // Estado de busca

  // Referência ao elemento ReactPlayer
  const playerRef = useRef(null);

  // Referência para o volume anterior
  const prevVolumeRef = useRef(0.5);

  // Efeito para alterar o vídeo atual
  useEffect(() => {
    // Reinicia o vídeo quando o vídeo atual muda
    if (playerRef.current) {
      if (playing) {
        // Se estiver reproduzindo, define o tempo de reprodução para continuar de onde parou
        playerRef.current.seekTo(played);
      } else {
        // Se estiver pausado, mantém o tempo de reprodução atual
        playerRef.current.seekTo(played, 'fraction');
      }
    }
  }, [currentVideo, playing, played]);

  // Função para reproduzir ou pausar o vídeo
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  // Função para alterar o tempo de reprodução do vídeo
  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  // Função para iniciar a busca do tempo de reprodução
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  // Função para finalizar a busca do tempo de reprodução
  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current.seekTo(played);
  };

  // Função para alterar o volume do vídeo
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // Função para mutar ou desmutar o vídeo
  const handleMute = () => {
    if (muted) {
      // Desmuta o vídeo e restaura o volume anterior
      setMuted(false);
      setVolume(prevVolumeRef.current);
    } else {
      // Muta o vídeo e armazena o volume anterior
      prevVolumeRef.current = volume;
      setMuted(true);
      setVolume(0);
    }
  };

  // Função que é chamada quando o vídeo está em progresso
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  // Função para avançar para o próximo vídeo na lista
  const handleNextVideo = () => {
    const currentIndex = videoList.findIndex((video) => video.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % videoList.length;
    setCurrentVideo(videoList[nextIndex]);
  };

  // Função para retroceder para o vídeo anterior na lista
  const handlePreviousVideo = () => {
    const currentIndex = videoList.findIndex((video) => video.id === currentVideo.id);
    const previousIndex = (currentIndex - 1 + videoList.length) % videoList.length;
    setCurrentVideo(videoList[previousIndex]);
  };

  return (
    <div className='app-container'>
      {/* Componente ReactPlayer para reproduzir o vídeo */}
      <div className='player-wrapper'>
        {playing ? (
          <ReactPlayer
            ref={playerRef}
            className='react-player'
            url={currentVideo.url}
            width='90%'
            height='90%'
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            controls={false} // Desativando os controles padrão do ReactPlayer
          />
        ) : (
          <img className='react-player' src={currentVideo.capa} alt="Capa do vídeo" width="90%" height="90%" />
        )}
        {/* Título do vídeo */}
        <h2 className='video-title'>{currentVideo.title}</h2>
        {/* Controles personalizados do vídeo */}
        <div className="controls">
          {/* Botão para retroceder para o vídeo anterior */}
          <button onClick={handlePreviousVideo}>Previous</button>
          {/* Botão para reproduzir ou pausar o vídeo */}
          <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
          {/* Botão para avançar para o próximo vídeo */}
          <button onClick={handleNextVideo}>Next</button>
          {/* Barra de progresso do vídeo */}
          <input
            type='range' min={0} max={1} step='any'
            value={played} onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown} onMouseUp={handleSeekMouseUp}
          />
          {/* Botão para mutar ou desmutar o vídeo */}
          <button onClick={handleMute}>{muted ? 'Unmute' : 'Mute'}</button>
          {/* Controle de volume do vídeo */}
          <input type='range' min={0} max={1} step='any' value={volume} onChange={handleVolumeChange} />
        </div>
      </div>
      {/* Lista de reprodução */}
      <div className='playlist'>
        <h2>Playlist</h2>
        <ul>
          {videoList.map((video) => (
            <li key={video.id} onClick={() => setCurrentVideo(video)} className={currentVideo.id === video.id ? 'selected' : ''}>
              {video.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
