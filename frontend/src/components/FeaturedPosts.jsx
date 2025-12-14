import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";

const fetchFeatured = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { page: 1, limit: 4 },
    });
    return res.data.posts;
}

const FeaturedPosts = () => {

    const { isPending, error, data: posts = [] } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchFeatured,
    });

    if (isPending) return "Loading featured posts...";
    if (error) return "Something went wrong! " + error.message;

    const [first, ...rest] = posts;
    if (!first) return null;

    return (
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {first.img && <img src={first.img} className="rounded-3xl object-cover" />}
            <div className="flex items-center gap-4">
            <span className="lg:text-lg text-gray-700"><i>{format(first.createdAt)}</i></span>
            </div>
            <Link to={`/${first.slug}`} className="text-xl lg:text-3xl font-semibold lg:font-bold">
            {first.title}
            </Link>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {rest.map((p) => (
            <div key={p._id} className="lg:h-1/3 flex justify-between gap-4">
                {p.img && <img src={p.img} className="rounded-3xl object-cover w-1/3" />}
                <div className="w-2/3">
                <div className="flex items-center gap-4 text-sm lg:text-base">
                    <span className="lg:text-sm text-gray-700"><i>{format(p.createdAt)}</i></span>
                </div>
                <Link to={`/${p.slug}`} className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium">
                    {p.title}
                </Link>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default FeaturedPosts;