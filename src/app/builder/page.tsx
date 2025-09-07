"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { ComponentSchema, PageSchema, LayoutSettings } from "@/types/builder"
import { ComponentSidebar } from "@/components/builder/component-sidebar"
import { BuilderCanvas } from "@/components/builder/builder-canvas"
import { PropertiesPanel } from "@/components/builder/properties-panel"
import { SaveDialog } from "@/components/builder/save-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Save, Download, Upload } from "lucide-react"
import Link from "next/link"
import { getProject, updateProject, exportProject, importProject, type Project } from "@/lib/storage"

export default function BuilderPage() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("id")

    const [pageSchema, setPageSchema] = useState<PageSchema>({
        id: "page-1",
        name: "New Page",
        components: [],
        layout: {
            type: "stack",
            gap: "md",
            alignment: "stretch",
            padding: "md",
        },
        meta: {
            title: "New Page",
            description: "Created with Web Builder",
        },
    })

    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
    const [currentProject, setCurrentProject] = useState<Project | null>(null)
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Load project on mount if ID is provided
    useEffect(() => {
        if (projectId) {
            const project = getProject(projectId)
            if (project) {
                setPageSchema(project.schema)
                setCurrentProject(project)
                setHasUnsavedChanges(false)
            }
        }
    }, [projectId])

    // Track changes
    useEffect(() => {
        if (currentProject) {
            const hasChanges = JSON.stringify(pageSchema) !== JSON.stringify(currentProject.schema)
            setHasUnsavedChanges(hasChanges)
        }
    }, [pageSchema, currentProject])

    const addComponent = (componentSchema: ComponentSchema) => {
        setPageSchema((prev) => ({
            ...prev,
            components: [...prev.components, componentSchema],
        }))
    }

    const updateComponent = (id: string, updatedProps: Record<string, any>) => {
        setPageSchema((prev) => ({
            ...prev,
            components: prev.components.map((comp) => (comp.id === id ? { ...comp, props: updatedProps } : comp)),
        }))
    }

    const removeComponent = (id: string) => {
        setPageSchema((prev) => ({
            ...prev,
            components: prev.components.filter((comp) => comp.id !== id),
        }))
        setSelectedComponentId(null)
    }

    const reorderComponents = (startIndex: number, endIndex: number) => {
        setPageSchema((prev) => {
            const newComponents = [...prev.components]
            const [removed] = newComponents.splice(startIndex, 1)
            newComponents.splice(endIndex, 0, removed)
            return { ...prev, components: newComponents }
        })
    }

    const handleSave = (projectName?: string) => {
        if (currentProject) {
            // Update existing project
            const updatedProject = updateProject(currentProject.id, {
                name: projectName || currentProject.name,
                schema: pageSchema,
            })
            if (updatedProject) {
                setCurrentProject(updatedProject)
                setHasUnsavedChanges(false)
            }
        } else {
            // Show save dialog for new project
            setShowSaveDialog(true)
        }
    }

    const handleExport = () => {
        if (currentProject) {
            exportProject(currentProject)
        }
    }

    const handleImport = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".json"
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                try {
                    const project = await importProject(file)
                    setPageSchema(project.schema)
                    setCurrentProject(project)
                    setHasUnsavedChanges(false)
                } catch (error) {
                }
            }
        }
        input.click()
    }

    const updateLayout = (layout: LayoutSettings) => {
        setPageSchema((prev) => ({
            ...prev,
            layout,
        }))
    }

    return (
        <div className="h-screen flex bg-background">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="font-semibold">{pageSchema.name}</h1>
                        {hasUnsavedChanges && <span className="text-xs text-muted-foreground">• Unsaved changes</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleImport}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                    {currentProject && (
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={currentProject ? `/preview?id=${currentProject.id}` : "#"} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Link>
                    </Button>
                    <Button size="sm" onClick={() => handleSave()}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 pt-14">
                {/* Component Sidebar */}
                <ComponentSidebar />

                {/* Canvas Area */}
                <BuilderCanvas
                    components={pageSchema.components}
                    layout={pageSchema.layout}
                    selectedComponentId={selectedComponentId}
                    onAddComponent={addComponent}
                    onSelectComponent={setSelectedComponentId}
                    onUpdateComponent={updateComponent}
                    onRemoveComponent={removeComponent}
                    onReorderComponents={reorderComponents}
                />

                {/* Properties Panel */}
                <PropertiesPanel
                    selectedComponentId={selectedComponentId}
                    components={pageSchema.components}
                    layout={pageSchema.layout}
                    onUpdateComponent={updateComponent}
                    onUpdateLayout={updateLayout}
                    onSelectComponent={setSelectedComponentId}
                />
            </div>

            {/* Save Dialog */}
            <SaveDialog
                open={showSaveDialog}
                onOpenChange={setShowSaveDialog}
                pageSchema={pageSchema}
                onSave={(project) => {
                    setCurrentProject(project)
                    setHasUnsavedChanges(false)
                    setShowSaveDialog(false)
                }}
            />
        </div>
    )
}
