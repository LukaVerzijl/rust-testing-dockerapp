import './App.css'
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation.tsx";
import ContainerList from "./components/ContainerList.tsx";
import ImageList from "./components/ImageList.tsx";
import {load, Store} from '@tauri-apps/plugin-store';
import Onboarding from "./components/Onboarding.tsx";

export default function App() {
    const [activeTab, setActiveTab] = useState<"containers" | "images">("containers");
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
    const [store, setStore] = useState<any>(null); // Store needs to be loaded asynchronously

    useEffect(() => {
        const initStore = async () => {
            const loadedStore = await load('store.json', { autoSave: false });
            setStore(loadedStore);
            checkFirstLaunch(loadedStore);
        };

        initStore();
    }, []);

    const checkFirstLaunch = async (storeInstance: Store) => {
        const firstLaunch = await storeInstance.get<{ firstlaunch: boolean }>("firstLaunch");

        if (!firstLaunch || firstLaunch.firstlaunch === undefined) {
            await storeInstance.set("firstLaunch", { firstlaunch: true });
            await storeInstance.save();
            setIsFirstLaunch(true);
        } else {
            setIsFirstLaunch(true);
        }
    };

    const handleOnboardingComplete = async () => {
        if (store) {
            await store.set("firstLaunch", { firstlaunch: false });
            await store.save();
        }
        setIsFirstLaunch(false);
    };

    if (isFirstLaunch === null || store === null) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            {isFirstLaunch ? (
                <Onboarding onComplete={handleOnboardingComplete} />
            ) : (
                <>
                    <Navigation
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        checkFirstLaunch={() => checkFirstLaunch(store)}
                        setIsFirstLaunch={setIsFirstLaunch}
                    />
                    <main className="flex-grow">
                        {activeTab === "containers" ? <ContainerList /> : <ImageList />}
                    </main>
                </>
            )}
        </div>
    );
}
