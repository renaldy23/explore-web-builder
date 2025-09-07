"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { PageSchema } from "@/types/builder"
import { ComponentRenderer } from "@/components/builder/component-renderer"
import { getProject } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Monitor, Tablet, Smartphone } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type ViewportSize = "desktop" | "tablet" | "mobile"

const viewportSizes = {
    desktop: { width: "100%", maxWidth: "none" },
    tablet: { width: "768px", maxWidth: "768px" },
    mobile: { width: "375px", maxWidth: "375px" },
}

export default function PreviewPage() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("id")
    const [pageSchema, setPageSchema] = useState<PageSchema | null>(null)
    const [viewport, setViewport] = useState<ViewportSize>("desktop")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (projectId) {
            const project = getProject(projectId)
            if (project) {
                setPageSchema(project.schema)
            }
        }
        setIsLoading(false)
    }, [projectId])

    const getLayoutClasses = () => {
        if (!pageSchema?.layout) return "space-y-4"

        const { type, gap, alignment, padding } = pageSchema.layout

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

        switch (type) {
            case "stack":
                layoutClasses = `flex flex-col ${alignmentClasses[alignment]}`
                break
            case "horizontal":
                layoutClasses = `flex flex-row flex-wrap ${alignmentClasses[alignment]}`
                break
            case "grid-2":
                layoutClasses = `grid grid-cols-1 md:grid-cols-2 ${alignmentClasses[alignment]}`
                break
            case "grid-3":
                layoutClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${alignmentClasses[alignment]}`
                break
            case "grid-4":
                layoutClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${alignmentClasses[alignment]}`
                break
        }

        return `${layoutClasses} ${gapClasses[gap]} ${paddingClasses[padding]}`
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading preview...</p>
                </div>
            </div>
        )
    }

    if (!pageSchema) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Preview Not Found</h1>
                    <p className="text-muted-foreground mb-6">The requested project could not be found.</p>
                    <Button asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Preview Header */}
            <div className="sticky top-0 z-50 bg-background border-b px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={projectId ? `/builder?id=${projectId}` : "/builder"}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Editor
                            </Link>
                        </Button>
                        <div>
                            <h1 className="font-semibold">{pageSchema.name}</h1>
                            <p className="text-xs text-muted-foreground">Preview Mode</p>
                        </div>
                    </div>

                    {/* Viewport Controls */}
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                        <Button
                            variant={viewport === "desktop" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewport("desktop")}
                            className="h-8"
                        >
                            <Monitor className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewport === "tablet" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewport("tablet")}
                            className="h-8"
                        >
                            <Tablet className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewport === "mobile" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewport("mobile")}
                            className="h-8"
                        >
                            <Smartphone className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex justify-center p-4">
                <div
                    className={cn(
                        "transition-all duration-300 bg-white shadow-lg rounded-lg overflow-hidden",
                        viewport !== "desktop" && "border",
                    )}
                    style={viewportSizes[viewport]}
                >
                    <div className="min-h-screen bg-white">
                        {/* SEO Meta Preview */}
                        <head>
                            <title>{pageSchema.meta.title}</title>
                            <meta name="description" content={pageSchema.meta.description} />
                        </head>

                        {/* Rendered Components */}
                        {pageSchema.components.length === 0 ? (
                            <div className="min-h-screen flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">📄</div>
                                    <p>No components to preview</p>
                                </div>
                            </div>
                        ) : (
                            <div className={cn("min-h-screen", getLayoutClasses())}>
                                {pageSchema.components.map((component) => (
                                    <ComponentRenderer key={component.id} schema={component} isPreview={true} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
