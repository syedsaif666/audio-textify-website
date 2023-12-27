'use client';
import React, { useEffect, useState } from 'react';

const AudioPlayer: React.FC= () => {
  const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'fileData') {
        setFileData(event.data.fileData);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
       <audio src={fileData} controls={true}></audio>
    </div>
  );
};

export default AudioPlayer;
