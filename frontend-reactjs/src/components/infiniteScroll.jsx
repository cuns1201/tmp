import { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Photo from './photo.jsx';
import PhotoDetail from './photoDetail.jsx'

// import Profile from './profile.jsx';

import '../index.css';

export default function UnsplashPhotos() {
  const [photos, setPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State for selected photo

  // const [isSignUpMode, setIsSignUpMode] = useState(false);
  // const toggleMode = () => {
  //   setIsSignUpMode(!isSignUpMode);
  // };

  useEffect(() => {
    const fetchPhotos = async () => {
    try {
      const response = await axios.get("https://api.unsplash.com/photos",
        {
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
          },
          params: {
            page: page,
            per_page: 10,
          },
        }
      );
      setPhotos(prevPhotos => [...prevPhotos, ...response.data]);
      if (response.data.length === 0) {
          setHasMore(false);
      }
    }
    catch (error) {
        console.log('ERROR: ', error)
    }
    };

    fetchPhotos();
  }, [page]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo); // Set selected photo on click
  };

  const closePhotoDetail = () => {
    document.body.style.overflow = "scroll";
    setSelectedPhoto(null); // Clear selected photo on close
  };

  return (
    <>

    {/* <Profile/> */}
      <InfiniteScroll
        dataLength={photos.length}
        next={() => setPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
        endMessage={<p>No more photos</p>}
        style={{padding: 20}}
      >
        <div className='flex justify-around'>
          <div className='columns-1 md:columns-2 lg:columns-3 space-y-4'>
            {photos.map((photo, index) => (
              <Photo 
              key={index}
              photo={photo}
              handlePhotoClick={handlePhotoClick}/>
              )
            )}
          </div>
        </div>
      </InfiniteScroll>

      {selectedPhoto && (
        <PhotoDetail photo={selectedPhoto} closePhotoDetail={closePhotoDetail} />
      )}
    </>
  );
};