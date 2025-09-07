"use client"

import { useState } from "react"
import type { PageSchema } from "@/types/builder"
import { saveProject, type Project } from "@/lib/storage"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SaveDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    pageSchema: PageSchema
    onSave: (project: Project) => void
}

export function SaveDialog({ open, onOpenChange, pageSchema, onSave }: SaveDialogProps) {
    const [projectName, setProjectName] = useState(pageSchema.name)
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        if (!projectName.trim()) return

        setIsLoading(true)
        try {
            const project = saveProject({
                name: projectName.trim(),
                schema: {
                    ...pageSchema,
                    name: projectName.trim(),
                    meta: {
                        ...pageSchema.meta,
                        title: projectName.trim(),
                        description: description.trim() || pageSchema.meta.description,
                    },
                },
            })
            onSave(project)
        } catch (error) {
            console.error("Failed to save project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save Project</DialogTitle>
                    <DialogDescription>Give your project a name and description to save it.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter project name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter project description"
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!projectName.trim() || isLoading}>
                        {isLoading ? "Saving..." : "Save Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
