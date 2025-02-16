import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}