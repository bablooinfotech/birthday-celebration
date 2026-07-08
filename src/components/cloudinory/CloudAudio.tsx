import { useCloudinaryAudio } from "../../hooks/useCloudinaryAudio";

interface Props {
    publicId: string;
}

export default function CloudAudio({
    publicId,
}: Props) {

    const url = useCloudinaryAudio(publicId);

    return (
        <audio controls preload="metadata">
            <source src={url} />
        </audio>
    );
}