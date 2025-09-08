"use client"

import type React from "react"
import { useState } from "react"
import type { ComponentSchema, ComponentDefinition, LayoutSettings } from "@/types/builder"
import { ComponentRenderer } from "./component-renderer"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface BuilderCanvasProps {
    components: ComponentSchema[]
    layout: LayoutSettings
    selectedComponentId: string | null
    onAddComponent: (component: ComponentSchema, parentId?: string) => void
    onSelectComponent: (id: string | null) => void
    onUpdateComponent: (id: string, props: Record<string, any>) => void
    onRemoveComponent: (id: string) => void
    onReorderComponents: (startIndex: number, endIndex: number, parentId?: string) => void
}

interface NestedComponentProps {
    component: ComponentSchema
    index: number
    selectedComponentId: string | null
    onSelectComponent: (id: string | null) => void
    onRemoveComponent: (id: string) => void
    onAddComponent: (component: ComponentSchema, parentId?: string) => void
    onReorderComponents: (startIndex: number, endIndex: number, parentId?: string) => void
    parentId?: string
}

function NestedComponent({
    component,
    index,
    selectedComponentId,
    onSelectComponent,
    onRemoveComponent,
    onAddComponent,
    onReorderComponents,
    parentId,
}: NestedComponentProps) {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const isContainer = component.type === "container" || component.type === "section"

    const getContainerLayoutClasses = () => {
        const layout = component.props?.layout
        const gap = component.props?.gap
        const alignment = component.props?.alignment
        const justifyContent = component.props?.justifyContent
        const padding = component.props?.padding

        const layoutClasses: Record<string, string> = {
            horizontal: "flex flex-row",
            vertical: "flex flex-col",
            "grid-2": "grid grid-cols-1 md:grid-cols-2",
            "grid-3": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            wrap: "flex flex-wrap",
        }

        const gapClasses: Record<string, string> = {
            none: "gap-0",
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8",
        }

        const alignmentClasses: Record<string, string> = {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
        }

        const justifyClasses: Record<string, string> = {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
            around: "justify-around",
        }

        const paddingClasses: Record<string, string> = {
            none: "p-0",
            sm: "p-2",
            md: "p-4",
            lg: "p-6",
            xl: "p-8",
        }

        return `${layoutClasses[layout] || "flex flex-col"} ${gapClasses[gap] || "gap-4"} ${alignmentClasses[alignment] || "items-stretch"} ${justifyClasses[justifyContent] || "justify-start"} ${paddingClasses[padding] || "p-4"}`
    }

    const getContainerStyleClasses = () => {
        const backgroundColor = component.props?.backgroundColor
        const borderRadius = component.props?.borderRadius

        const bgClasses: Record<string, string> = {
            transparent: "bg-transparent",
            background: "bg-background",
            foreground: "bg-foreground",
            primary: "bg-primary",
            secondary: "bg-secondary",
            muted: "bg-muted",
            accent: "bg-accent",
        }

        const radiusClasses: Record<string, string> = {
            none: "rounded-none",
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full",
        }

        return `${bgClasses[backgroundColor] || ""} ${radiusClasses[borderRadius] || "rounded-none"}`
    }

    const getContainerInlineStyle = (): React.CSSProperties | undefined => {
        const backgroundColor = component.props?.backgroundColor as string | undefined
        if (!backgroundColor) return undefined
        const tokenBg = [
            "transparent",
            "background",
            "foreground",
            "primary",
            "secondary",
            "muted",
            "accent",
        ]
        const isToken = tokenBg.includes(backgroundColor)
        return isToken ? undefined : { backgroundColor }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const componentDefData = e.dataTransfer.getData("application/json")
        if (componentDefData && isContainer) {
            try {
                const componentDef: ComponentDefinition = JSON.parse(componentDefData)
                const newComponent: ComponentSchema = {
                    id: `${componentDef.type}-${Date.now()}`,
                    type: componentDef.type,
                    props: { ...componentDef.defaultProps },
                }
                onAddComponent(newComponent, component.id)
            } catch (error) {
                console.error("Error parsing component data:", error)
            }
        }
        setDragOverIndex(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        if (isContainer) {
            e.dataTransfer.dropEffect = "copy"
        }
    }

    const handleComponentDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ index, parentId }))
        e.dataTransfer.effectAllowed = "move"
    }

    const handleComponentDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()
        e.stopPropagation()

        const dragData = e.dataTransfer.getData("text/plain")
        if (dragData) {
            try {
                const { index: dragIndex, parentId: dragParentId } = JSON.parse(dragData)
                if (dragIndex !== dropIndex && dragParentId === parentId) {
                    onReorderComponents(dragIndex, dropIndex, parentId)
                }
            } catch (error) {
                console.error("Error parsing drag data:", error)
            }
        }
        setDragOverIndex(null)
    }

    return (
        <div
            className={cn(
                "group relative border-2 border-transparent rounded-lg transition-all",
                selectedComponentId === component.id && "border-primary",
                dragOverIndex === index && "border-blue-400 border-dashed",
            )}
            draggable
            onDragStart={handleComponentDragStart}
            onDrop={isContainer ? handleDrop : undefined}
            onDragOver={isContainer ? handleDragOver : undefined}
            onClick={(e) => {
                e.stopPropagation()
                onSelectComponent(component.id)
            }}
        >
            {/* Component Controls */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 bg-background border rounded-md shadow-sm">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-3 h-3" />
                    </Button>
                    {isContainer && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                // This will be handled by drag and drop from sidebar
                            }}
                            title="Drop components here"
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemoveComponent(component.id)
                        }}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {isContainer ? (
                <div
                    className={cn(
                        "min-h-[100px] border-2 border-dashed border-muted-foreground/25 rounded-lg",
                        component.children && component.children.length > 0 && "border-transparent",
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {component.children && component.children.length > 0 ? (
                        <div className={cn(getContainerLayoutClasses(), getContainerStyleClasses())} style={getContainerInlineStyle()}>
                            {component.children.map((child, childIndex) => (
                                <NestedComponent
                                    key={child.id}
                                    component={child}
                                    index={childIndex}
                                    selectedComponentId={selectedComponentId}
                                    onSelectComponent={onSelectComponent}
                                    onRemoveComponent={onRemoveComponent}
                                    onAddComponent={onAddComponent}
                                    onReorderComponents={onReorderComponents}
                                    parentId={component.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                            Drop components here
                        </div>
                    )}
                </div>
            ) : (
                <ComponentRenderer schema={component} />
            )}
        </div>
    )
}

export function BuilderCanvas({
    components,
    layout,
    selectedComponentId,
    onAddComponent,
    onSelectComponent,
    onRemoveComponent,
    onReorderComponents,
}: BuilderCanvasProps) {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const getLayoutClasses = () => {
        const gapClasses = {
            none: "gap-0",
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8",
        }

        const paddingClasses = {
            none: "p-0",
            sm: "p-4",
            md: "p-8",
            lg: "p-12",
            xl: "p-16",
        }

        const alignmentClasses = {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
        }

        let layoutClasses = ""

        switch (layout.type) {
            case "stack":
                layoutClasses = `flex flex-col ${alignmentClasses[layout.alignment]}`
                break
            case "horizontal":
                layoutClasses = `flex flex-row flex-wrap ${alignmentClasses[layout.alignment]}`
                break
            case "grid-2":
                layoutClasses = `grid grid-cols-1 md:grid-cols-2 ${alignmentClasses[layout.alignment]}`
                break
            case "grid-3":
                layoutClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${alignmentClasses[layout.alignment]}`
                break
            case "grid-4":
                layoutClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${alignmentClasses[layout.alignment]}`
                break
        }

        return `${layoutClasses} ${gapClasses[layout.gap]} ${paddingClasses[layout.padding]}`
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const componentDefData = e.dataTransfer.getData("application/json")

        if (componentDefData) {
            try {
                const componentDef: ComponentDefinition = JSON.parse(componentDefData)
                const newComponent: ComponentSchema = {
                    id: `${componentDef.type}-${Date.now()}`,
                    type: componentDef.type,
                    props: { ...componentDef.defaultProps },
                    children: componentDef.type === "container" || componentDef.type === "section" ? [] : undefined,
                }
                onAddComponent(newComponent)
            } catch (error) {
                console.error("Error parsing component data:", error)
            }
        }
        setDragOverIndex(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
    }

    return (
        <div className="flex-1 bg-background">
            <div
                className="min-h-full"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragOverIndex(null)}
            >
                {components.length === 0 ? (
                    <div className="h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center m-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🎨</div>
                            <h3 className="text-lg font-medium mb-2">Start Building</h3>
                            <p className="text-muted-foreground">Drag components from the sidebar to get started</p>
                        </div>
                    </div>
                ) : (
                    <div className={cn("min-h-full pb-40", getLayoutClasses())}>
                        {components.map((component, index) => (
                            <NestedComponent
                                key={component.id}
                                component={component}
                                index={index}
                                selectedComponentId={selectedComponentId}
                                onSelectComponent={onSelectComponent}
                                onRemoveComponent={onRemoveComponent}
                                onAddComponent={onAddComponent}
                                onReorderComponents={onReorderComponents}
                            />
                        ))}
                        {/* Extra spacer to make it easier to drop near the bottom */}
                        <div className="h-40" />
                    </div>
                )}
            </div>
        </div>
    )
}
