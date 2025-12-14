import { Link } from "react-router-dom";
import { format } from "timeago.js";

const PostListItem = ({post}) => {

    return (
        <div className="flex flex-col xl:flex-row gap-8 mb-8">
            {/* image */}
            {post.img && <div className="md:hidden xl:block">
                <div className="w-64 h-24 sm:w-80 sm:h-56 md:w-96 md:h-64 overflow-hidden rounded-2xl shrink-0">
                    <img src={post.img} className="rounded-2xl object-cover" w="735"/>
                </div>
            </div>}
            <div className="flex flex-col gap-4">
                {/* title */}
                <Link to={`/${post.slug}`} className="text-4xl font-semibold">
                    {post.title}
                </Link>
                {/* date */}
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span><i>{format(post.createdAt)}</i></span>
                </div>
                <p>
                    {post.desc}
                </p>
                <Link to={`/${post.slug}`} className="underline text-blue-800 text-sm">Read More</Link>
            </div>
        </div>
    )
}

export default PostListItem