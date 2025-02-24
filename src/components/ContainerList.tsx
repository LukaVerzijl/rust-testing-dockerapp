import React, {useEffect, useState} from "react";
import {Channel, invoke} from "@tauri-apps/api/core";
import {FaPause, FaStop, FaTerminal} from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import Terminal from "./Terminal.tsx";

interface Container {
    id: string;
    name: string;
    status: string;
    state: string;
}

const ContainerList : React.FC = () => {
    const [containers, setContainers] = useState<Container[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [showLogs, setShowLogs] = useState<boolean>(false);

    const getContainers = async () => {
        try {
            const res :Container[] = await invoke("list_containers");
            setContainers(res)
        } catch (e) {
            console.error(e);
        }
    }

    const handleKill = async (id: string) => {
        try {
            await invoke("kill_container", {name: id});
            getContainers();
        } catch (e) {
            console.error(e);
        }
    }
    const handleStop = async (id: string) => {
        try {
            await invoke("stop_container", {name: id});
            getContainers();
        } catch (e) {
            console.error(e);
        }
    }

    const handleLogs = async (id: string) => {
        try {
            const EventChannel = new Channel<string>();
            EventChannel.onmessage = (message) => {
                setLogs((prevlogs =>[...prevlogs, message]));
            }

            await invoke("emit_log", {name: id, onEvent: EventChannel})
            setShowLogs(true);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getContainers()
    }, []);

    return(
        <div className={'p-5'}>
            <h2 className={'font-bold'}>Containers</h2>
            <div className={'flex flex-col gap-3 text-white'}>
                {containers.map((container) => (
                    <div key={container.id} className={'flex justify-between items-center p-3 border rounded bg-gray-100'}>
                        <div>
                            <h3>{container.name}</h3>
                            <p>Status: {container.status}</p>
                            <p>State: {container.state}</p>
                        </div>

                        <div className={'flex gap-3'}>
                            <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-orange-500 text-white" } onClick={() => handleStop(container.name)}>
                                <FaStop />
                                Stop
                            </button>
                            <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-red-900 text-white" } onClick={() => handleKill(container.name)}>
                                <FaPause />
                                Kill
                            </button>
                            <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-blue-500 text-white" } onClick={() => handleLogs(container.name)}>
                                <FaTerminal />
                                Logs
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            {showLogs && (
                <div className={'fixed top-0 left-0 w-full h-full flex justify-center items-center z-[1000] bg-black/70 overflow-hidden flex flex-col max-h-[80%]'}>
                    <div className={'text-white p-5 border rounded w-4/5 '}>
                        <Terminal logs={logs} />

                        <button className={"flex items-center gap-2 px-4 py-2 rounded cursor-pointer bg-blue-500 text-white" } onClick={() => {setLogs([]); setShowLogs(false)}}>
                            <FaX />
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContainerList;