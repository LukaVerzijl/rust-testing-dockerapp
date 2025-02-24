import { FaDocker, FaBox, FaImage } from "react-icons/fa";
import React, { useEffect } from "react";
import { load } from "@tauri-apps/plugin-store";

interface NavProps {
    activeTab: "containers" | "images";
    setActiveTab: (activeTab: "containers" | "images") => void;
    checkFirstLaunch: () => void;
    setIsFirstLaunch: (isFirstLaunch: boolean) => void;
}

const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab, checkFirstLaunch, setIsFirstLaunch }) => {
    useEffect(() => {
        const loadStore = async () => {
            const store = await load('store.json', { autoSave: false });

            // Function to reset onboarding
            const resetOnboarding = async () => {
                await store.set('firstlaunch', { firstlaunch: true });
                await store.save();
                setIsFirstLaunch(true);
                checkFirstLaunch();
            };

            // Attach reset function to window for debugging
            (window as any).resetOnboarding = resetOnboarding;
        };

        loadStore();
    }, [setIsFirstLaunch, checkFirstLaunch]);

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
                        ${activeTab === "containers" ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"}`}
                    onClick={() => setActiveTab("containers")}
                >
                    <FaBox className="w-4 h-4" />
                    Containers
                </button>

                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
                        ${activeTab === "images" ? "bg-blue-600 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    onClick={() => setActiveTab("images")}
                >
                    <FaImage className="w-4 h-4" />
                    Images
                </button>

                {/*<button*/}
                {/*    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 bg-blue-500 text-white"*/}
                {/*    onClick={() => {*/}
                {/*        (window as any).resetOnboarding();*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <FaHome className="w-4 h-4" />*/}
                {/*    Show onboarding*/}
                {/*</button>*/}
            </div>
        </nav>
    );
};

export default Navigation;
