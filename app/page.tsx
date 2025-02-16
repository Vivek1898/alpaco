"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Brain, LineChart, Lock, Sparkles, ChevronRight, Zap, Shield } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                    <Link href={"/"}>
                    <div className="flex items-center gap-2">

                        <Zap className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">Alpaco</span>

                    </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        {/*<Link href="/dashboard">*/}
                        {/*    <Button variant="ghost" className="text-base">Login</Button>*/}
                        {/*</Link>*/}
                        <Link href="/dashboard">
                            <Button className="text-base px-6">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-36 pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">AI-Powered Market Analysis</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                            Master the Markets with{" "}
                            <span className="text-primary relative inline-block">
                                Intelligent Analysis
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.5C1 10.5 63.5 1.5 159.5 1.5C255.5 1.5 317 10.5 317 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Harness the power of AI to gain real-time market insights. Make data-driven decisions with advanced analytics and predictive intelligence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="gap-2 px-8 h-12 text-base w-full sm:w-auto">
                                    Start Trading <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base w-full sm:w-auto">
                                    Watch Demo <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-6">
                            Intelligent Analysis at Your Fingertips
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Our comprehensive suite of tools empowers you to make informed decisions with confidence.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <FeatureCard
                            icon={<Brain className="h-8 w-8" />}
                            title="Deep-Dive Analysis"
                            description="Advanced AI agents provide comprehensive market insights and trend analysis for informed decision-making."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-8 w-8" />}
                            title="Real-time Monitoring"
                            description="Stay ahead with live market data, sentiment analysis, and instant alerts on key indicators."
                        />
                        <FeatureCard
                            icon={<LineChart className="h-8 w-8" />}
                            title="Predictive Analytics"
                            description="Leverage machine learning algorithms to forecast market trends and identify opportunities."
                        />
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl font-bold leading-tight">
                                Enterprise-grade Security You Can Trust
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Your security is our top priority. We implement industry-leading encryption and security measures to protect your data and transactions.
                            </p>
                            <div className="grid gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                                    <Shield className="h-8 w-8 text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Advanced Encryption</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Military-grade 256-bit encryption for all data transmissions and storage
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                                    <Lock className="h-8 w-8 text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Secure Authentication</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Multi-factor authentication and biometric security options
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 flex items-center justify-center p-8">
                                <div className="relative w-full h-full">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Lock className="h-24 w-24 text-primary" />
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,white_70%)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8 max-w-3xl mx-auto text-primary-foreground">
                        <h2 className="text-4xl font-bold">
                            Ready to Transform Your Trading Strategy?
                        </h2>
                        <p className="text-xl opacity-90">
                            Join thousands of traders who are already leveraging AI-powered market intelligence.
                        </p>
                        <div className="pt-4">
                            <Link href="/dashboard">
                                <Button size="lg" variant="secondary" className="gap-2 px-8 h-12 text-base">
                                    Get Started Now <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <span className="font-semibold">Alpaco</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2025 Alpaco. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
                         icon,
                         title,
                         description,
                     }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-8 rounded-xl bg-background border group hover:shadow-lg transition-all duration-300">
            <div className="mb-6 text-primary bg-primary/5 w-14 h-14 rounded-lg flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}