import type { ComponentSchema } from "@/types/builder"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ComponentRendererProps {
    schema: ComponentSchema
    isPreview?: boolean
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

export function ComponentRenderer({ schema, isPreview = false }: ComponentRendererProps) {
    const { type, props, children } = schema

    switch (type) {
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
                            <ComponentRenderer key={child.id} schema={child} isPreview={isPreview} />
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
                            <ComponentRenderer key={child.id} schema={child} isPreview={isPreview} />
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
                return (
                    <div className={`text-${props.fontSize} text-${props.textAlign} ${colorClass} p-4`} style={style}>
                        <div dangerouslySetInnerHTML={{ __html: props.content.replace(/\n/g, "<br>") }} />
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
                console.log(props.backgroundColor)
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

        default:
            return <div className="p-4 border-2 border-dashed border-gray-300 text-center">Unknown component: {type}</div>
    }
}
