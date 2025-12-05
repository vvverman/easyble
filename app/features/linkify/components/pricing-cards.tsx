"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PLANS } from "@/app/features/linkify/utils/constants/pricing";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Tab = "monthly" | "yearly";

const PricingCards = () => {

    const MotionTabTrigger = motion(TabsTrigger);

    const [activeTab, setActiveTab] = useState<Tab>("monthly");

    return (
        <Tabs defaultValue="monthly" className="w-full flex flex-col items-center justify-center">
            <TabsList className="bg-transparent">
                <MotionTabTrigger
                    value="monthly"
                    onClick={() => setActiveTab("monthly")}
                    className="relative px-4 py-2 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
                >
                    {activeTab === "monthly" && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            transition={{
                                type: "spring",
                                bounce: 0.5,
                            }}
                            className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-md z-10 border border-white/10"
                        />
                    )}
                    <span className="z-20">
                        Monthly
                    </span>
                </MotionTabTrigger>
                <MotionTabTrigger
                    value="yearly"
                    onClick={() => setActiveTab("yearly")}
                    className="relative px-4 py-2 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
                >
                    {activeTab === "yearly" && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            transition={{
                                type: "spring",
                                bounce: 0.5,
                            }}
                            className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-md z-10 border border-white/10"
                        />
                    )}
                    <span className="z-20">
                        Yearly
                    </span>
                </MotionTabTrigger>
            </TabsList>

            <TabsContent value="monthly" className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-wrap max-w-6xl mx-auto pt-6 border-0">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "flex flex-col w-full rounded-2xl border border-white/10 bg-[#0f0f0f] text-foreground shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)] overflow-hidden py-0 gap-0",
                            plan.name === "Pro" && "border-2 border-purple-500"
                        )}
                    >
                        <CardHeader
                            className={cn(
                                "border-b border-white/10 rounded-t-2xl pt-6",
                                plan.name === "Pro" ? "bg-[#1a0f2b]" : "bg-[#111]"
                            )}
                        >
                            <CardTitle className={cn(plan.name !== "Pro" && "text-neutral-200", "text-lg font-medium")}>
                                {plan.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                {plan.info}
                            </CardDescription>
                            <h5 className="text-4xl font-semibold">
                                ${plan.price.monthly}
                                <span className="text-base text-muted-foreground font-normal">
                                    {plan.name !== "Free" ? "/month" : ""}
                                </span>
                            </h5>
                        </CardHeader>
                        <CardContent className="pt-4 pb-6 space-y-4 text-sm">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <p className={cn(feature.tooltip && "border-b !border-dashed border-white/20 cursor-pointer")}>
                                                    {feature.text}
                                                </p>
                                            </TooltipTrigger>
                                            {feature.tooltip && (
                                                <TooltipContent>
                                                    <p>{feature.tooltip}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="w-full mt-auto px-6 pb-6 pt-0">
                            <Link
                                href={plan.btn.href}
                                style={{ width: "100%" }}
                                className={cn(
                                    "h-12 rounded-lg text-base font-semibold border border-white/10 bg-white text-neutral-900 transition hover:bg-white/90 flex items-center justify-center",
                                    plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/90 text-white border-purple-500"
                                )}
                            >
                                {plan.btn.text}
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </TabsContent>
            <TabsContent value="yearly" className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-wrap max-w-6xl mx-auto pt-6 border-0">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "flex flex-col w-full rounded-2xl border border-white/10 bg-[#0f0f0f] text-foreground shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)] overflow-hidden py-0 gap-0",
                            plan.name === "Pro" && "border-2 border-purple-500"
                        )}
                    >
                        <CardHeader
                            className={cn(
                                "border-b border-white/10 rounded-t-2xl pt-6",
                                plan.name === "Pro" ? "bg-[#1a0f2b]" : "bg-[#111]"
                            )}
                        >
                            <CardTitle className={cn(plan.name !== "Pro" && "text-neutral-200", "text-lg font-medium")}>
                                {plan.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                {plan.info}
                            </CardDescription>
                            <h5 className="text-4xl font-semibold flex items-end">
                                ${plan.price.yearly}
                                <div className="text-base text-muted-foreground font-normal">
                                    {plan.name !== "Free" ? "/year" : ""}
                                </div>
                                {plan.name !== "Free" && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                                        className="px-2 py-0.5 ml-2 rounded-md bg-purple-500 text-foreground text-sm font-medium"
                                    >
                                        -12%
                                    </motion.span>
                                )}
                            </h5>
                        </CardHeader>
                        <CardContent className="pt-4 pb-6 space-y-4 text-sm">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <p className={cn(feature.tooltip && "border-b !border-dashed border-border cursor-pointer")}>
                                                    {feature.text}
                                                </p>
                                            </TooltipTrigger>
                                            {feature.tooltip && (
                                                <TooltipContent>
                                                    <p>{feature.tooltip}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="w-full mt-auto px-6 pb-6 pt-0">
                            <Link
                                href={plan.btn.href}
                                style={{ width: "100%" }}
                                className={cn(
                                    "h-12 rounded-lg text-base font-semibold border border-white/10 bg-white text-neutral-900 transition hover:bg-white/90 flex items-center justify-center",
                                    plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/90 text-white border-purple-500"
                                )}
                            >
                                {plan.btn.text}
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </TabsContent>
        </Tabs>
    )
};

export default PricingCards
