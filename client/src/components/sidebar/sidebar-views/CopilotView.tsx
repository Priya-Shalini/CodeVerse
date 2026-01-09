// import { useCopilot } from "@/context/CopilotContext"
// import { useFileSystem } from "@/context/FileContext"
// import { useSocket } from "@/context/SocketContext"
// import useResponsive from "@/hooks/useResponsive"
// import { SocketEvent } from "@/types/socket"
// import toast from "react-hot-toast"
// import { LuClipboardPaste, LuCopy, LuRepeat } from "react-icons/lu"
// import ReactMarkdown from "react-markdown"
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

// function CopilotView() {
//     const {socket} = useSocket()
//     const { viewHeight } = useResponsive()
//     const { generateCode, output, isRunning, setInput } = useCopilot()
//     const { activeFile, updateFileContent, setActiveFile } = useFileSystem()

//     const copyOutput = async () => {
//         try {
//             const content = output.replace(/```[\w]*\n?/g, "").trim()
//             await navigator.clipboard.writeText(content)
//             toast.success("Output copied to clipboard")
//         } catch (error) {
//             toast.error("Unable to copy output to clipboard")
//             console.log(error)
//         }
//     }

//     const pasteCodeInFile = () => {
//         if (activeFile) {
//             const fileContent = activeFile.content
//                 ? `${activeFile.content}\n`
//                 : ""
//             const content = `${fileContent}${output.replace(/```[\w]*\n?/g, "").trim()}`
//             updateFileContent(activeFile.id, content)
//             // Update the content of the active file if it's the same file
//             setActiveFile({ ...activeFile, content })
//             toast.success("Code pasted successfully")
//             // Emit the FILE_UPDATED event to the server
//             socket.emit(SocketEvent.FILE_UPDATED, {
//                 fileId: activeFile.id,
//                 newContent: content,
//             })
//         }
//     }

//     const replaceCodeInFile = () => {
//         if (activeFile) {
//             const isConfirmed = confirm(
//                 `Are you sure you want to replace the code in the file?`,
//             )
//             if (!isConfirmed) return
//             const content = output.replace(/```[\w]*\n?/g, "").trim()
//             updateFileContent(activeFile.id, content)
//             // Update the content of the active file if it's the same file
//             setActiveFile({ ...activeFile, content })
//             toast.success("Code replaced successfully")
//             // Emit the FILE_UPDATED event to the server
//             socket.emit(SocketEvent.FILE_UPDATED, {
//                 fileId: activeFile.id,
//                 newContent: content,
//             })
//         }
//     }

//     return (
//         <div
//             className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
//             style={{ height: viewHeight }}
//         >
//             <h1 className="view-title">Copilot</h1>
//             <textarea
//                 className="min-h-[120px] w-full rounded-md border-none bg-darkHover p-2 text-white outline-none"
//                 placeholder="What code do you want to generate?"
//                 onChange={(e) => setInput(e.target.value)}
//             />
//             <button
//                 className="mt-1 flex w-full justify-center rounded-md bg-primary p-2 font-bold text-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                 onClick={generateCode}
//                 disabled={isRunning}
//             >
//                 {isRunning ? "Generating..." : "Generate Code"}
//             </button>
//             {output && (
//                 <div className="flex justify-end gap-4 pt-2">
//                     <button title="Copy Output" onClick={copyOutput}>
//                         <LuCopy
//                             size={18}
//                             className="cursor-pointer text-white"
//                         />
//                     </button>
//                     <button
//                         title="Replace code in file"
//                         onClick={replaceCodeInFile}
//                     >
//                         <LuRepeat
//                             size={18}
//                             className="cursor-pointer text-white"
//                         />
//                     </button>
//                     <button
//                         title="Paste code in file"
//                         onClick={pasteCodeInFile}
//                     >
//                         <LuClipboardPaste
//                             size={18}
//                             className="cursor-pointer text-white"
//                         />
//                     </button>
//                 </div>
//             )}
//             <div className="h-full rounded-lg w-full overflow-y-auto p-0">
//                 <ReactMarkdown
//                     components={{
//                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                         code({ inline, className, children, ...props }: any) {
//                             const match = /language-(\w+)/.exec(className || "")
//                             const language = match ? match[1] : "javascript" // Default to JS

