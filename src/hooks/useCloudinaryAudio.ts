import { useMemo } from "react";
import { getAudioUrl } from "../lib/cloudinaryHelpers";

export const useCloudinaryAudio = (publicId: string) => {

    return useMemo(() => {
        return getAudioUrl(publicId);
    }, [publicId]);

};