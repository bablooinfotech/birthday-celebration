import { useCloudinaryVideo } from "../../hooks/useCloudinaryVideo";

interface Props {
    publicId: string;
    className?: string;
}

export default function CloudVideo({
    publicId,
    className,
}: Props) {

    const url = useCloudinaryVideo(publicId);

    return (
        <video
            className={className}
            controls
            preload="metadata"
        >
            <source src={url} />
        </video>
    );
}