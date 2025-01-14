import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const Photo = ({ photo, handlePhotoClick }) => {
  return (
    <Tooltip title={photo.alt_description} followCursor animation="duration-500">
      <img
        className='w-full md:w-auto'
        key={photo.id}
        src={photo.urls.small}
        alt={photo.alt_description}
        onClick={() => handlePhotoClick(photo)}
      />
    </Tooltip>
    // console.log(photo)
  );
};

Photo.propTypes = {
  photo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    urls: PropTypes.shape({
      small: PropTypes.string.isRequired
    }).isRequired,
    // Add other properties as needed, e.g.,
    alt_description: PropTypes.string,
  }).isRequired,
  handlePhotoClick: PropTypes.func.isRequired,

};

export default Photo;