import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

interface RelatedYouTubeVideoProps {
  plantName: string;
  diseaseName?: string;
}

const getEnvApiKey = () => {
  return import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
};//hi

const getSearchQuery = (plantName: string, diseaseName?: string) => {
  if (plantName.toLowerCase().includes('coconut')) {
    return [
      'coconut tree care India',
      'coconut plant care Kannada',
      'coconut plant care English',
      'coconut tree care Malayalam',
      'coconut tree care Tamil',
      'coconut tree care Telugu',
      'coconut tree care Kannada',
      'coconut tree care',
    ];
  }
  if (plantName && diseaseName && diseaseName !== 'N/A') {
    return [`${plantName} ${diseaseName} care`];
  }
  if (plantName) {
    return [`${plantName} plant care India`, `${plantName} plant care Kannada`, `${plantName} plant care English`, `${plantName} plant care`];
  }
  return ['plant care tips India', 'plant care tips Kannada', 'plant care tips English', 'plant care tips'];
};

const fetchYouTubeApiVideo = async (query: string, apiKey: string) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`
    );
    const data = await res.json();
    console.log('[YouTube API] Query:', query, 'Response:', data); // Debug log
    if (data.items && data.items.length > 0) {
      // Find the first embeddable video
      const embeddable = data.items.find((item: any) => item.id && item.id.videoId);
      if (embeddable) {
        return {
          videoId: embeddable.id.videoId,
          title: embeddable.snippet.title,
          author_name: embeddable.snippet.channelTitle,
          thumbnail_url: embeddable.snippet.thumbnails.high?.url || embeddable.snippet.thumbnails.default?.url,
        };
      }
    }
  } catch (e) {
    console.error('[YouTube API] Error:', e);
  }
  return null;
};

const fetchOEmbedVideo = async (query: string) => {
  try {
    // We can't search directly with oEmbed, so we'll still try to find a video ID
    // by fetching the search page but we expect CORS issues here. This is mostly a placeholder
    // or would require a server-side proxy to avoid CORS.
    // A better fallback would be to link to the YouTube search.
    // Keeping this for now as it was the previous logic, but it is expected to fail CORS.
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const text = await res.text();
    const match = text.match(/\"videoId\":\"([^"]+)\"/);
    if (match && match[1]) {
      const videoId = match[1];
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`);
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        console.log('[YouTube oEmbed Fallback] Query:', query, 'OEmbed:', oembed); // Debug log
        return {
          videoId: videoId,
          title: oembed.title,
          author_name: oembed.author_name,
          thumbnail_url: oembed.thumbnail_url,
        };
      }
    }
  } catch (e) {
    console.error('[YouTube oEmbed Fallback] Error:', e);
  }
  return null;
};

const RelatedYouTubeVideo: React.FC<RelatedYouTubeVideoProps> = ({ plantName, diseaseName }) => {
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const tryQueries = async () => {
      setLoading(true);
      setError(null);
      setVideoInfo(null);
      setVideoUrl(null);
      setVideoId(null);
      setEmbedError(false);
      const queries = getSearchQuery(plantName, diseaseName);
      const apiKey = getEnvApiKey();
      
      let foundVideo = null;

      if (apiKey) {
        for (let i = 0; i < queries.length; i++) {
          const query = queries[i];
          const apiVideo = await fetchYouTubeApiVideo(query, apiKey);
          if (apiVideo && !cancelled) {
            foundVideo = apiVideo;
            break; // Found a video via API, stop trying queries
          }
        }
      }

      if (!foundVideo) {
         // If API failed or no key, try oEmbed (though direct search page fetch will still have CORS issues)
         // This fallback is unlikely to work in the browser due to CORS.
         // A more reliable fallback is just showing the link.
         for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            const oembedVideo = await fetchOEmbedVideo(query);
             if(oembedVideo && !cancelled) {
                 foundVideo = oembedVideo;
                 break; // Found a video via oEmbed, stop trying queries
             }
         }
      }

      if (foundVideo && !cancelled) {
        setVideoInfo(foundVideo);
        setVideoUrl(`https://www.youtube.com/watch?v=${foundVideo.videoId}`);
        setVideoId(foundVideo.videoId);
      } else if (!cancelled) {
        setError('No playable video found.');
      }

      if (!cancelled) {
        setLoading(false);
      }
    };
    tryQueries();
    return () => { cancelled = true; };
  }, [plantName, diseaseName]);

  const queries = getSearchQuery(plantName, diseaseName);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(queries[0])}`;

  const handleOpenModal = () => {
    setModalOpen(true);
    setEmbedError(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEmbedError(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[120px]"><LoadingSpinner text="Finding the best video..." /></div>;
  }
  if (videoInfo && videoUrl && videoId) {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg bg-white border border-green-200 animate-fade-in flex flex-col items-center">
          <button onClick={handleOpenModal} className="block w-full focus:outline-none group">
            <div className="relative">
              {videoInfo.thumbnail_url ? (
                 <img src={videoInfo.thumbnail_url} alt={videoInfo.title} className="w-full object-cover aspect-video group-hover:brightness-90 transition" style={{ maxHeight: 320 }} />
              ) : (
                 <div className="w-full aspect-video bg-gray-200 flex items-center justify-center" style={{ maxHeight: 320 }}>
                    <span className="text-gray-500">No Thumbnail</span>
                 </div>
              )}
              
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black bg-opacity-60 rounded-full p-4">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
            </div>
          </button>
          <div className="p-3 text-center bg-green-50 text-green-800 font-medium text-base w-full">
            <button onClick={handleOpenModal} className="hover:underline font-bold text-lg bg-transparent border-none cursor-pointer">{videoInfo.title}</button>
            <div className="text-sm mt-1">by {videoInfo.author_name}</div>
            <div className="mt-2">
              <button onClick={handleOpenModal} className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors font-semibold">Play in App</button>
            </div>
          </div>
        </div>
        <Modal isOpen={modalOpen} onClose={handleCloseModal} title={videoInfo.title} size="xl">
          {!embedError && videoId ? (
            <div className="w-full aspect-video flex items-center justify-center">
              <iframe
                title={videoInfo.title}
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
                style={{ border: 0 }}
                onError={() => setEmbedError(true)}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-4">This video cannot be played here. <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="underline">Watch on YouTube</a></div>
            </div>
          )}
        </Modal>
      </>
    );
  }
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg bg-white border border-green-200 animate-fade-in flex flex-col items-center">
      <div className="p-6 text-center">
        <div className="text-red-500 text-sm mb-2">{error || 'No playable video could be embedded automatically.'}</div>
        <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors font-semibold">See related videos on YouTube</a>
      </div>
    </div>
  );
};

export default RelatedYouTubeVideo; 
