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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGettingVideo(true);
    
    try {
      const response = await axios.post("http://localhost:4000/urlSubmit", {
        url: url
      });
  
      console.log(response.data);
  
      if (response.data.success) {
        try {
          const videoResponse = await axios.get('http://localhost:4000/getVideoFile', {
            responseType: 'blob'
          });
  
          console.log(videoResponse);
          const videoBlob = new Blob([videoResponse.data], { type: 'video/mp4' });
          const videoUrl = URL.createObjectURL(videoBlob);
          setVideoUrl(videoUrl);
          setVideoGot(true);
        } catch (error) {
          console.error('Error fetching video:', error);
        }
      } else {
        // Alert the user about the invalid URL
        alert(response.data.message || 'The given URL is wrong.');
        //page needed to be reload
        window.location.reload();
      }
    } catch (error) {
      console.error('Error processing the request:', error);
      alert('Failed to process the URL. Please try again.');
    }
  
    setGettingVideo(false);
  };
  

  
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
