import { Link, useSearchParams } from "react-router-dom"
import SearchBar from "../components/SearchBar"
import FeaturedPosts from "../components/FeaturedPosts"
import PostList from "../components/PostList"

const Homepage = () => {
    const [searchParams] = useSearchParams();
    const search = (searchParams.get("search") || "").trim();
    const isSearching = search.length > 0;

    return (
        <div className="flex flex-col gap-4">
            {/* BREADCRUMBS */}
            <div className="flex gap-4">
                <Link to="/">Home</Link>
                <span>‣</span>
                <span className="text-blue-800">Blogs and Articles</span>
            </div>
            {/* INTRODUCTION */}
            <div className="flex items-center justify-between">
                {/* titles */}
                <div className="">
                    <h1 className="text-gray-800 text-2xl md:text-4xl lg:text-5xl font-bold">Lorem Ipsum</h1>
                    <p className="mt-6 text-md md:text-xl">Access the most recent blog posts and articles written by AI.
                    The blogspot is updated daily, so feel free to come back anytime for new content.
                    </p>
                </div>
            </div>
            {/* SEARCH */}
            <SearchBar/>
            {/* FEATURED POSTS */}
            <FeaturedPosts/>
            {/* POSTLIST */}
            <div className="">
                <h1 className="my-8 text-2xl text-gray-600">{isSearching ? "Found Posts" : "Recent Posts"}</h1>
                <PostList/>
            </div>
        </div>
    )
}

export default Homepage