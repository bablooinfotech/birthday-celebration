import { cloudinary, CLOUDINARY } from "./cloudinary";

export const getImageUrl = (publicId: string) => {
    return cloudinary.url(
        `${CLOUDINARY.imageFolder}/${publicId}`,
        {
            fetch_format: "auto",
            quality: "auto",
            crop: "fill",
        }
    );
};

export const getVideoUrl = (publicId: string) => {
    return cloudinary.video_url(
        `${CLOUDINARY.videoFolder}/${publicId}`
    );
};

export const getAudioUrl = (publicId: string) => {
    return cloudinary.url(
        `${CLOUDINARY.audioFolder}/${publicId}`,
        {
            resource_type: "video",
        }
    );
};