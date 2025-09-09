"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DataDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    variables: Record<string, any>
    onSave: (vars: Record<string, any>) => void
}

export function DataDialog({ open, onOpenChange, variables, onSave }: DataDialogProps) {
    const [jsonText, setJsonText] = useState<string>("{}")
    const [error, setError] = useState<string>("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (open) {
            setJsonText(JSON.stringify(variables ?? {}, null, 2))
            setError("")
            setIsSaving(false)
        }
    }, [open, variables])

    const isValid = useMemo(() => {
        try {
            const parsed = JSON.parse(jsonText || "{}")
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return true
            }
            setError("Root must be an object")
            return false
        } catch (e: any) {
            setError(e?.message || "Invalid JSON")
            return false
        }
    }, [jsonText])

    const handleSave = () => {
        if (!isValid) return
        setIsSaving(true)
        try {
            const parsed = JSON.parse(jsonText || "{}") as Record<string, any>
            onSave(parsed)
            onOpenChange(false)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Data Sources</DialogTitle>
                    <DialogDescription>
                        Define variables as JSON. Example: {`{"posts": [{"id": "1", "title": "Hello"}]}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="data-json">Variables (JSON)</Label>
                        <Textarea
                            id="data-json"
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            rows={16}
                            className="font-mono text-sm"
                        />
                        {error && <div className="text-sm text-red-600">{error}</div>}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!isValid || isSaving}>{isSaving ? "Saving..." : "Save Data"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


