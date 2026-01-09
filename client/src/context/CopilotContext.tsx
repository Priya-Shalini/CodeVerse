// import { ICopilotContext } from "@/types/copilot"
// import { createContext, ReactNode, useContext, useState } from "react"
// import toast from "react-hot-toast"
// import axiosInstance from "../api/pollinationsApi"

// const CopilotContext = createContext<ICopilotContext | null>(null)

// // eslint-disable-next-line react-refresh/only-export-components
// export const useCopilot = () => {
//     const context = useContext(CopilotContext)
//     if (context === null) {
//         throw new Error(
//             "useCopilot must be used within a CopilotContextProvider",
//         )
//     }
//     return context
// }

// const CopilotContextProvider = ({ children }: { children: ReactNode }) => {
//     const [input, setInput] = useState<string>("")
//     const [output, setOutput] = useState<string>("")
//     const [isRunning, setIsRunning] = useState<boolean>(false)

//     const generateCode = async () => {
//         try {
//             if (input.length === 0) {
//                 toast.error("Please write a prompt")
//                 return
//             }

//             toast.loading("Generating code...")
//             setIsRunning(true)
//             const response = await axiosInstance.post("/", {
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are a code generator assistant for a project named CodeVerse. Generate code based on the given prompt without any explanation. Return only the code, formatted in Markdown using the appropriate language syntax (e.g., js for JavaScript, py for Python). Do not include any additional text or explanations. If you don't know the answer, respond with 'I don't know'."

//                     },
//                     {
//                         role: "user",
//                         content: input,
//                     },
//                 ],
//                 model: "mistral",
//                 private: true,
//             })
//             if (response.data) {
//                 toast.success("Code generated successfully")
//                 const code = response.data
//                 if (code) setOutput(code)
//             }
//             setIsRunning(false)
//             toast.dismiss()
//         } catch (error) {
//             console.error(error)
//             setIsRunning(false)
//             toast.dismiss()
//             toast.error("Failed to generate the code")
//         }
//     }

//     return (
//         <CopilotContext.Provider
//             value={{
//                 setInput,
//                 output,
//                 isRunning,
//                 generateCode,
//             }}
//         >
//             {children}
//         </CopilotContext.Provider>
//     )
// }

// export { CopilotContextProvider }
// export default CopilotContext



import { ICopilotContext } from "@/types/copilot"
import { createContext, ReactNode, useContext, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

const CopilotContext = createContext<ICopilotContext | null>(null)

export const useCopilot = () => {
    const context = useContext(CopilotContext)
    if (!context) {
        throw new Error("useCopilot must be used within CopilotContextProvider")
    }
    return context
}

const CopilotContextProvider = ({ children }: { children: ReactNode }) => {
    const [input, setInput] = useState("")
    const [previewCode, setPreviewCode] = useState("") // 👈 LEFT PANEL PREVIEW
    const [output, setOutput] = useState("") // 👈 EDITOR INJECTION ONLY
    const [isRunning, setIsRunning] = useState(false)

    // 🔵 Generate code (PREVIEW ONLY)
    const generateCode = async () => {
        if (!input.trim()) {
            toast.error("Please write a prompt")
            return
        }

        try {
            setIsRunning(true)
            toast.loading("Generating code...")

            const response = await axios.post(
                "https://codeverse-6lz8.onrender.com/api/copilot",
                { prompt: input }
            )

            let code = response.data.code || ""

            // Safety: remove markdown if backend didn’t
            code = code
                .replace(/```[a-zA-Z]*\n?/g, "")
                .replace(/```/g, "")

            setPreviewCode(code) // ✅ ONLY PREVIEW
            toast.dismiss()
            toast.success("Code ready. Click Apply to insert.")
        } catch (err) {
            console.error(err)
            toast.dismiss()
            toast.error("Failed to generate code")
        } finally {
            setIsRunning(false)
        }
    }

    // 🔥 Manual apply (EDITOR ME TAB JAYEGA)
    const applyCodeToEditor = () => {
        if (!previewCode) return
        setOutput(previewCode)
        toast.success("Code applied to editor")
    }

    // 🧹 Optional: clear preview
    const clearPreview = () => {
        setPreviewCode("")
    }

    return (
        <CopilotContext.Provider
            value={{
                setInput,
                previewCode,
                output,
                isRunning,
                generateCode,
                applyCodeToEditor,
                clearPreview,
            }}
        >
            {children}
        </CopilotContext.Provider>
    )
}

export { CopilotContextProvider }
export default CopilotContext
