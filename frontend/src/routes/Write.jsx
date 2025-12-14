import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Write = () => {

    const [value, setValue] = useState('');
    const [cover, setCover] = useState('');

    const mutation = useMutation({
        mutationFn: (newPost) => {
            return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost);
        },
        onSuccess: (res) => {
            toast.success("New post has been created!")
        }
    })

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            img:cover.filePath || "",
            title:formData.get("title"),
            desc:formData.get("desc"),
            content:value,
        }

        console.log(data);

        mutation.mutate(data);
    }

    const onSuccess = (res) => {
        console.log(res);
        setCover(res);
    }

    return <div className="">
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <button>Add a cover image</button>
            <input type="text" placeholder="Title of Your Article" name="title"/>
            <textarea name="desc" placeholder="A Short Description"></textarea>
            <ReactQuill theme="snow" value={value} onChange={setValue}/>
            <button className='bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36'>Send</button>
        </form>
    </div>
}

export default Write;