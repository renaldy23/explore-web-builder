"use client"

import type React from "react"

import { getComponentsByCategory } from "@/lib/component-registry"
import type { ComponentDefinition } from "@/types/builder"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ComponentSidebar() {
    const componentsByCategory = getComponentsByCategory()

    const handleDragStart = (e: React.DragEvent, componentDef: ComponentDefinition) => {
        e.dataTransfer.setData("application/json", JSON.stringify(componentDef))
        e.dataTransfer.effectAllowed = "copy"
    }

    return (
        <div className="w-80 border-r bg-muted/30">
            <div className="p-4 border-b">
                <h2 className="font-semibold">Components</h2>
                <p className="text-sm text-muted-foreground">Drag components to canvas</p>
            </div>

            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="p-4 space-y-6">
                    {Object.entries(componentsByCategory).map(([category, components]) => (
                        <div key={category}>
                            <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">{category}</h3>
                            <div className="space-y-2">
                                {components.map((componentDef) => (
                                    <Card
                                        key={componentDef.type}
                                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, componentDef)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{componentDef.icon}</span>
                                                <div>
                                                    <div className="font-medium text-sm">{componentDef.name}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
