"use client";

import { ArrowRightIcon, CreditCardIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import AnimationContainer from "@/app/features/linkify/components/global/animation-container";
import MaxWidthWrapper from "@/app/features/linkify/components/global/max-width-wrapper";
import PricingCards from "@/app/features/linkify/components/pricing-cards";
import { BentoCard, BentoGrid, CARDS } from "@/app/features/linkify/components/ui/bento-grid";
import { BorderBeam } from "@/app/features/linkify/components/ui/border-beam";
import { LampContainer } from "@/app/features/linkify/components/ui/lamp";
import MagicBadge from "@/app/features/linkify/components/ui/magic-badge";
import MagicCard from "@/app/features/linkify/components/ui/magic-card";
import { COMPANIES, PROCESS, REVIEWS } from "@/app/features/linkify/utils/constants/misc";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.enterprise"), href: "#process" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.resources"), href: "#reviews" },
    { label: t("nav.changelog"), href: "#cta" },
  ];

  const toggleLang = () => {
    const next = i18n.language === "ru" ? "en" : "ru";
    i18n.changeLanguage(next);
  };

  return (
    <div className="relative overflow-x-hidden scrollbar-hide size-full bg-background pt-14">
      {/* Grid + vignette background */}
      <div
        id="home"
        className="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl">
        <MaxWidthWrapper className="flex h-16 items-center justify-between text-sm">
          <Link href="/#home" className="flex items-center gap-2 font-semibold tracking-tight">
            <Image
              src="/images/favicon.png"
              alt="Easyble logo"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <span className="hidden sm:block">Easyble</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-muted-foreground">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleLang}
            >
              {t("nav.langToggle")}
            </Button>
            <Button asChild size="sm" className="shadow-[0_10px_40px_-15px_rgba(255,149,5,0.5)]">
              <Link href="/login" className="flex items-center gap-1.5">
                {t("hero.cta")}
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500 text-[12px] font-semibold text-white shadow-md shadow-amber-500/30">
                  ✦
                </span>
              </Link>
            </Button>
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        <div className="mt-14 flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background relative hero-grid">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.15),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_70%_at_50%_60%,rgba(80,120,255,0.25),rgba(140,70,255,0.18),transparent_70%)] blur-[110px]" />
          <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
            <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200 ring-1 ring-white/5 before:absolute before:inset-[-1px] before:rounded-full before:bg-[conic-gradient(from_90deg,rgba(255,170,64,0.7),rgba(156,64,255,0.7),rgba(255,170,64,0.7))] before:animate-[spin_6s_linear_infinite] before:blur-[2px] after:absolute after:inset-[1px] after:rounded-full after:bg-neutral-950">
              <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
              </span>
              <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
              <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
              <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                ✨ {t("hero.badge")}
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </span>
            </button>
            <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
              {t("hero.titlePrefix")}{" "}
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                {t("hero.titleHighlight")}
              </span>
            </h1>
            <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
              {t("hero.descLine1")}
              <br className="hidden md:block" />
              <span className="hidden md:block">{t("hero.descLine2")}</span>
            </p>
            <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
              <Button asChild>
                <Link href="/login" className="flex items-center">
                  {t("hero.cta")}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2} className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full">
            <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 blur-[5rem] animate-image-glow" />
            <div className="pointer-events-none absolute left-1/2 bottom-[-25%] -translate-x-1/2 w-[140%] h-[120%] blur-[120px] bg-[radial-gradient(ellipse_at_center,rgba(70,120,255,0.35),rgba(148,63,255,0.28),transparent_65%)]" />
            <div className="relative overflow-hidden -m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-transparent">
              <BorderBeam size={250} duration={12} delay={9} className="pointer-events-none" />
              <Image
                src="/assets/dashboard-dark.svg"
                alt="Dashboard"
                width={1200}
                height={1200}
                quality={100}
                className="rounded-md lg:rounded-xl bg-transparent ring-1 ring-border"
              />
              <div className="absolute -bottom-8 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
              <div className="absolute bottom-0 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper >

      <MaxWidthWrapper>
        <AnimationContainer delay={0.4}>
          <div className="py-14">
            <div className="mx-auto px-4 md:px-8">
              <h2 className="text-center text-sm font-medium font-heading text-neutral-400 uppercase">
                {t("companies.title")}
              </h2>
              <div className="mt-8">
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-16 justify-center">
                  {COMPANIES.map((company) => (
                    <li key={company.name}>
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={80}
                        height={80}
                        quality={100}
                        className="w-28 h-auto"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      <MaxWidthWrapper id="features" className="pt-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col w-full items-center lg:items-center justify-center py-8">
            <MagicBadge title={t("features.badge")} />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              {t("features.desc")}
            </p>
          </div>
        </AnimationContainer>
        <AnimationContainer delay={0.2}>
          <BentoGrid className="py-8">
            {CARDS.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </AnimationContainer>
      </MaxWidthWrapper>

      <MaxWidthWrapper id="process" className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title={t("process.badge")} />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              {t("process.title")}
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              {t("process.desc")}
            </p>
          </div>
        </AnimationContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
          {PROCESS.map((process, id) => (
            <AnimationContainer delay={0.2 * id} key={id}>
              <MagicCard className="group md:py-8">
                <div className="flex flex-col items-start justify-center w-full">
                  <process.icon strokeWidth={1.5} className="w-10 h-10 text-foreground" />
                  <div className="flex flex-col relative items-start">
                    <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                      {id + 1}
                    </span>
                    <h3 className="text-base mt-6 font-medium text-foreground">
                      {t(`process.step${id + 1}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`process.step${id + 1}.desc`)}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </AnimationContainer>
          ))}
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper id="pricing" className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title={t("pricing.badge")} />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              {t("pricing.title")}
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              {t("pricing.desc")}
            </p>
          </div>
        </AnimationContainer>
        <AnimationContainer delay={0.2}>
          <PricingCards />
        </AnimationContainer>
        <AnimationContainer delay={0.3}>
          <div className="flex flex-wrap items-start md:items-center justify-center lg:justify-evenly gap-6 mt-12 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-foreground" />
              <span className="text-muted-foreground">
                {t("pricing.credit")}
              </span>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      <MaxWidthWrapper id="reviews" className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title={t("reviews.badge")} />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              {t("reviews.title")}
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              {t("reviews.desc")}
            </p>
          </div>
        </AnimationContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 md:gap-8 py-10">
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(0, 3).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg font-medium text-muted-foreground">
                            {review.name}
                          </CardTitle>
                          <CardDescription>
                            {review.username}
                          </CardDescription>
                        </div>
                        {review.avatar && (
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={40}
                            height={40}
                            className="rounded-full ring-1 ring-border/60"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">
                        {review.review}
                      </p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(3, 6).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>
                        {review.username}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">
                        {review.review}
                      </p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(6, 9).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>
                        {review.username}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">
                        {review.review}
                      </p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper id="cta" className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <AnimationContainer delay={0.1}>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center">
                <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                  {t("cta.title")}
                </h2>
                <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                  {t("cta.desc")}
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/login">
                    {t("cta.button")}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
              </div>
            </div>
          </LampContainer>
        </AnimationContainer>
      </MaxWidthWrapper>

      <footer className="flex flex-col relative items-center justify-center border-t border-border pt-16 pb-12 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-24 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">
        <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full" />

        <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-start justify-start md:max-w-[200px]">
              <div className="flex items-start">
                <Image
                  src="/images/favicon.png"
                  alt="Easyble"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
              </div>
              <p className="text-muted-foreground mt-4 text-sm text-start">
                {t("footer.tagline")}
              </p>
              <span className="mt-4 text-neutral-200 text-sm flex items-center">
                {t("footer.madeBy")}
              </span>
            </div>
          </AnimationContainer>

          <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0 text-sm text-muted-foreground">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <AnimationContainer delay={0.2}>
                <div>
                  <h3 className="text-base font-medium text-white">
                    {t("footer.product")}
                  </h3>
                  <ul className="mt-4">
                    <li className="mt-2">
                      <Link href="#features" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.features")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="#pricing" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.pricing")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="#reviews" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.testimonials")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="#process" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.integration")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </AnimationContainer>
              <AnimationContainer delay={0.3}>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-base font-medium text-white">
                    {t("footer.integrations")}
                  </h3>
                  <ul className="mt-4">
                    <li className="">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.facebook")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.instagram")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.twitter")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.linkedin")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </AnimationContainer>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <AnimationContainer delay={0.4}>
                <div>
                  <h3 className="text-base font-medium text-white">
                    {t("footer.resources")}
                  </h3>
                  <ul className="mt-4">
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.blog")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.support")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </AnimationContainer>
              <AnimationContainer delay={0.5}>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-base font-medium text-white">
                    {t("footer.company")}
                  </h3>
                  <ul className="mt-4">
                    <li className="">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.about")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.privacy")}
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link href="/login" className="hover:text-foreground transition-all duration-300">
                        {t("footer.links.terms")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </AnimationContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 w-full text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Easyble. All rights reserved.
        </div>

        <div className="h-[20rem] lg:h-[20rem] hidden md:flex items-center justify-center w-full">
          <TextHoverEffect text="EASYBLE" />
        </div>
      </footer>
    </div>
  )
}
