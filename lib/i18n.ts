"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        features: "Features",
        enterprise: "Enterprise",
        pricing: "Pricing",
        resources: "Resources",
        changelog: "Changelog",
        langToggle: "Рус / Eng",
      },
      hero: {
        badge: "Build empathy smarter",
        titlePrefix: "Being empathetic is",
        titleHighlight: "Easyble",
        descLine1: "Keep every teammate on the same page — learn, feel, and ship products your users love.",
        descLine2: "One place to capture feedback, align the team, and act fast together.",
        cta: "Start creating for free",
      },
      companies: {
        title: "Trusted by teams who build with heart",
      },
      features: {
        badge: "Features",
        title: "Empathy tools for fast-moving teams",
        desc: "Easyble keeps discovery, feedback, and delivery in one flow so product, design, and engineering stay aligned.",
      },
      process: {
        badge: "The Process",
        title: "Align your team in 3 simple steps",
        desc: "Capture insights, turn them into decisions, and keep everyone synced without extra meetings.",
        step1: {
          title: "Speak your task",
          desc: "Voice your idea or issue and let Easyble convert it to a task instantly.",
        },
        step2: {
          title: "See it neatly in your list",
          desc: "Get a clean, structured card with details ready for review.",
        },
        step3: {
          title: "Send to your backlog",
          desc: "Push the ready task into your board with one click.",
        },
      },
      pricing: {
        badge: "Simple Pricing",
        title: "Choose a plan that works for your team",
        desc: "Start with Easyble today and unlock advanced collaboration when you're ready.",
        credit: "No credit card required",
      },
      reviews: {
        badge: "Our Customers",
        title: "What our users are saying",
        desc: "Teams rely on Easyble to keep feedback, decisions, and delivery in sync.",
      },
      cta: {
        title: "Step into the future of empathetic product teams",
        desc: "Easyble keeps customer signals, team alignment, and execution flowing in one place—so you ship what people truly need.",
        button: "Get started for free",
      },
      footer: {
        tagline: "Stay close to your users, ship with confidence.",
        madeBy: "Made by Easyble",
        product: "Product",
        integrations: "Integrations",
        resources: "Resources",
        company: "Company",
        links: {
          features: "Features",
          pricing: "Pricing",
          testimonials: "Testimonials",
          integration: "Integration",
          facebook: "Facebook",
          instagram: "Instagram",
          twitter: "Twitter",
          linkedin: "LinkedIn",
          blog: "Blog",
          support: "Support",
          about: "About Us",
          privacy: "Privacy Policy",
          terms: "Terms & Conditions",
        },
      },
    },
  },
  ru: {
    translation: {
      nav: {
        features: "Возможности",
        enterprise: "Для компаний",
        pricing: "Тарифы",
        resources: "Ресурсы",
        changelog: "Изменения",
        langToggle: "Rus / Eng",
      },
      hero: {
        badge: "Создавайте эмпатию осознанно",
        titlePrefix: "Быть эмпатичным — это",
        titleHighlight: "Easyble",
        descLine1: "Держите команду на одной волне — изучайте, чувствуйтесь и выпускайте продукты, которые любят пользователи.",
        descLine2: "Одно место, чтобы собирать обратную связь, синхронизировать команду и действовать быстро.",
        cta: "Начать бесплатно",
      },
      companies: {
        title: "Нам доверяют команды, которые строят с заботой",
      },
      features: {
        badge: "Возможности",
        title: "Инструменты эмпатии для быстрых команд",
        desc: "Easyble объединяет исследования, фидбек и delivery в одном потоке, чтобы продукт, дизайн и разработка оставались согласованными.",
      },
      process: {
        badge: "Процесс",
        title: "Согласуйте команду в 3 шага",
        desc: "Собирайте инсайты, превращайте их в решения и держите всех в синхронизации без лишних встреч.",
        step1: {
          title: "Наговорите задачу",
          desc: "Проговорите идею или проблему, и Easyble сразу создаст задачу.",
        },
        step2: {
          title: "Получите удобный список",
          desc: "Готовая карточка с деталями появляется в аккуратном списке.",
        },
        step3: {
          title: "Отправьте в задачник",
          desc: "За один клик отправьте задачу в нужную колонку бэклога.",
        },
      },
      pricing: {
        badge: "Простые тарифы",
        title: "Выберите план под вашу команду",
        desc: "Начните с Easyble уже сегодня и подключайте расширенную коллаборацию, когда потребуется.",
        credit: "Без привязки карты",
      },
      reviews: {
        badge: "Наши клиенты",
        title: "Что говорят пользователи",
        desc: "Команды полагаются на Easyble, чтобы держать фидбек, решения и поставку в одном потоке.",
      },
      cta: {
        title: "Будущее эмпатичных продуктовых команд",
        desc: "Easyble собирает сигналы пользователей, выравнивает команду и обеспечивает исполнение — так вы создаёте то, что действительно нужно людям.",
        button: "Начать бесплатно",
      },
      footer: {
        tagline: "Будьте ближе к пользователям и выпускайте уверенно.",
        madeBy: "Сделано в Easyble",
        product: "Продукт",
        integrations: "Интеграции",
        resources: "Ресурсы",
        company: "Компания",
        links: {
          features: "Функции",
          pricing: "Тарифы",
          testimonials: "Отзывы",
          integration: "Интеграции",
          facebook: "Facebook",
          instagram: "Instagram",
          twitter: "Twitter",
          linkedin: "LinkedIn",
          blog: "Блог",
          support: "Поддержка",
          about: "О нас",
          privacy: "Политика конфиденциальности",
          terms: "Условия использования",
        },
      },
    },
  },
};

export const initI18n = () => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  }
  return i18n;
};

export default i18n;
