import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const SearchBar = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams,setSearchParams] = useSearchParams()

    const handleKeyPress = (e) => {
        if (e.key == "Enter"){
            const query = e.target.value;
            if (location.pathname == "/posts"){
                setSearchParams({ ...Object.fromEntries(searchParams), search: query });
            }else{
                navigate(`/?search=${encodeURIComponent(query)}`);
            }
        }
    }

    return (
        <div className="hidden xs:flex bg-[#f0f0f0] rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
            <div className="p-2 rounded-full flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="gray"
                >
                    <circle cx="10.5" cy="10.5" r="7.5" />
                    <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
                <input type="text" placeholder="Search a post..." className="bg-transparent" onKeyDown={handleKeyPress}/>
            </div>
        </div>
    )
}

export default SearchBar