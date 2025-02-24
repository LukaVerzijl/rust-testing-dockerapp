import {FaDocker, FaPlay} from "react-icons/fa";
import React from "react";

interface NavProps {
    activeTab: "containers" | "images"
    setActiveTab: (activeTab: "containers" | "images") => void

}


const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div>
            <div>
                <FaDocker size={30}/>
                <h1>DockerDesk</h1>
            </div>

            <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-green-500 text-white" } onClick={() => handleRun(image.repo_tag)}>
                <FaPlay />
                Run Image
            </button>
        </div>
    )
}

export default Navigation