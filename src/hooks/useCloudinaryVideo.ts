import { useMemo } from "react";
import { getVideoUrl } from "../lib/cloudinaryHelpers";

export const useCloudinaryVideo = (publicId: string) => {

    return useMemo(() => {
        return getVideoUrl(publicId);
    }, [publicId]);

};