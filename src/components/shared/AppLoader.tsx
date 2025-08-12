
import { Logo } from "@/components/shared/Logo";

export function AppLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="animate-pulse">
                <Logo />
            </div>
        </div>
    )
}
