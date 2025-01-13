import * as React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Tooltip, tooltipClasses  } from '@mui/material';
import { styled } from '@mui/material/styles';

const PhotoDetail = ({ photo, closePhotoDetail }) => {
  document.body.style.overflow='hidden';
  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));
  return (
    <div className="photo-detail-overlay">
      <div className='photo-detail'>
        <div className="detail-container">
          {/* Header */}
          <div className='header'>
            <a className="flex items-center" href={photo.user.links.html}>
              <img src={photo.user.profile_image.small} />
              <h7 className='pl-2' style={{ color: 'white' }}>{photo.user.name}</h7>
            </a>
            <div className='buttons'>
              <button onClick={closePhotoDetail}>Close</button>
            </div>
          </div>
          {/* Photo container */}
          <div className='photo-container'>
            <Tooltip title={photo.alt_description} placement='right-end' animation="duration-1000">
              <img src={photo.urls.small}/>
            </Tooltip>
          </div>
          {/* Footers */}
          <div className='actions'>
            <HtmlTooltip
              title={ <React.Fragment> 
                        <Typography color="inherit">URL</Typography>
                        <u>{photo.urls.small}</u>
                      </React.Fragment>
                    }>
              <Button className='button-url' href={photo.urls.small}>Source</Button>
            </HtmlTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

PhotoDetail.propTypes = {
  photo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    urls: PropTypes.shape({
      small: PropTypes.string.isRequired
    }).isRequired,
    // Add other properties as needed, e.g.,
    alt_description: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      profile_image: PropTypes.shape({
        small: PropTypes.string.isRequired,
      }).isRequired,
      links: PropTypes.shape({
        html: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  closePhotoDetail: PropTypes.func.isRequired,
};

export default PhotoDetail;