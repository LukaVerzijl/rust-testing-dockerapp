import React, {useEffect, useRef} from "react";

interface TerminalProps{
    logs: string[]
}

const Terminal: React.FC<TerminalProps> = ({logs}) => {

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current){
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [logs])

    return(
        <div className={"flex flex-1 flex-col border border-gray-300 rounded bg-gray-200 text-white p-2.5 max-h-[500px] overflow-hidden"} >
            <h3 className={"text-lg mb-2 text-white"}>Logs</h3>
            <div className={"flex-1 overflow-y-auto bg-gray-200 p-2.5 rounded font-mono text-green-500"} ref={ref}>
                {logs.map((log: string, index: number) => (
                    <pre className={"m-0 whitespace-pre-wrap break-words"} key={index}>{log}</pre>
                ))}
            </div>
        </div>
    )
}

export default Terminal