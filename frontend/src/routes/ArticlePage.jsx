import { useParams } from "react-router-dom";
import { format } from "timeago.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DOMPurify from "dompurify";

const fetchPost = async (slug) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
    return res.data;
}

const ArticlePage = () => {

    const { slug } = useParams();

    const {isPending,error,data} = useQuery({
        queryKey:["post",slug],
        queryFn: () => fetchPost(slug),
    })

    if(isPending) return "loading...";
    if(error) return "Something went wrong!" + error.message;
    if(!data) return "Post not found!";

    return (
        <div className="flex flex-col gap-8">
            {/* detail */}
            <div className="flex gap-8">
                <div className="lg:w-3/5 flex flex-col gap-4">
                    <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">{data.title}</h1>
                    <span className="flex items-center text-gray-400 text-sm"><i>{format(data.createdAt)}</i></span>
                    <p className="flex items-center text-gray-600 font-medium">
                        {data.desc}
                    </p>
                </div>
                {data.img && <div className="hidden lg:block w-2/5">
                    <div className="w-full h-72 xl:h-80 2xl:h-96 overflow-hidden rounded-2xl">
                        <img src={data.img} alt="" className="w-full h-full object-cover"/>
                    </div>
                </div>}
            </div>
            {/* content */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="lg:text-lg flex flex-col gap-6 text-justify" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}/>
            </div>
        </div>
    )
}

export default ArticlePage