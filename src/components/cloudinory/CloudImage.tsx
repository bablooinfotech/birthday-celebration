import { useState } from "react";
import { useCloudinaryImage } from "../../hooks/useCloudinaryImage";

interface Props {
    publicId: string;
    alt?: string;
    className?: string;
}

export default function CloudImage({
    publicId,
    alt,
    className,
}: Props) {

    const url = useCloudinaryImage(publicId);

    const [error, setError] = useState(false);

    return (
        <img
            src={error ? "/placeholder.webp" : url}
            alt={alt}
            loading="lazy"
            className={className}
            onError={() => setError(true)}
        />
    );
}