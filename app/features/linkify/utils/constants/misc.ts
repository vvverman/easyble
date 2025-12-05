import { BarChart3Icon, FolderOpenIcon, WandSparklesIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    {
        name: "Asana",
        logo: "/assets/company-01.svg",
    },
    {
        name: "Tidal",
        logo: "/assets/company-02.svg",
    },
    {
        name: "Innovaccer",
        logo: "/assets/company-03.svg",
    },
    {
        name: "Linear",
        logo: "/assets/company-04.svg",
    },
    {
        name: "Raycast",
        logo: "/assets/company-05.svg",
    },
    {
        name: "Labelbox",
        logo: "/assets/company-06.svg",
    }
] as const;

export const PROCESS = [
    {
        title: "Organize Your Links",
        description: "Efficiently categorize and tag your links for quick access and easy management.",
        icon: FolderOpenIcon,
    },
    {
        title: "Shorten and Customize",
        description: "Create concise, branded links that are easy to share and track.",
        icon: WandSparklesIcon,
    },
    {
        title: "Analyze and Optimize",
        description: "Gain insights into link performance and optimize for better engagement.",
        icon: BarChart3Icon,
    },
] as const;

export const FEATURES = [
    {
        title: "Link shortening",
        description: "Create short links that are easy to remember and share.",
    },
    {
        title: "Advanced analytics",
        description: "Track and measure the performance of your links.",
    },
    {
        title: "Password protection",
        description: "Secure your links with a password.",
    },
    {
        title: "Custom QR codes",
        description: "Generate custom QR codes for your links.",
    },
    {
        title: "Link expiration",
        description: "Set an expiration date for your links.",
    },
    {
        title: "Team collaboration",
        description: "Share links with your team and collaborate in real-time.",
    },
] as const;

export const REVIEWS = [
    {
        name: "Mark Ivanov",
        username: "Flowline (Product Lead)",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        rating: 5,
        review: "Мы начали озвучивать идеи прямо на летучках — Easyble сразу превращает речь в задачи. Команда видит их в бэклоге через минуту, ни одной потерянной инициативы за квартал."
    },
    {
        name: "Anna Petrova",
        username: "Nimbus Support (Head of CS)",
        avatar: "https://randomuser.me/api/portraits/women/21.jpg",
        rating: 5,
        review: "Подключили поддержку: операторы диктуют проблемы клиентов, Easyble сам расставляет теги и дедлайны. SLA по колонкам — теперь тишина в почте и чёткие сроки."
    },
    {
        name: "Alex Carter",
        username: "Craftable (Founder)",
        avatar: "https://randomuser.me/api/portraits/men/31.jpg",
        rating: 4,
        review: "Голосом описываю фичу — через пару секунд у нас карточка с чек-листом и автоназначением. Экспорт в webhook кормит CI, меньше ручных этапов."
    },
    {
        name: "Victor Levin",
        username: "CargoFox (Ops)",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        rating: 5,
        review: "Диспетчеры диктуют с дороги, Easyble сам понимает колонку и сроки. Архивирование по правилам — старые заявки не засоряют борды."
    },
    {
        name: "Maria Novak",
        username: "PeopleFirst (HRD)",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        rating: 4,
        review: "Мы диктуем заметки с собеседований, Easyble собирает их в один список и раскладывает по колонкам. Экономим время на протоколах."
    },
    {
        name: "Daniel Kim",
        username: "BrightDrive (Delivery Lead)",
        avatar: "https://randomuser.me/api/portraits/men/51.jpg",
        rating: 5,
        review: "Раньше записывал в Telegram, теперь говорю в Easyble — задачи появляются в нужной колонке, команда получает напоминания. Скорость закрытия выросла."
    },
    {
        name: "Elena Brooks",
        username: "Healthly (COO)",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        rating: 5,
        review: "AI-резюме и теги помогают мгновенно понять суть. Внутренние созвоны стали короче — задачи уже структурированы к концу встречи."
    },
    {
        name: "Pavel Orlov",
        username: "FinEdge (CTO)",
        avatar: "https://randomuser.me/api/portraits/men/61.jpg",
        rating: 4,
        review: "Подружили Easyble с вебхуками — задачи уходят в git-борд. Автоназначение по ключевым словам снимает рутину с тимлидов."
    },
    {
        name: "Nadia Collins",
        username: "StudioNorth (PM)",
        avatar: "https://randomuser.me/api/portraits/women/55.jpg",
        rating: 5,
        review: "Я диктую backlog по пути в офис, Easyble разбрасывает задачи по колонкам и ставит дедлайны. Команда просыпается уже с готовым планом."
    },
] as const;
