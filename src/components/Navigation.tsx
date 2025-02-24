import { FaDocker, FaBox, FaImage } from "react-icons/fa";
import React from "react";

interface NavProps {
    activeTab: "containers" | "images";
    setActiveTab: (activeTab: "containers" | "images") => void;
}

const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="flex items-center justify-between p-4 bg-slate-800 shadow-lg">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                <FaDocker className="text-blue-400 w-8 h-8" />
                <h1 className="text-xl font-bold text-white">DockerDesk</h1>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
            ${activeTab === "containers"
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white hover:bg-green-600"}`}
                    onClick={() => setActiveTab("containers")}
                >
                    <FaBox className="w-4 h-4" />
                    Containers
                </button>

                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
            ${activeTab === "images"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    onClick={() => setActiveTab("images")}
                >
                    <FaImage className="w-4 h-4" />
                    Images
                </button>
            </div>
        </nav>
    );
};

export default Navigation;