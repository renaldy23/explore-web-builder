"use client"

import { useState } from "react"
import type { ComponentSchema, LayoutSettings } from "@/types/builder"
import { getComponentDefinition } from "@/lib/component-registry"
import { LayoutPanel } from "./layout-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Settings } from "lucide-react"

interface PropertiesPanelProps {
    selectedComponentId: string | null
    components: ComponentSchema[]
    layout: LayoutSettings
    onUpdateComponent: (id: string, props: Record<string, any>) => void
    onUpdateLayout: (layout: LayoutSettings) => void
    onSelectComponent: (id: string | null) => void
}

export function PropertiesPanel({
    selectedComponentId,
    components,
    layout,
    onUpdateComponent,
    onUpdateLayout,
    onSelectComponent,
}: PropertiesPanelProps) {
    const selectedComponent = components.find((comp) => comp.id === selectedComponentId)
    const componentDef = selectedComponent ? getComponentDefinition(selectedComponent.type) : null

    const [localProps, setLocalProps] = useState<Record<string, any>>(selectedComponent?.props || {})

    // Update local props when selected component changes
    if (selectedComponent && JSON.stringify(localProps) !== JSON.stringify(selectedComponent.props)) {
        setLocalProps(selectedComponent.props)
    }

    const handlePropChange = (key: string, value: any) => {
        const newProps = { ...localProps, [key]: value }
        setLocalProps(newProps)
        if (selectedComponentId) {
            onUpdateComponent(selectedComponentId, newProps)
        }
    }

    const renderPropInput = (propSchema: any) => {
        const { key, label, type, options, defaultValue } = propSchema
        const currentValue = localProps[key] ?? defaultValue

        switch (type) {
            case "text":
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Input
                            id={key}
                            value={currentValue || ""}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    </div>
                )

            case "number":
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Input
                            id={key}
                            type="number"
                            value={currentValue || ""}
                            onChange={(e) => handlePropChange(key, Number(e.target.value))}
                        />
                    </div>
                )

            case "select":
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Select value={currentValue} onValueChange={(value) => handlePropChange(key, value)}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {options?.map((option: string) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )

            case "boolean":
                return (
                    <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key}>{label}</Label>
                        <Switch
                            id={key}
                            checked={currentValue || false}
                            onCheckedChange={(checked) => handlePropChange(key, checked)}
                        />
                    </div>
                )

            case "color":
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <div className="flex gap-2">
                            <Input
                                id={key}
                                value={currentValue || ""}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                placeholder="Enter color"
                            />
                            <input
                                type="color"
                                value={currentValue?.startsWith("#") ? currentValue : "#000000"}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-12 h-10 border rounded cursor-pointer"
                            />
                        </div>
                    </div>
                )

            case "image":
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Input
                            id={key}
                            value={currentValue || ""}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                            placeholder="Enter image URL"
                        />
                        {currentValue && (
                            <div className="mt-2">
                                <img
                                    src={currentValue || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-20 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="w-80 border-l bg-muted/30">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Properties
                </h2>
                {selectedComponent && (
                    <Button variant="ghost" size="sm" onClick={() => onSelectComponent(null)}>
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="p-4 space-y-6">
                    <LayoutPanel layout={layout} onUpdateLayout={onUpdateLayout} />

                    {selectedComponent && componentDef ? (
                        <>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <span className="text-lg">{componentDef.icon}</span>
                                        {componentDef.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {componentDef.propSchema.map((propSchema) => renderPropInput(propSchema))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Component Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="font-mono">{selectedComponent.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ID:</span>
                                        <span className="font-mono text-xs">{selectedComponent.id}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <div className="text-4xl mb-4">⚙️</div>
                            <p>Select a component to edit its properties</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
