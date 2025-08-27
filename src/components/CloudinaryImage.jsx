import React from 'react';
import { getThumbnailUrl, getMediumUrl, getLargeUrl } from '../utils/cloudinary.js';

const CloudinaryImage = ({
    src,
    alt,
    size = 'medium',
    className = '',
    width,
    height,
    quality = 'auto',
    crop = 'fill',
    ...props
}) => {
    // If not a Cloudinary URL, return the original image
    if (!src || !src.includes('cloudinary.com')) {
        return (
            <img
                src={src}
                alt={alt}
                className={className}
                width={width}
                height={height}
                {...props}
            />
        );
    }

    // Get optimized URL based on size
    let optimizedSrc = src;

    // Temporarily disable transformations to avoid 400 errors
    // TODO: Re-enable after fixing upload preset and data issues
    optimizedSrc = src;

    /*
    switch (size) {
        case 'thumbnail':
            optimizedSrc = getThumbnailUrl(src, width || 150);
            break;
        case 'small':
            optimizedSrc = getMediumUrl(src, width || 200);
            break;
        case 'medium':
            optimizedSrc = getMediumUrl(src, width || 400);
            break;
        case 'large':
            optimizedSrc = getLargeUrl(src, width || 800);
            break;
        case 'custom':
            // Use custom transformations
            if (width || height) {
                const baseUrl = src.split('/upload/')[0] + '/upload/';
                const imagePath = src.split('/upload/')[1];
                const transformations = [
                    width ? `w_${width}` : '',
                    height ? `h_${height}` : '',
                    `q_${quality}`,
                    `c_${crop}`
                ].filter(Boolean).join(',');
                optimizedSrc = `${baseUrl}${transformations}/${imagePath}`;
            }
            break;
        default:
            optimizedSrc = src;
    }
    */

    return (
        <img
            src={optimizedSrc}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading="lazy"
            {...props}
        />
    );
};

export default CloudinaryImage;
