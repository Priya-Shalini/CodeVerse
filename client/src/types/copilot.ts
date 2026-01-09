// export interface ICopilotContext {
//     setInput: (input: string) => void
//     output: string
//     isRunning: boolean
//     generateCode: () => void
// }
export interface ICopilotContext {
    // Input
    setInput: (input: string) => void

    // Copilot states
    previewCode: string   // 👈 left panel preview
    output: string        // 👈 editor injection
    isRunning: boolean

    // Actions
    generateCode: () => Promise<void>
    applyCodeToEditor: () => void
    clearPreview: () => void
}