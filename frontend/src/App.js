import React, { useState } from "react";
import axios from "axios";
import "./App.css";


export default function App() {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoGot, setVideoGot] = useState(false);
  const [gettingVideo, setGettingVideo] = useState(false);

  function handleChange(event) {
    setUrl(event.target.value);
  }

  const handleSubmit = async(event)=>{
    event.preventDefault();
    setGettingVideo(true);
    const response = await axios.post("http://localhost:4000/urlSubmit",{
        url : url
    })
    console.log(response.data);
    try {
        const response = await axios.get('http://localhost:4000/getVideoFile', {
          responseType: 'blob'
        });
        console.log(response);
        const videoBlob = new Blob([response.data], { type: 'video/mp4' });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        setVideoGot(true)
      } catch (error) {
        console.error('Error fetching video:', error);
      }
      setGettingVideo(false)
}

  
  const download = async () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'downloaded_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h1>Instagram Video Downloader</h1>
        <input type="text" placeholder="Enter Instagram URL" value={url} onChange={handleChange} className="input" />
        <button type="submit" className="button">Get Video</button>
      </form>
      {gettingVideo && <p className="message">Downloading video, please wait...</p>}
      {videoGot && <button onClick={download} className="button1">Download Video</button>}
    </div>
  );
}
