import { useRef, useState } from 'react';

const WebcamCapture = ({ onCapture, onError }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      onError('Camera access denied or unavailable.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'webcam-photo.jpg', { type: 'image/jpeg' });
      onCapture(file);
      setPhotoUrl(URL.createObjectURL(blob));
      setCaptured(true);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }, 'image/jpeg');
  };

  const retake = () => {
    setCaptured(false);
    setPhotoUrl(null);
    startCamera();
  };

  return (
    <div>
      {!captured ? (
        <>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px' }} />
          <button type="button" onClick={startCamera}>Start Camera</button>
          {stream && <button type="button" onClick={capturePhoto}>Capture Photo</button>}
        </>
      ) : (
        <>
          <img src={photoUrl} alt="Captured" style={{ width: '100%', maxWidth: '400px' }} />
          <button type="button" onClick={retake}>Retake</button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;