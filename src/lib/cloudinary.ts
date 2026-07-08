import { Cloudinary } from "cloudinary-core";
const CLOUDINARY_CLOUD_NAME : string =  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
console.log("CLOUDINARY_CLOUD_NAME", CLOUDINARY_CLOUD_NAME);
export const cloudinary = new Cloudinary({
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    secure: true,
});

export const CLOUDINARY = {
    imageFolder: import.meta.env.VITE_CLOUDINARY_IMAGE_FOLDER,
    videoFolder: import.meta.env.VITE_CLOUDINARY_VIDEO_FOLDER,
    audioFolder: import.meta.env.VITE_CLOUDINARY_AUDIO_FOLDER,
};