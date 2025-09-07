"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LayoutSettings } from "@/types/builder"
import { Grid, Rows, Columns, AlignLeft, AlignCenter, AlignRight, Maximize } from "lucide-react"

interface LayoutPanelProps {
    layout: LayoutSettings
    onUpdateLayout: (layout: LayoutSettings) => void
}

export function LayoutPanel({ layout, onUpdateLayout }: LayoutPanelProps) {
    const updateLayout = (key: keyof LayoutSettings, value: string) => {
        onUpdateLayout({
            ...layout,
            [key]: value,
        })
    }

    const layoutOptions = [
        { value: "stack", label: "Vertical Stack", icon: Rows },
        { value: "horizontal", label: "Horizontal", icon: Columns },
        { value: "grid-2", label: "Grid 2 Columns", icon: Grid },
        { value: "grid-3", label: "Grid 3 Columns", icon: Grid },
        { value: "grid-4", label: "Grid 4 Columns", icon: Grid },
    ]

    const gapOptions = [
        { value: "none", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
    ]

    const alignmentOptions = [
        { value: "start", label: "Start", icon: AlignLeft },
        { value: "center", label: "Center", icon: AlignCenter },
        { value: "end", label: "End", icon: AlignRight },
        { value: "stretch", label: "Stretch", icon: Maximize },
    ]

    const paddingOptions = [
        { value: "none", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-medium">Layout Type</Label>
                    <Select value={layout.type} onValueChange={(value) => updateLayout("type", value)}>
                        <SelectTrigger className="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {layoutOptions.map((option) => {
                                const Icon = option.icon
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-3 h-3" />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-medium">Gap</Label>
                    <Select value={layout.gap} onValueChange={(value) => updateLayout("gap", value)}>
                        <SelectTrigger className="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {gapOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-medium">Alignment</Label>
                    <Select value={layout.alignment} onValueChange={(value) => updateLayout("alignment", value)}>
                        <SelectTrigger className="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {alignmentOptions.map((option) => {
                                const Icon = option.icon
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-3 h-3" />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-medium">Padding</Label>
                    <Select value={layout.padding} onValueChange={(value) => updateLayout("padding", value)}>
                        <SelectTrigger className="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {paddingOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
