import React, {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {FaPlay, FaTrash} from "react-icons/fa";

interface Image {
    id: string;
    repo_tag: string;
    size: string;
}

const ImageList : React.FC = () => {

    const [images, setImages] = useState<Image[]>([]);

    const getImages = async () => {
        try {

            const res: Image[] = await invoke("list_images")
            setImages(res)
        } catch (e) {
            console.error(e)
        }
    }

    const handleRemove = async (id: string) =>{
        try {
            await invoke("remove_image", {image: id})
            getImages();
        } catch (e) {
            console.error(e)
        }
    }

    const handleRun = async (id: string) => {
        try {
            await invoke("create_container", {image: id});
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getImages();
    }, [])

    return(
        <div>
            <h2 className={"font-bold"}>Images</h2>
            <div className={'flex flex-col gap-5'}>{images.map((image) => (
                <div key={image.id}>
                    <div>
                        <h3 className={"font-bold"}>{image.repo_tag}</h3>
                        <p>Image Size: {image.size}</p>
                    </div>
                    <div className={'flex gap-2'}>
                        <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-green-500 text-white" } onClick={() => handleRun(image.repo_tag)}>
                            <FaPlay />
                            Run Image
                        </button>
                        <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-red-500 text-white" } onClick={() => handleRemove(image.repo_tag)}>
                            <FaTrash />
                            Remove Image
                        </button>
                    </div>
                </div>
            ))}</div>
        </div>
    )
}

export default ImageList;