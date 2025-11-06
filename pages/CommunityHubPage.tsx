import React, { useState, useEffect, useCallback } from 'react';
import ImageUploader from '../components/ImageUploader';//hi
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { GreenGramPost } from '../types';
import { generateCaptionForImage } from '../services/geminiService';
import { getGreenGramPosts, addGreenGramPost, deleteGreenGramPost, clearGreenGramPosts } from '../services/localStorageService';
import Modal from '../components/Modal';
import { fetchPlantPostsFromPexels } from '../services/pexelsService';
import { FaHeart, FaRegHeart, FaRegThumbsDown, FaThumbsDown, FaWhatsapp } from 'react-icons/fa';

const CommunityHubPage: React.FC = () => {
  const [posts, setPosts] = useState<GreenGramPost[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  const [likes, setLikes] = useState<{[id: string]: boolean}>({});
  const [dislikes, setDislikes] = useState<{[id: string]: boolean}>({});

  useEffect(() => {
    const loadPosts = async () => {
      const localPosts = getGreenGramPosts();
      if (localPosts.length === 0) {
        setIsLoadingDefaults(true);
        try {
          const pexelsPosts = await fetchPlantPostsFromPexels();
          pexelsPosts.forEach(addGreenGramPost);
          setPosts(pexelsPosts);
        } catch (e) {
          setError('Could not load default plant posts.');
        }
        setIsLoadingDefaults(false);
      } else {
        setPosts(localPosts);
      }
    };
    loadPosts();
  }, []);

  const handleImageUpload = useCallback((base64: string, file: File) => {
    setImageBase64(base64);
    setImageFile(file);
    setError(null);
  }, []);

  const handleGenerateCaption = async () => {
    if (!imageBase64 || !imageFile) {
      setError("Please upload an image first to generate a caption.");
      return;
    }
    setIsGeneratingCaption(true);
    setError(null);
    const result = await generateCaptionForImage(imageBase64, imageFile.type);
    if (result.error) {
      setError(result.error);
    } else {
      setCaption(result.caption);
    }
    setIsGeneratingCaption(false);
  };

  const handlePost = () => {
    if (!imageBase64) {
      setError("Please upload an image.");
      return;
    }
    if (!caption.trim()) {
      setError("Please enter a caption or generate one.");
      return;
    }
    setIsPosting(true);
    setError(null);

    const newPost: GreenGramPost = {
      id: new Date().toISOString(),
      imageUrl: imageBase64,
      caption: caption,
      timestamp: Date.now(),
    };

    addGreenGramPost(newPost);
    setPosts(prevPosts => [newPost, ...prevPosts]);
    
    // Reset form
    setImageBase64(null);
    setImageFile(null);
    setCaption('');
    // Manually clear the uploader preview if possible, or instruct user
    // For this example, the ImageUploader's own clear button can be used by user.
    
    setIsPosting(false);
  };
  
  const handleDeletePost = (postId: string) => {
    deleteGreenGramPost(postId);
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  const handleClearAll = () => setShowClearConfirm(true);
  const confirmClearAll = () => {
    clearGreenGramPosts();
    setPosts([]);
    setShowClearConfirm(false);
  };
  const cancelClearAll = () => setShowClearConfirm(false);

  const handleRefreshDefaults = async () => {
    setIsLoadingDefaults(true);
    clearGreenGramPosts();
    try {
      const pexelsPosts = await fetchPlantPostsFromPexels();
      pexelsPosts.forEach(addGreenGramPost);
      setPosts(pexelsPosts);
    } catch (e) {
      setError('Could not refresh plant posts.');
    }
    setIsLoadingDefaults(false);
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
    if (dislikes[id]) setDislikes(prev => ({ ...prev, [id]: false }));
  };
  const handleDislike = (id: string) => {
    setDislikes(prev => ({ ...prev, [id]: !prev[id] }));
    if (likes[id]) setLikes(prev => ({ ...prev, [id]: false }));
  };
  const handleShare = (post: GreenGramPost) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.caption);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  // Helper to add emoji to AI-generated captions if not present
  const ensurePlantEmoji = (caption: string) => {
    const plantEmojis = ['🌱', '🌿', '🪴', '🌵', '🍃', '🌳', '🌴', '🌺', '🌸'];
    if (plantEmojis.some(e => caption.includes(e))) return caption;
    return `${caption} ${plantEmojis[Math.floor(Math.random() * plantEmojis.length)]}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">GreenGram Community Hub</h2>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Share your plant journey! Post photos of your beloved plants, write captions, or let AI help you create one.
      </p>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card title="Create a New Post" className="mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          <ImageUploader onImageUpload={handleImageUpload} idSuffix="greengram"/>
          <div className="space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your plant..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGenerateCaption}
                disabled={isGeneratingCaption || !imageBase64}
                className="flex-1 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGeneratingCaption ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : "Generate Caption with AI"}
              </button>
              <button
                onClick={handlePost}
                disabled={isPosting || !imageBase64 || !caption.trim()}
                className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isPosting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Posting...</span>
                  </>
                ) : "Post to GreenGram"}
              </button>
            </div>
          </div>
        </div>
      </Card>

      <h3 className="text-2xl font-semibold text-green-700 mb-6 flex justify-between items-center">
        <span>Community Feed</span>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshDefaults}
            className="px-4 py-2 bg-gradient-to-r from-green-400 via-green-500 to-lime-400 text-white rounded shadow hover:from-green-500 hover:to-lime-500 transition-colors font-semibold"
            disabled={isLoadingDefaults}
            title="Refresh with new plant images"
          >
            {isLoadingDefaults ? 'Refreshing...' : 'Refresh Feed'}
          </button>
          {posts.length > 0 && (
            <button onClick={handleClearAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Clear All Posts</button>
          )}
        </div>
      </h3>
      {isLoadingDefaults ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Loading stunning plant posts..." />
        </div>
      ) : posts.length === 0 && !isPosting ? (
        <Alert type="info" message="No posts yet. Be the first to share!" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="relative group bg-white rounded-xl shadow-lg border border-green-100 w-80 h-[370px] mx-auto flex flex-col p-0 hover:scale-105 hover:shadow-xl transition-all duration-200" noPadding>
              <div className="relative w-full h-40">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-40 object-cover rounded-t-xl"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/ios-filled/100/22c55e/plant-under-sun.png'; }}
                />
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 shadow-lg z-10"
                  title="Delete post"
                  style={{ fontSize: 18 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.28a2.25 2.25 0 012.244-2.077h.07a2.25 2.25 0 012.244 2.077L14.74 5.79m-4.858 0l-2.927-2.249m5.854 2.249L10.879 3.28m0 0L9.26 9" />
                  </svg>
                </button>
              </div>
              <div className="bg-white rounded-b-xl p-3 flex flex-col flex-1 justify-between">
                <div className="flex flex-row justify-between items-center gap-2 mb-2">
                  <p className="font-semibold text-green-800 flex-1 mr-2 whitespace-pre-line break-words" title={post.caption}>
                    {post.id.startsWith('pexels-') ? ensurePlantEmoji(post.caption) : post.caption}
                  </p>
                  <div className="flex flex-row gap-2 items-center">
                    <button onClick={() => handleLike(post.id)} className={`transition-transform text-2xl ${likes[post.id] ? 'text-pink-600' : 'text-gray-500'} hover:text-pink-500 hover:scale-110 shadow-sm cursor-pointer`} title="Like">
                      {likes[post.id] ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button onClick={() => handleDislike(post.id)} className={`transition-transform text-2xl ${dislikes[post.id] ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-500 hover:scale-110 shadow-sm cursor-pointer`} title="Dislike">
                      {dislikes[post.id] ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    </button>
                    <button onClick={() => handleShare(post)} className="transition-transform text-2xl text-green-600 hover:text-green-700 hover:scale-110 shadow-sm cursor-pointer" title="Share via WhatsApp">
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">{new Date(post.timestamp).toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showClearConfirm && (
        <Modal isOpen={showClearConfirm} onClose={cancelClearAll} title="Clear All Posts?">
          <div className="p-4">
            <p>Are you sure you want to clear all GreenGram posts? This cannot be undone.</p>
            <div className="flex gap-4 mt-4">
              <button onClick={confirmClearAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Yes, Clear All</button>
              <button onClick={cancelClearAll} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommunityHubPage;
