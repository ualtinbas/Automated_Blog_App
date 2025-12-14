import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="w-full h-20 flex items-center justify-between flex-direction">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
                <img src="/logo.jpg" className='w-16 h-16' alt=""/>
                <span>Scenic Logs</span>
            </Link>
            {/* CREATED BY */}
            <div className="hidden sm:flex text-xl">
                <span>Created by <i>Ugurhan Altinbas</i></span>
            </div>
        </div>
    )
}

export default Navbar