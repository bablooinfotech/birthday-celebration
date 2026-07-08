import { useMemo } from "react";
import { getImageUrl } from "../lib/cloudinaryHelpers";

export const useCloudinaryImage = (publicId: string) => {

    const url = useMemo(() => {
        return getImageUrl(publicId);
    }, [publicId]);

    return url;
};