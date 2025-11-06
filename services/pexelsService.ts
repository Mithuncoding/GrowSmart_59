export interface PexelsPhoto {//hi
  id: number;
  src: { original: string; large: string; medium: string; small: string; };
  photographer: string;
  alt: string;
}

export interface GreenGramPostLike {
  id: string;
  imageUrl: string;
  caption: string;
  timestamp: number;
}

const PEXELS_API_KEY = 'OVQukoRCDxTZtcc8jHwvYpMBddDgGl4GYyG70B5cekbQ73uQpXSUW19L';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search?query=plants&per_page=40';

const defaultCaptions = [
  "Nature's masterpiece 🌱",
  "Green therapy for the soul",
  "Plant power!",
  "Leafy love",
  "A touch of green magic",
  "Breathe in, breathe out: plant style",
  "Rooted in beauty",
  "Sun-kissed leaves",
  "Fresh air, fresh vibes",
  "Plant parent goals",
  "Jungle vibes at home",
  "Sprouting happiness",
  "Botanical bliss",
  "Chlorophyll dreams",
  "Nature's artwork",
  "Serenity in green",
  "Flourishing friends",
  "Tiny forests, big joy",
  "Grow through what you go through",
  "Earth's little wonders"
];

export async function fetchPlantPostsFromPexels(): Promise<GreenGramPostLike[]> {
  const res = await fetch(PEXELS_API_URL, {
    headers: {
      Authorization: PEXELS_API_KEY
    }
  });
  if (!res.ok) throw new Error('Failed to fetch from Pexels');
  const data = await res.json();
  const photos: PexelsPhoto[] = data.photos;
  // Shuffle and pick 20 unique photos
  const shuffled = photos.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 20);
  return selected.map((photo, idx) => ({
    id: `pexels-${photo.id}`,
    imageUrl: photo.src.large || photo.src.original,
    caption: defaultCaptions[idx % defaultCaptions.length],
    timestamp: Date.now() - Math.floor(Math.random() * 1000000000) // Randomize timestamp for realism
  }));
} 
