import type { ComponentSchema } from "@/types/builder"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ComponentRendererProps {
    schema: ComponentSchema
    isPreview?: boolean
    onUpdateComponent?: (id: string, props: Record<string, any>) => void
    variables?: Record<string, any>
    onVariableChange?: (name: string, value: any) => void
}

function getLayoutClasses(layout: string, gap: string, alignment: string, justifyContent: string, padding: string) {
    const layoutClasses = {
        horizontal: "flex flex-row",
        vertical: "flex flex-col",
        "grid-2": "grid grid-cols-1 md:grid-cols-2",
        "grid-3": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        wrap: "flex flex-wrap",
    }

    const gapClasses = {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
    }

    const alignmentClasses = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
    }

    const justifyClasses = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
    }

    const paddingClasses = {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
    }

    return `${layoutClasses[layout as keyof typeof layoutClasses]} ${gapClasses[gap as keyof typeof gapClasses]} ${alignmentClasses[alignment as keyof typeof alignmentClasses]} ${justifyClasses[justifyContent as keyof typeof justifyClasses]} ${paddingClasses[padding as keyof typeof paddingClasses]}`
}

function getStyleClasses(backgroundColor: string, borderRadius: string) {
    const bgClasses = {
        transparent: "bg-transparent",
        background: "bg-background",
        foreground: "bg-foreground",
        primary: "bg-primary",
        secondary: "bg-secondary",
        muted: "bg-muted",
        accent: "bg-accent",
    }

    const radiusClasses = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
    }

    return `${bgClasses[backgroundColor as keyof typeof bgClasses] || "bg-transparent"} ${radiusClasses[borderRadius as keyof typeof radiusClasses] || "rounded-none"}`
}

