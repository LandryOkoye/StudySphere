import { cn } from "@/lib/utils"

interface LogoProps {
    variant?: "transparent" | "white"
    className?: string
}

export function Logo({ variant = "transparent", className }: LogoProps) {
    // We use standard <img> with an onError fallback so the build doesn't crash 
    // if the user hasn't explicitly saved the logo images to the public folder yet.
    // The user has uploaded StudySphere_Logo2.png and wants it used globally.
    const src = "/StudySphere_Logo2.png"

    return (
        <div className={cn("relative flex items-center justify-center shrink-0", className)}>
            <img
                src={src}
                alt="StudySphere Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                    // Fallback if the logo files are missing from the public folder
                    e.currentTarget.src = "/placeholder-logo.png"
                }}
            />
        </div>
    )
}
