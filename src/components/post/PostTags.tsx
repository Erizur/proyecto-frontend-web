import { Link } from "react-router-dom";
import type { Tag, PublicationType } from "../../types/publication.types";

interface PostTagsProps {
    tags: Tag[];
    pubType: PublicationType;
}

export default function PostTags({ tags, pubType }: PostTagsProps) {
    const typeLabels = {
        PHOTOGRAPHY: 'Fotografía',
        ILLUSTRATION: 'Ilustración',
        TEXT: 'Texto'
    };

    return <>
        <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
                <Link 
                    key={tag.id} 
                    to={`/explore?tag=${tag.name}`}
                    className="badge badge-ghost badge-sm hover:badge-primary"
                >
                    #{tag.name}
                </Link>
            ))}
            <span className="badge badge-primary badge-sm">
                {typeLabels[pubType]}
            </span>
        </div>
    </>
}