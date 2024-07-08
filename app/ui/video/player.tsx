const VideoPlayer = ({
  setShowRewardVideo,
  videoPath,
}: {
  setShowRewardVideo: (showRewardVideo: boolean) => void;
  videoPath: string;
}) => {
  return (
    <video
      className="fullscreen-video rounded-video"
      autoPlay
      preload="none"
      muted
      onEnded={() => {
        console.log("ended...");
        setShowRewardVideo(false);
      }}
    >
      <source src={videoPath} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
