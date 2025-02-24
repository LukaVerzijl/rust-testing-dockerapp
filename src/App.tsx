import './App.css'
import React, {useState} from "react";
import Navigation from "./components/Navigation.tsx";
import ContainerList from "./components/ContainerList.tsx";
import ImageList from "./components/ImageList.tsx";


const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"containers" | "images">("containers")

    return (
        <div className={"flex flex-col height-full"}>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div>
                {activeTab === "containers" ? <ContainerList /> : <ImageList />}
            </div>
        </div>
    )
}

export default App;