//                             return !inline ? (
//                                 <SyntaxHighlighter
//                                     style={dracula}
//                                     language={language}
//                                     PreTag="pre"
//                                     className="!m-0 !h-full !rounded-lg !bg-gray-900 !p-2"
//                                 >
//                                     {String(children).replace(/\n$/, "")}
//                                 </SyntaxHighlighter>
//                             ) : (
//                                 <code className={className} {...props}>
//                                     {children}
//                                 </code>
//                             )
//                         },
//                         pre({ children }) {
//                             return <pre className="h-full">{children}</pre>
//                         },
//                     }}
//                 >
//                     {output}
//                 </ReactMarkdown>
//             </div>
//         </div>
//     )
// }

// export default CopilotView

import { useCopilot } from "@/context/CopilotContext"
import { useFileSystem } from "@/context/FileContext"
import useResponsive from "@/hooks/useResponsive"
import toast from "react-hot-toast"
import {
   // LuCheck,
    LuTrash2,
    LuClipboardPaste,
    LuCopy,
} from "react-icons/lu"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

function CopilotView() {
    const { viewHeight } = useResponsive()

    const {
        generateCode,
        isRunning,
        setInput,
        previewCode,
        clearPreview,
    } = useCopilot()

    const { activeFile, updateFileContent, setActiveFile } = useFileSystem()

    const cleanCode = previewCode?.trim() ?? ""

    /* 📄 COPY */
    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(cleanCode)
            toast.success("Code copied to clipboard")
        } catch {
            toast.error("Failed to copy code")
        }
    }

    /* 📋 PASTE */
    const pasteCode = () => {
        if (!activeFile) {
            toast.error("No active file")
            return
        }

        const content = activeFile.content
            ? `${activeFile.content}\n${cleanCode}`
            : cleanCode

        updateFileContent(activeFile.id, content)
        setActiveFile({ ...activeFile, content })

        toast.success("Code pasted into file")
    }

    /* ✔ REPLACE */
    /*
    const replaceCode = () => {
        if (!activeFile) {
            toast.error("No active file")
            return
        }

        const confirmed = confirm(
            "Are you sure you want to replace the entire file?",
        )
        if (!confirmed) return

        updateFileContent(activeFile.id, cleanCode)
        setActiveFile({ ...activeFile, content: cleanCode })

        toast.success("Code replaced successfully")
    }
        */

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title">Copilot</h1>

            {/* PROMPT INPUT */}
            <textarea
                className="min-h-[120px] w-full rounded-md border-none bg-darkHover p-2 text-white outline-none"
                placeholder="What code do you want to generate?"
                onChange={(e) => setInput(e.target.value)}
            />

            {/* GENERATE BUTTON */}
            <button
                className="mt-1 flex w-full justify-center rounded-md bg-primary p-2 font-bold text-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={generateCode}
                disabled={isRunning}
            >
                {isRunning ? "Generating..." : "Generate"}
            </button>

            {/* PREVIEW */}
            {previewCode && (
                <>
                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-4 pt-2">
                        <button title="Copy" onClick={copyCode}>
                            <LuCopy
                                size={18}
                                className="cursor-pointer text-white"
                            />
                        </button>

                        <button title="Paste" onClick={pasteCode}>
                            <LuClipboardPaste
                                size={18}
                                className="cursor-pointer text-white"
                            />
                        </button>

                        {/* <button title="Replace" onClick={replaceCode}>
                            <LuCheck
                                size={18}
                                className="cursor-pointer text-green-400"
                            />
                        </button> */}

                        <button title="Clear preview" onClick={clearPreview}>
                            <LuTrash2
                                size={18}
                                className="cursor-pointer text-red-400"
                            />
                        </button>
                    </div>

                    {/* CODE PREVIEW */}
                    <div className="h-full w-full overflow-y-auto rounded-lg bg-gray-900 p-2">
                        <SyntaxHighlighter
                            style={dracula}
                            language="cpp"
                            PreTag="pre"
                        >
                            {cleanCode}
                        </SyntaxHighlighter>
                    </div>
                </>
            )}
        </div>
    )
}

export default CopilotView