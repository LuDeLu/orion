import type { AreaTexts } from "./types"

export const areasEn: AreaTexts = {
  marketing: {
    name: "Marketing",
    navLabel: "Marketing",
    teaser: "Get found, get chosen, get remembered. Online and on the street.",
    chips: ["Social", "Paid media", "Outdoor", "Branding", "Events", "PR"],
    owner: { role: "Founding partner", title: "Head of Marketing", area: "Marketing & strategy" },
    hero: {
      eyebrow: "Marketing area",
      titleStart: "Full-service marketing,",
      titleHighlight: "from the feed to the billboard",
      subtitle:
        "Strategy, brand, content, paid media and traditional advertising under one plan. Whether your customer finds you on Instagram, on a roadside billboard or through a referral, we treat every touchpoint as one system.",
      bullets: [
        "Free assessment before any proposal",
        "Digital and traditional in the same plan",
        "Clear reports with real metrics",
      ],
    },
    problems: [
      {
        title: "You spend on advertising and can't tell what works",
        description:
          "You put money into social, Google and a billboard, and have no way of knowing which one brought the customer. We measure each channel separately and show you the real cost per enquiry.",
      },
      {
        title: "Your brand doesn't look like what you sell",
        description:
          "The product is good but the communication doesn't convey it. We align identity, message and presence so perception matches the quality of your work.",
      },
      {
        title: "Enquiries come in, but not the ones you want",
        description:
          "Volume without quality is noise. We tune targeting, message and filters so the people who contact you are the ones who can actually buy.",
      },
    ],
    families: {
      estrategia: {
        title: "Strategy and consulting",
        summary: "The plan before the execution. Where you stand and where it makes sense to go.",
        items: [
          "Initial brand and business assessment",
          "Annual marketing plan",
          "Positioning and value proposition",
          "Buyer persona definition",
          "Market research",
          "Competitor analysis and benchmarking",
          "Brand architecture and sub-brands",
          "Goal and KPI definition",
          "Strategic consulting by the hour",
          "Product launch plan",
          "Pricing and promotion strategy",
          "Audit of existing communications",
        ],
      },
      branding: {
        title: "Branding and identity",
        summary: "How your brand looks, sounds and is applied across every surface.",
        items: [
          "Naming and concept development",
          "Logo and symbol design",
          "Brand guidelines and usage rules",
          "Rebranding and identity refresh",
          "Full visual system (palette, typography, grids)",
          "Corporate stationery",
          "Packaging and label design",
          "Signage and wayfinding",
          "Uniforms and branded apparel",
          "Sonic identity and jingles",
          "Digital brand book for teams",
          "Fleet and storefront applications",
        ],
      },
      redes: {
        title: "Social media and content",
        summary: "The day-to-day of your channels, with content built to sell, not just to fill.",
        items: [
          "Daily community management",
          "Strategic editorial calendar",
          "Posts, reels and stories production",
          "Copywriting and scripts",
          "Instagram, Facebook and TikTok management",
          "Corporate LinkedIn management",
          "YouTube and Pinterest management",
          "Message and comment handling",
          "UGC content production",
          "Influencer and micro-influencer campaigns",
          "Contests and giveaways",
          "Reach and engagement reporting",
        ],
      },
      paid: {
        title: "Paid media",
        summary: "Advertising managed around cost per enquiry, not likes.",
        items: [
          "Meta Ads (Facebook and Instagram)",
          "Google Ads: Search, Display and Performance Max",
          "Google Shopping and catalogue campaigns",
          "YouTube Ads",
          "TikTok Ads",
          "LinkedIn Ads for B2B",
          "Spotify and podcast advertising",
          "Remarketing and lookalike audiences",
          "Campaign-specific landing pages",
          "A/B testing of creatives and copy",
          "Ad budget management",
          "Weekly optimisation and spend control",
        ],
      },
      seo: {
        title: "SEO and search presence",
        summary: "Get found when someone searches for what you sell, without paying per click.",
        items: [
          "Technical SEO audit",
          "On-page optimisation and content structure",
          "Local SEO and Google Business Profile",
          "Content and blog strategy",
          "Link building and digital PR",
          "Review management and online reputation",
          "Optimisation for AI search",
          "E-commerce and product page SEO",
          "Ranking and organic traffic monitoring",
        ],
      },
      tradicional: {
        title: "Traditional and outdoor advertising",
        summary:
          "Advertising off-screen: street, highway, radio, TV and print. We handle space, production and installation.",
        items: [
          "Billboards and outdoor hoardings",
          "LED screens and digital out-of-home",
          "Bus, metro and train advertising",
          "Bus shelters and street furniture",
          "Storefront signage and awnings",
          "Large-format prints, banners and vinyl",
          "Vehicle and fleet wrapping",
          "Flyering, leaflets and door drops",
          "Radio advertising and spot production",
          "Broadcast and cable TV spots",
          "Newspaper and trade magazine ads",
          "Highway and access-road advertising",
          "Street banners, flags and balloons",
          "Cinema and sports venue advertising",
          "Media space negotiation and buying",
        ],
      },
      btl: {
        title: "BTL, events and experiential",
        summary: "For when the brand has to show up in person.",
        items: [
          "Brand activations",
          "Full event and launch production",
          "Trade show stands and exhibitions",
          "Brand ambassadors and street teams",
          "Sampling and tastings",
          "Point-of-sale campaigns",
          "Merchandise and corporate gifts",
          "Venue styling and brand environments",
          "Event catering, sound and lighting",
          "Event photo and video coverage",
        ],
      },
      prensa: {
        title: "PR and media relations",
        summary: "Getting talked about in the places that matter for you.",
        items: [
          "Press release writing and distribution",
          "Journalist and media relations",
          "Interview management and spokesperson training",
          "Sponsored content and advertorials",
          "Reputation and crisis management",
          "Local and regional press coverage",
          "Presence in trade and industry media",
        ],
      },
      crm: {
        title: "CRM, retention and automation",
        summary: "What happens after the first contact, which is where most sales are lost.",
        items: [
          "Email marketing and newsletters",
          "WhatsApp Business and broadcast campaigns",
          "Lead nurturing automation",
          "Loyalty and points programmes",
          "Satisfaction surveys and NPS",
          "Database segmentation and cleaning",
          "Win-back campaigns for lapsed customers",
          "Integration with the CRM you already use",
        ],
      },
      audiovisual: {
        title: "Video production and photography",
        summary: "Original material, no generic stock imagery.",
        items: [
          "Professional product photography",
          "E-commerce packshots",
          "Location, site and team photography",
          "Corporate video",
          "Reels and vertical content",
          "Advertising spots",
          "Drone filming",
          "Voice-over and narration",
          "Motion graphics and animation",
          "Editing and post-production",
          "Event photography",
        ],
      },
      medicion: {
        title: "Measurement and analytics",
        summary: "Without this, everything above is just opinion.",
        items: [
          "Monthly performance reports",
          "Live marketing dashboards",
          "Google Analytics and Tag Manager",
          "Pixels and conversion events",
          "Cross-channel attribution",
          "Cost per lead and ROAS by campaign",
          "Call and WhatsApp tracking",
          "Audit of existing measurement setup",
        ],
      },
    },
    process: [
      {
        title: "Assessment",
        description:
          "We listen, look at your numbers and audit what you're already doing. No proposal before understanding the business.",
      },
      {
        title: "Plan",
        description:
          "We define goals, channels, budget and KPIs. You know what gets done, what it costs and how it's measured before we start.",
      },
      {
        title: "Execution",
        description:
          "We produce, publish, buy media and install. Digital and offline coordinated under the same message.",
      },
      {
        title: "Optimisation",
        description:
          "Monthly reporting, reading the results and adjusting. What performs gets scaled, what doesn't gets cut.",
      },
    ],
    metrics: [
      { value: "360°", label: "Digital and traditional integrated" },
      { value: "11", label: "Service families" },
      { value: "24h", label: "Response time" },
      { value: "LATAM", label: "Operating range" },
    ],
    crossSell: {
      software:
        "The campaign drives traffic, but it's wasted if the site doesn't convert. We build the landing page or store that receives that investment.",
      it: "Events, LED screens and digital signage need installation, connectivity and power. We handle that build too.",
    },
    seo: {
      title: "Digital Marketing and Advertising Agency in Argentina",
      description:
        "Digital and traditional marketing: social media, Google Ads, Meta Ads, SEO, branding, outdoor, radio, TV, events and PR. Integrated strategy for SMBs and companies in Argentina.",
    },
  },

  software: {
    name: "Software development",
    navLabel: "Software",
    teaser: "Websites, apps and custom systems that solve the actual problem.",
    chips: ["Web", "E-commerce", "Apps", "Systems", "Integrations", "Dashboards"],
    owner: {
      role: "Founding partner & CEO",
      title: "Head of Technology",
      area: "Software & web development",
    },
    hero: {
      eyebrow: "Development area",
      titleStart: "Software that",
      titleHighlight: "works for your business",
      subtitle:
        "From a landing page that converts to an internal system that replaces twenty spreadsheets. We build web, e-commerce, mobile apps, integrations and custom dashboards on a modern stack, with support after delivery.",
      bullets: [
        "Our own code, no locked-in templates",
        "Delivered in stages, running in production",
        "Support and training included",
      ],
    },
    problems: [
      {
        title: "Your data lives in spreadsheets and WhatsApp",
        description:
          "Everyone on the team has their own version of the truth. We centralise it into a single system with permissions, history and traceability.",
      },
      {
        title: "Your site exists but doesn't sell",
        description:
          "A slow, unfocused, unmeasured site is a fixed cost. We rebuild the experience around conversion and real speed.",
      },
      {
        title: "Your team repeats work a machine could do",
        description:
          "Entering data twice, building the same report every Monday, copying information between systems. All of that can be automated.",
      },
    ],
    families: {
      web: {
        title: "Websites",
        summary: "The foundation of your digital presence: fast and built to convert.",
        items: [
          "Corporate websites",
          "High-conversion landing pages",
          "Blogs and content sites",
          "Headless CMS so you can edit it yourself",
          "Redesigns and migrations",
          "Performance and Core Web Vitals optimisation",
          "Technical SEO and structured data",
          "Accessibility and best practices",
          "Multi-language sites",
          "News portals and catalogues",
          "Campaign microsites",
        ],
      },
      ecommerce: {
        title: "E-commerce and payments",
        summary: "Selling online end to end, with the operation sorted.",
        items: [
          "Custom online stores",
          "Shopify, Tiendanube and WooCommerce",
          "Mercado Pago, Stripe, MODO and Getnet",
          "Recurring payments and subscriptions",
          "Catalogue, variants and stock management",
          "Logistics and shipping integration",
          "Optimised checkout and cart recovery",
          "Electronic invoicing (ARCA/AFIP)",
          "Coupons, promotions and price lists",
          "Marketplace and multi-vendor",
        ],
      },
      apps: {
        title: "Applications",
        summary: "Your own product, for your customers or for your team.",
        items: [
          "iOS and Android mobile apps",
          "Web applications and SaaS platforms",
          "Progressive Web Apps",
          "Customer and supplier portals",
          "Internal apps for operations",
          "App Store and Google Play publishing",
          "Push notifications",
          "Offline mode and sync",
        ],
      },
      sistemas: {
        title: "Custom systems",
        summary: "For when no off-the-shelf software does exactly what you need.",
        items: [
          "Custom CRM built around your process",
          "Lightweight ERP and back-office",
          "Project and construction management",
          "Booking and appointment systems",
          "Logistics tracking and traceability",
          "Stock and inventory control",
          "Intranets and internal portals",
          "Laboratory and clinical systems",
          "Invoicing, collections and reconciliation",
          "Digital signature and document management",
          "Fleet and maintenance management",
          "Attendance and HR tracking",
        ],
      },
      integraciones: {
        title: "Integrations and automation",
        summary: "Getting your systems to talk to each other and stop creating manual work.",
        items: [
          "API development and consumption",
          "HubSpot, Salesforce, Zoho and Pipedrive integration",
          "ERP connections (Tango, Bejerman, SAP)",
          "Automation with n8n, Make and Zapier",
          "RPA and scripts that bridge systems",
          "WhatsApp Business API bots",
          "AI chatbots and assistants",
          "Syncing across platforms and branches",
          "Webhooks and event processing",
          "Data migration between systems",
        ],
      },
      datos: {
        title: "Data and intelligence",
        summary: "Seeing the business on a dashboard instead of rebuilding it by hand every month.",
        items: [
          "Dashboards and BI panels",
          "Automated reports by email or WhatsApp",
          "Data warehouse and source consolidation",
          "Web scraping and data capture",
          "Predictive models and applied AI",
          "Semantic search and internal assistants",
          "Historical data analysis",
          "Threshold-based business alerts",
        ],
      },
      infra: {
        title: "Product infrastructure",
        summary: "Keeping what we build online, fast and monitored.",
        items: [
          "Hosting and domain administration",
          "Deployment on Vercel, AWS and Cloudflare",
          "CI/CD pipelines",
          "SSL certificates and transport security",
          "Monitoring, logs and alerts",
          "Application and database backups",
          "Scaling and cloud cost optimisation",
          "Staging and testing environments",
        ],
      },
      "seguridad-apps": {
        title: "Application quality and security",
        summary: "Before somebody else finds it.",
        items: [
          "Automated testing",
          "Legacy code audit",
          "Application hardening",
          "Web application penetration testing",
          "Data protection compliance",
          "Performance audits",
          "Dependency and vulnerability review",
        ],
      },
      post: {
        title: "Maintenance and support",
        summary: "The project doesn't end at delivery.",
        items: [
          "Ongoing development",
          "Support retainers with agreed response times",
          "Training for the client's team",
          "Manuals and technical documentation",
          "System help desk",
          "New modules and features",
          "Taking over projects built by third parties",
        ],
      },
    },
    process: [
      {
        title: "Discovery",
        description:
          "We map the real process, not the documented one. We talk to the people who'll use the system every day.",
      },
      {
        title: "Proposal and prototype",
        description:
          "Scope, timeline and fixed cost per stage. You see the design working before the final code is written.",
      },
      {
        title: "Staged development",
        description:
          "We work in short cycles with regular demos. You never wait three months to see something.",
      },
      {
        title: "Launch and support",
        description:
          "Go-live, team training and ongoing maintenance afterwards.",
      },
    ],
    metrics: [
      { value: "Next.js", label: "Modern stack in production" },
      { value: "9", label: "Service families" },
      { value: "100%", label: "Own, auditable code" },
      { value: "Post", label: "Support after delivery" },
    ],
    crossSell: {
      marketing:
        "A system or a store with no traffic doesn't bill. We build the strategy and the paid media that brings it customers.",
      it: "If the software needs its own servers, internal network, terminals or scanners, we build that infrastructure too.",
    },
    seo: {
      title: "Custom Software and App Development in Argentina",
      description:
        "Web development, e-commerce, mobile apps, CRM and custom systems. Integrations, automation, dashboards and maintenance. Next.js, React and TypeScript for companies in Argentina.",
    },
  },

  it: {
    name: "IT and infrastructure",
    navLabel: "IT",
    teaser: "Networks, cameras, power, climate and support. Everything that keeps operations running.",
    chips: ["Networks", "CCTV", "Support", "Power", "HVAC", "Cybersecurity"],
    owner: {
      role: "Founding partner",
      title: "Head of IT & Infrastructure",
      area: "IT & infrastructure",
    },
    hero: {
      eyebrow: "IT area",
      titleStart: "The infrastructure you",
      titleHighlight: "only notice when it fails",
      subtitle:
        "Cabling, networks, security cameras, servers, UPS, climate control and electromechanical repair. We install, maintain and repair everything that keeps a company running day to day, on a monthly retainer or per job.",
      bullets: [
        "On-site survey and quotation",
        "Monthly maintenance retainers",
        "Installation, servicing and on-call",
      ],
    },
    problems: [
      {
        title: "Every technical problem means a different supplier",
        description:
          "One for the network, another for the cameras, another for the air conditioning. When something fails, nobody takes responsibility. With us it's a single point of contact.",
      },
      {
        title: "You have no real backup of anything",
        description:
          "If a disk fails tomorrow or ransomware gets in, you lose years of work. We set up automated backups and a recovery plan.",
      },
      {
        title: "You only fix things after they break",
        description:
          "Reactive maintenance costs more and stops your operation. We move you to a preventive schedule with planned visits.",
      },
    ],
    families: {
      redes: {
        title: "Networks and connectivity",
        summary: "The foundation: data that arrives fast and without dropouts.",
        items: [
          "Structured cabling, Cat 5e, 6 and 6A",
          "Fibre optic installation and splicing",
          "Rack, patch panel and cable management builds",
          "Switches, routers and firewalls",
          "Enterprise Wi-Fi and mesh systems",
          "VLAN segmentation",
          "VPN and secure remote access",
          "Point-to-point links between sites",
          "Network certification and testing",
          "Network plans and documentation",
          "Expansion of existing networks",
          "Industrial and plant networks",
        ],
      },
      "seguridad-electronica": {
        title: "Electronic security",
        summary: "Cameras, access control and alarms, monitored from your phone.",
        items: [
          "Security camera and CCTV installation",
          "IP, analogue and night-vision cameras",
          "DVR and NVR recorders",
          "Remote monitoring from phone and PC",
          "Card and biometric access control",
          "Turnstiles and pedestrian barriers",
          "Electronic locks and video intercoms",
          "Alarms, sensors and sirens",
          "Automatic gates and barriers",
          "Smoke and fire detection",
          "Maintenance of existing systems",
          "Expansion and migration to IP",
        ],
      },
      soporte: {
        title: "Technical support and equipment",
        summary: "The day-to-day of the machines and the people using them.",
        items: [
          "On-site and remote technical support",
          "Help desk for staff",
          "PC builds, upgrades and repair",
          "Laptop servicing",
          "Servers, NAS and storage",
          "Printers, multifunction and label printers",
          "Operating system and software installation",
          "Licence and subscription management",
          "Equipment and data migrations",
          "Workstation setup",
          "Monthly maintenance retainers",
          "Equipment sourcing and procurement",
        ],
      },
      ciberseguridad: {
        title: "Cybersecurity",
        summary: "Real protection, not an antivirus installed and forgotten.",
        items: [
          "Perimeter firewall and rule configuration",
          "Corporate antivirus and EDR",
          "Access policies and per-user permissions",
          "Two-factor authentication",
          "Content and browsing filtering",
          "Anti-phishing training for staff",
          "Network security audit",
          "Incident response",
          "Centralised password management",
        ],
      },
      backups: {
        title: "Backup and data recovery",
        summary: "The insurance nobody values until the day they need it.",
        items: [
          "Local and cloud backup",
          "Backup automation and verification",
          "Data recovery from damaged disks",
          "Ransomware recovery",
          "Business continuity planning",
          "Server replication",
          "Archiving and retention",
          "Periodic restore testing",
        ],
      },
      energia: {
        title: "Power and electrical backup",
        summary: "So a blackout doesn't cost you the working day.",
        items: [
          "UPS installation and maintenance",
          "Battery replacement",
          "Generator sets",
          "Voltage stabilisers",
          "Electrical panels and protection",
          "Earthing and surge protection",
          "Office and retail electrical installation",
          "LED lighting and energy efficiency",
          "Consumption and power quality measurement",
        ],
      },
      clima: {
        title: "Climate control and refrigeration",
        summary: "Air conditioning, cold rooms and server rooms.",
        items: [
          "Air conditioning installation",
          "Servicing and repair of cooling equipment",
          "Preventive maintenance and gas recharge",
          "Server room climate control",
          "Cold rooms and commercial fridges",
          "Air curtains",
          "Extraction and ventilation systems",
          "Heating and heat-pump units",
          "Seasonal maintenance retainers",
        ],
      },
      electromecanica: {
        title: "Electromechanical and appliance repair",
        summary: "Equipment repair, with diagnosis and quote before touching anything.",
        items: [
          "TV and microwave repair",
          "Fridges, freezers and display units",
          "Washing machines and dryers",
          "Ovens, hobs and cookers",
          "Water heaters and boilers",
          "Electric motors and pumps",
          "Light industrial maintenance",
          "Catering equipment repair",
          "Free diagnosis and quotation",
        ],
      },
      av: {
        title: "Audio, video and digital signage",
        summary: "Screens, sound and meeting rooms that work first time.",
        items: [
          "LED screens and digital signage",
          "Display screens for shops and windows",
          "Projectors and projection screens",
          "Background sound systems",
          "Meeting rooms and video conferencing",
          "Event streaming",
          "Installation, mounting and calibration",
          "Rotating content for screens",
        ],
      },
      "consultoria-it": {
        title: "Consulting and implementation",
        summary: "Before buying equipment, it helps to know what you actually need.",
        items: [
          "On-site technical survey",
          "Project design and quotation",
          "Network and electrical plans",
          "Equipment purchasing advice",
          "Office moves and full setup",
          "New branch commissioning",
          "Technical project supervision",
          "Asset inventory and documentation",
        ],
      },
    },
    process: [
      {
        title: "Site visit and survey",
        description:
          "We come to the site, measure and document what's there. No remote diagnosis or guessed quotes.",
      },
      {
        title: "Project and quotation",
        description:
          "We set out what gets installed, with which materials, in what timeframe and at what cost. All in writing.",
      },
      {
        title: "Installation",
        description:
          "We work with the least possible disruption to your operation, at times agreed with your team.",
      },
      {
        title: "Maintenance",
        description:
          "Monthly retainer with preventive visits, on-call cover for failures and always up-to-date documentation.",
      },
    ],
    metrics: [
      { value: "On-site", label: "Physical presence, not just remote" },
      { value: "10", label: "Service families" },
      { value: "24/7", label: "On-call for retainer clients" },
      { value: "1", label: "One supplier for everything" },
    ],
    crossSell: {
      software:
        "If beyond the hardware you need a system to control it (stock, access, bookings), we build it to order.",
      marketing:
        "We install the screens and digital signage, and we also produce the content that runs on them.",
    },
    seo: {
      title: "IT Services, Networks, CCTV and Maintenance in Argentina",
      description:
        "Structured cabling, fibre optics, CCTV security cameras, technical support, servers, UPS, climate control and electromechanical repair. Installation and maintenance retainers for companies.",
    },
  },
}