export function ComponentRenderer({ schema, isPreview = false, onUpdateComponent, variables, onVariableChange }: ComponentRendererProps) {
    const { type, props, children } = schema



    switch (type) {
        case "repeater":
            {
                const itemsVar: string = props.itemsVar || "items"
                const itemAlias: string = props.itemAlias || "item"
                const source = variables && Array.isArray((variables as any)[itemsVar]) ? (variables as any)[itemsVar] as any[] : []
                const offset: number = Number(props.offset || 0)
                const limit: number = Number(props.limit || 0)
                const sliced = source.slice(offset, limit > 0 ? offset + limit : undefined)

                const layoutClasses = {
                    horizontal: "flex flex-row",
                    vertical: "flex flex-col",
                    "grid-2": "grid grid-cols-1 md:grid-cols-2",
                    "grid-3": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                    wrap: "flex flex-wrap",
                }
                const gapClasses = { none: "gap-0", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8" }
                const alignmentClasses = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" }
                const justifyClasses = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around" }
                const paddingClasses = { none: "p-0", sm: "p-2", md: "p-4", lg: "p-6", xl: "p-8" }

                const containerClass = `${layoutClasses[props.layout as keyof typeof layoutClasses] || "flex flex-col"} ${gapClasses[props.gap as keyof typeof gapClasses] || "gap-4"} ${alignmentClasses[props.alignment as keyof typeof alignmentClasses] || "items-stretch"} ${justifyClasses[props.justifyContent as keyof typeof justifyClasses] || "justify-start"} ${paddingClasses[props.padding as keyof typeof paddingClasses] || "p-0"}`

                if (!children || children.length === 0) {
                    return <div className="p-4 text-muted-foreground">{props.emptyText || "No items"}</div>
                }

                return (
                    <div className={containerClass}>
                        {sliced.length === 0 ? (
                            <div className="text-muted-foreground">{props.emptyText || "No items"}</div>
                        ) : (
                            sliced.map((item, idx) => (
                                <div key={idx}>
                                    {children.map((child) => (
                                        <ComponentRenderer
                                            key={child.id}
                                            schema={child}
                                            isPreview={isPreview}
                                            onUpdateComponent={onUpdateComponent}
                                            variables={{ ...(variables || {}), [itemAlias]: item }}
                                            onVariableChange={onVariableChange}
                                        />
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                )
            }
        case "container":
            {
                const tokenBg = [
                    "transparent",
                    "background",
                    "foreground",
                    "primary",
                    "secondary",
                    "muted",
                    "accent",
                ]
                const needsInlineBg = props.backgroundColor && !tokenBg.includes(props.backgroundColor)
                const inlineStyle = needsInlineBg ? { backgroundColor: props.backgroundColor as string } : undefined
                return (
                    <div
                        className={`${getLayoutClasses(
                            props.layout,
                            props.gap,
                            props.alignment,
                            props.justifyContent,
                            props.padding,
                        )} ${getStyleClasses(props.backgroundColor, props.borderRadius)}`}
                        style={inlineStyle}
                    >
                        {children?.map((child) => (
                            <ComponentRenderer key={child.id} schema={child} isPreview={isPreview} onUpdateComponent={onUpdateComponent} variables={variables} onVariableChange={onVariableChange} />
                        ))}
                    </div>
                )
            }

        case "section":
            {
                const tokenBg = [
                    "transparent",
                    "background",
                    "foreground",
                    "primary",
                    "secondary",
                    "muted",
                    "accent",
                ]
                const needsInlineBg = props.backgroundColor && !tokenBg.includes(props.backgroundColor)
                const inlineStyle = needsInlineBg ? { backgroundColor: props.backgroundColor as string } : undefined
                return (
                    <section
                        className={`${getLayoutClasses(
                            props.layout,
                            props.gap,
                            props.alignment,
                            props.justifyContent,
                            props.padding,
                        )} ${getStyleClasses(props.backgroundColor, props.borderRadius)}`}
                        style={inlineStyle}
                    >
                        {props.showTitle && props.title && <h2 className="text-2xl font-bold mb-4">{props.title}</h2>}
                        {children?.map((child) => (
                            <ComponentRenderer key={child.id} schema={child} isPreview={isPreview} onUpdateComponent={onUpdateComponent} variables={variables} onVariableChange={onVariableChange} />
                        ))}
                    </section>
                )
            }

        case "hero":
            return (
                <section
                    className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
                    style={{ backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div
                        className={`relative z-10 text-center max-w-4xl mx-auto px-4 ${props.alignment === "left" ? "text-left" : props.alignment === "right" ? "text-right" : "text-center"
                            }`}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{props.title}</h1>
                        <p className="text-xl text-white/90 mb-8">{props.subtitle}</p>
                        <Button size="lg" asChild>
                            <a href={isPreview ? props.buttonLink : "#"}>{props.buttonText}</a>
                        </Button>
                    </div>
                </section>
            )

        case "text":
            {
                const tokenColor = ["foreground", "primary", "secondary", "muted", "accent"]
                const useInline = props.customColor && props.customColor !== "" && !tokenColor.includes(props.customColor)
                const style = useInline ? { color: props.customColor as string } : undefined
                const colorClass = tokenColor.includes(props.color) ? `text-${props.color}` : ""
                const variablePattern = /\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g
                const resolvePath = (obj: any, path: string) => {
                    if (!obj || !path) return undefined
                    const parts = path.split(".")
                    let curr = obj
                    for (const part of parts) {
                        if (curr && Object.prototype.hasOwnProperty.call(curr, part)) {
                            curr = curr[part]
                        } else {
                            return undefined
                        }
                    }
                    return curr
                }
                const resolvedContent = typeof props.content === "string"
                    ? props.content.replace(variablePattern, (_match: string, varName: string) => {
                        let value: any = undefined
                        if (variables) {
                            value = resolvePath(variables, varName)
                        }
                        return value !== undefined && value !== null ? String(value) : ""
                    })
                    : props.content
                let isVariable = variablePattern.test(props.content)
                return (
                    <div className={`text-${props.fontSize} text-${props.textAlign} ${colorClass} p-4`} style={style}>
                        {
                            resolvedContent != "" ? <div dangerouslySetInnerHTML={{ __html: String(resolvedContent).replace(/\n/g, "<br>") }} /> : isVariable ? !isPreview ? <div>Text set from a variable</div> : <></> : <></>
                        }
                    </div>
                )
            }

        case "button":
            {
                const radiusClasses: Record<string, string> = {
                    none: "rounded-none",
                    sm: "rounded-sm",
                    md: "rounded-md",
                    lg: "rounded-lg",
                    full: "rounded-full",
                }
                const inlineStyle: React.CSSProperties = {
                    color: props.textColor || undefined,
                    backgroundColor: props.backgroundColor || undefined,
                    borderWidth: props.borderWidth ? Number(props.borderWidth) : undefined,
                    borderColor: props.borderColor || undefined,
                    borderStyle: props.borderWidth ? "solid" : undefined,
                }
                return (
                    <div className="p-4">
                        <Button
                            variant={props.variant}
                            size={props.size}
                            asChild
                            className={radiusClasses[props.borderRadius || "md"]}
                            style={inlineStyle}
                        >
                            <a href={isPreview ? props.link : "#"}>{props.text}</a>
                        </Button>
                    </div>
                )
            }

        case "image":
            if (props.mode === "fill") {
                return (
                    <div className="relative w-full h-full min-h-[200px]">
                        <Image
                            src={props.src || "/placeholder.svg"}
                            alt={props.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={`${props.rounded ? "rounded-lg" : ""} object-${props.objectFit || "cover"}`}
                        />
                    </div>
                )
            }
            return (
                <div className="p-4">
                    <Image
                        src={props.src || "/placeholder.svg"}
                        alt={props.alt}
                        width={props.width}
                        height={props.height}
                        className={`${props.rounded ? "rounded-lg" : ""} object-${props.objectFit || "cover"}`}
                    />
                </div>
            )

        case "card":
            {
                const radiusClasses: Record<string, string> = {
                    none: "rounded-none",
                    sm: "rounded-sm",
                    md: "rounded-md",
                    lg: "rounded-lg",
                    xl: "rounded-xl",
                    full: "rounded-full",
                }
                const shadowClasses: Record<string, string> = {
                    none: "shadow-none",
                    sm: "shadow-sm",
                    md: "shadow",
                    lg: "shadow-lg",
                }
                const paddingClasses: Record<string, string> = {
                    none: "p-0",
                    sm: "p-2",
                    md: "p-4",
                    lg: "p-6",
                    xl: "p-8",
                }
                const bgToken = props.backgroundColor || "card"
                const bgClass = bgToken ? `bg-${bgToken}` : "bg-card"
                const borderClass = props.bordered ? "border" : "border-0"
                const cardClass = `${bgClass} ${borderClass} ${radiusClasses[props.rounded || "xl"]} ${shadowClasses[props.shadow || "sm"]}`
                const contentPaddingClass = paddingClasses[props.contentPadding || "md"]
                console.log(cardClass)

                return (
                    <div className="p-4">
                        <div className={cardClass}>
                            <div className={contentPaddingClass}>
                                {children?.map((child) => (
                                    <ComponentRenderer key={child.id} schema={child} isPreview={isPreview} onUpdateComponent={onUpdateComponent} variables={variables} onVariableChange={onVariableChange} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

        case "input":
            return (
                <div className="p-4">
                    <Input
                        type={props.type}
                        placeholder={props.placeholder}
                        value={
                            isPreview && variables && props.name && Object.prototype.hasOwnProperty.call(variables, props.name)
                                ? variables[props.name]
                                : props.value || ""
                        }
                        name={props.name}
                        readOnly={!isPreview}
                        onChange={isPreview ? (e) => {
                            console.log("onChange", e.target.value)
                            console.log("props.name", props.name)
                            const newValue = e.target.value
                            if (props.name && onVariableChange) {
                                onVariableChange(props.name, newValue)
                            }
                        } : undefined}
                    />
                </div>
            )

        default:
            return <div className="p-4 border-2 border-dashed border-gray-300 text-center">Unknown component: {type}</div>
    }
}
