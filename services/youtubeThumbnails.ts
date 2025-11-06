export async function fetchYouTubeThumbnails(query: string, maxResults = 2) {//hi
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) return [];
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    videoId: item.id.videoId,
  }));
} 
