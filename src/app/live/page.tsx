"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { PageSchema } from "@/types/builder"
import { ComponentRenderer } from "@/components/builder/component-renderer"
import { getProject } from "@/lib/storage"
import { cn } from "@/lib/utils"

export default function LivePage() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("id")
    const [pageSchema, setPageSchema] = useState<PageSchema | null>(null)
    const [variables, setVariables] = useState<Record<string, any>>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (projectId) {
            const project = getProject(projectId)
            if (project) {
                setPageSchema(project.schema)
                setVariables(project.schema.variables || {})
            }
        }
        setIsLoading(false)
    }, [projectId])

    const getLayoutClasses = () => {
        if (!pageSchema?.layout) return "space-y-4"

        const { type, gap, alignment, padding } = pageSchema.layout

        const gapClasses = { none: "gap-0", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8" }
        const paddingClasses = { none: "p-0", sm: "p-4", md: "p-8", lg: "p-12", xl: "p-16" }
        const alignmentClasses = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" }

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
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    if (!pageSchema) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Not Found</h1>
                    <p className="text-muted-foreground mb-6">The requested project could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="min-h-screen">
                <head>
                    <title>{pageSchema.meta.title}</title>
                    <meta name="description" content={pageSchema.meta.description} />
                </head>
                <div className={cn("min-h-screen", getLayoutClasses())}>
                    {pageSchema.components.map((component) => (
                        <ComponentRenderer
                            key={component.id}
                            schema={component}
                            isPreview={true}
                            variables={variables}
                            onVariableChange={() => { }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}


