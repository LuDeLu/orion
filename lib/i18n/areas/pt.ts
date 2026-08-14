import type { AreaTexts } from "./types"

export const areasPt: AreaTexts = {
  marketing: {
    name: "Marketing",
    navLabel: "Marketing",
    teaser: "Que te encontrem, te escolham e te lembrem. Online e na rua.",
    chips: ["Redes", "Mídia paga", "Mídia exterior", "Branding", "Eventos", "Imprensa"],
    owner: { role: "Sócio fundador", title: "Diretor de Marketing", area: "Marketing & estratégia" },
    hero: {
      eyebrow: "Área de Marketing",
      titleStart: "Marketing completo,",
      titleHighlight: "do feed ao outdoor",
      subtitle:
        "Estratégia, marca, conteúdo, mídia paga e publicidade tradicional sob um mesmo plano. Não importa se o cliente te descobre no Instagram, num outdoor da estrada ou por indicação: tratamos todos esses pontos de contato como um só sistema.",
      bullets: [
        "Diagnóstico sem custo antes de propor",
        "Digital e tradicional no mesmo plano",
        "Relatórios claros com métricas reais",
      ],
    },
    problems: [
      {
        title: "Você investe em publicidade e não sabe o que funciona",
        description:
          "Coloca dinheiro em redes, no Google e num outdoor e não tem como saber qual dos três trouxe o cliente. Medimos cada canal separadamente e mostramos o custo real por contato.",
      },
      {
        title: "Sua marca não parece com o que você vende",
        description:
          "O produto é bom mas a comunicação não transmite isso. Alinhamos identidade, mensagem e presença para que a percepção esteja à altura do que você faz.",
      },
      {
        title: "Chegam contatos, mas não são os que você quer",
        description:
          "Volume sem qualidade é ruído. Ajustamos segmentação, mensagem e filtros para que quem escreva seja quem realmente pode comprar.",
      },
    ],
    families: {
      estrategia: {
        title: "Estratégia e consultoria",
        summary: "O plano antes da execução. Onde você está e para onde convém ir.",
        items: [
          "Diagnóstico inicial de marca e negócio",
          "Plano de marketing anual",
          "Posicionamento e proposta de valor",
          "Definição de buyer personas",
          "Pesquisa de mercado",
          "Análise de concorrência e benchmarking",
          "Arquitetura de marca e submarcas",
          "Definição de objetivos e KPIs",
          "Consultoria estratégica por hora",
          "Plano de lançamento de produto",
          "Estratégia de preços e promoções",
          "Auditoria da comunicação existente",
        ],
      },
      branding: {
        title: "Branding e identidade",
        summary: "Como sua marca se vê, se ouve e se aplica em cada suporte.",
        items: [
          "Naming e construção do conceito",
          "Design de logo e símbolo",
          "Manual de marca e diretrizes de uso",
          "Rebranding e atualização de identidade",
          "Sistema visual completo (paleta, tipografia, grids)",
          "Papelaria institucional",
          "Design de embalagens e rótulos",
          "Sinalização e wayfinding",
          "Uniformes e vestuário de marca",
          "Identidade sonora e jingles",
          "Brand book digital para equipes",
          "Aplicações em frota e lojas",
        ],
      },
      redes: {
        title: "Redes sociais e conteúdo",
        summary: "O dia a dia dos seus canais, com conteúdo pensado para vender e não só para preencher.",
        items: [
          "Community management diário",
          "Calendário editorial estratégico",
          "Criação de posts, reels e stories",
          "Copywriting e roteiros",
          "Gestão de Instagram, Facebook e TikTok",
          "Gestão de LinkedIn corporativo",
          "Gestão de YouTube e Pinterest",
          "Atendimento de mensagens e comentários",
          "Produção de conteúdo UGC",
          "Campanhas com influenciadores e microinfluenciadores",
          "Concursos e sorteios",
          "Relatórios de alcance e engajamento",
        ],
      },
      paid: {
        title: "Mídia paga",
        summary: "Mídia gerida com foco em custo por contato, não em curtidas.",
        items: [
          "Meta Ads (Facebook e Instagram)",
          "Google Ads: Search, Display e Performance Max",
          "Google Shopping e campanhas de catálogo",
          "YouTube Ads",
          "TikTok Ads",
          "LinkedIn Ads para B2B",
          "Spotify e publicidade em podcasts",
          "Remarketing e públicos semelhantes",
          "Landing pages específicas de campanha",
          "Teste A/B de criativos e textos",
          "Gestão de verba publicitária",
          "Otimização semanal e controle de gasto",
        ],
      },
      seo: {
        title: "SEO e presença em buscadores",
        summary: "Que te encontrem quando alguém busca o que você vende, sem pagar por clique.",
        items: [
          "Auditoria de SEO técnico",
          "Otimização on-page e estrutura de conteúdo",
          "SEO local e Perfil da Empresa no Google",
          "Estratégia de conteúdo e blog",
          "Link building e assessoria digital",
          "Gestão de avaliações e reputação online",
          "Otimização para busca com IA",
          "SEO para e-commerce e páginas de produto",
          "Monitoramento de posições e tráfego orgânico",
        ],
      },
      tradicional: {
        title: "Marketing tradicional e mídia exterior",
        summary:
          "Publicidade fora da tela: rua, estrada, rádio, TV e gráfica. Cuidamos do espaço, da produção e da montagem.",
        items: [
          "Outdoors e painéis em via pública",
          "Painéis de LED e digital out-of-home",
          "Publicidade em ônibus, metrô e trens",
          "Abrigos de ônibus e mobiliário urbano",
          "Fachadas, letreiros e toldos",
          "Impressões em grande formato, banners e lonas",
          "Envelopamento de veículos e frota",
          "Panfletagem, folhetos e mala direta",
          "Publicidade em rádio e produção de spots",
          "Spots de TV aberta e a cabo",
          "Anúncios em jornais e revistas de nicho",
          "Publicidade em rodovias e acessos",
          "Faixas, bandeiras e balões",
          "Publicidade em cinemas e arenas esportivas",
          "Negociação e compra de espaços",
        ],
      },
      btl: {
        title: "BTL, eventos e experiencial",
        summary: "Para quando a marca precisa estar presente pessoalmente.",
        items: [
          "Ativações de marca",
          "Produção integral de eventos e lançamentos",
          "Estandes de feiras e exposições",
          "Promotores e equipes de rua",
          "Sampling e degustações",
          "Ações em ponto de venda",
          "Brindes e material promocional",
          "Ambientação e cenografia de marca",
          "Buffet, som e iluminação de evento",
          "Cobertura audiovisual do evento",
        ],
      },
      prensa: {
        title: "Imprensa e relações públicas",
        summary: "Que falem de você nos lugares onde convém aparecer.",
        items: [
          "Redação e envio de releases",
          "Relacionamento com mídia e jornalistas",
          "Gestão de entrevistas e porta-voz",
          "Conteúdo patrocinado e publieditoriais",
          "Gestão de crise e reputação",
          "Imprensa em mídia local e regional",
          "Presença em mídia especializada do setor",
        ],
      },
      crm: {
        title: "CRM, fidelização e automação",
        summary: "O que acontece depois do primeiro contato, que é onde se perde a maioria das vendas.",
        items: [
          "E-mail marketing e newsletters",
          "WhatsApp Business e disparos em massa",
          "Automação de nutrição de leads",
          "Programas de fidelidade e pontos",
          "Pesquisas de satisfação e NPS",
          "Segmentação e limpeza de base de dados",
          "Campanhas de recuperação de clientes inativos",
          "Integração com o CRM que você já usa",
        ],
      },
      audiovisual: {
        title: "Produção audiovisual e fotografia",
        summary: "Material próprio, sem bancos de imagem genéricos.",
        items: [
          "Fotografia profissional de produto",
          "Packshot para e-commerce",
          "Fotografia de loja, obra e equipe",
          "Vídeo institucional",
          "Reels e conteúdo vertical",
          "Spots publicitários",
          "Filmagem com drone",
          "Locução e voz off",
          "Motion graphics e animação",
          "Edição e pós-produção",
          "Fotografia de eventos",
        ],
      },
      medicion: {
        title: "Medição e analytics",
        summary: "Sem isso, tudo o que vem antes é opinião.",
        items: [
          "Relatórios mensais de performance",
          "Dashboards de marketing ao vivo",
          "Google Analytics e Tag Manager",
          "Pixels e eventos de conversão",
          "Atribuição entre canais",
          "Custo por lead e ROAS por campanha",
          "Rastreamento de ligações e WhatsApp",
          "Auditoria da medição existente",
        ],
      },
    },
    process: [
      {
        title: "Diagnóstico",
        description:
          "Ouvimos, olhamos seus números e auditamos o que você já vem fazendo. Sem proposta antes de entender o negócio.",
      },
      {
        title: "Plano",
        description:
          "Definimos objetivos, canais, verba e KPIs. Você sabe o que será feito, quanto custa e como se mede antes de começar.",
      },
      {
        title: "Execução",
        description:
          "Produzimos, publicamos, veiculamos e montamos. Digital e offline coordenados sob a mesma mensagem.",
      },
      {
        title: "Otimização",
        description:
          "Relatório mensal, leitura dos resultados e ajuste. O que rende é escalado, o que não rende é cortado.",
      },
    ],
    metrics: [
      { value: "360°", label: "Digital e tradicional integrados" },
      { value: "11", label: "Famílias de serviços" },
      { value: "24h", label: "Tempo de resposta" },
      { value: "LATAM", label: "Alcance de operação" },
    ],
    crossSell: {
      software:
        "A campanha traz tráfego, mas se o site não converte tudo se perde. Desenvolvemos a landing ou o e-commerce que recebe esse investimento.",
      it: "Eventos, painéis de LED e sinalização digital precisam de instalação, conectividade e energia. Essa montagem é nossa também.",
    },
    seo: {
      title: "Agência de Marketing Digital e Publicidade na Argentina",
      description:
        "Marketing digital e tradicional: redes sociais, Google Ads, Meta Ads, SEO, branding, mídia exterior, rádio, TV, eventos e imprensa. Estratégia integral para PMEs e empresas.",
    },
  },

  software: {
    name: "Desenvolvimento de software",
    navLabel: "Software",
    teaser: "Sites, apps e sistemas sob medida que resolvem o problema real.",
    chips: ["Web", "E-commerce", "Apps", "Sistemas", "Integrações", "Dashboards"],
    owner: {
      role: "Sócio fundador e CEO",
      title: "Diretor de Tecnologia",
      area: "Desenvolvimento de software & web",
    },
    hero: {
      eyebrow: "Área de Desenvolvimento",
      titleStart: "Software que",
      titleHighlight: "trabalha pelo seu negócio",
      subtitle:
        "De uma landing que converte a um sistema interno que substitui vinte planilhas. Desenvolvemos web, e-commerce, aplicativos móveis, integrações e painéis sob medida, com stack moderno e manutenção depois da entrega.",
      bullets: [
        "Código próprio, sem templates amarrados",
        "Entrega por etapas e em produção",
        "Suporte e treinamento incluídos",
      ],
    },
    problems: [
      {
        title: "Sua informação vive em planilhas e WhatsApp",
        description:
          "Cada pessoa da equipe tem sua versão da verdade. Centralizamos tudo em um sistema único com permissões, histórico e rastreabilidade.",
      },
      {
        title: "Seu site não vende, só existe",
        description:
          "Um site lento, sem foco e sem medição é um custo fixo. Refazemos a experiência com eixo em conversão e velocidade real.",
      },
      {
        title: "Sua equipe repete tarefas que uma máquina poderia fazer",
        description:
          "Lançar dados duas vezes, montar o mesmo relatório toda segunda, copiar informação entre sistemas. Tudo isso se automatiza.",
      },
    ],
    families: {
      web: {
        title: "Sites",
        summary: "A base da sua presença digital, rápida e pensada para converter.",
        items: [
          "Sites institucionais",
          "Landing pages de alta conversão",
          "Blogs e sites de conteúdo",
          "Headless CMS para você mesmo editar",
          "Redesigns e migrações",
          "Otimização de performance e Core Web Vitals",
          "SEO técnico e dados estruturados",
          "Acessibilidade e boas práticas",
          "Sites multi-idioma",
          "Portais de notícias e catálogos",
          "Microsites de campanha",
        ],
      },
      ecommerce: {
        title: "E-commerce e pagamentos",
        summary: "Vender online de ponta a ponta, com a operação resolvida.",
        items: [
          "Lojas online sob medida",
          "Shopify, Tiendanube e WooCommerce",
          "Mercado Pago, Stripe, MODO e Getnet",
          "Pagamentos recorrentes e assinaturas",
          "Catálogo, variantes e gestão de estoque",
          "Integração com logística e envios",
          "Checkout otimizado e recuperação de carrinho",
          "Faturamento eletrônico (ARCA/AFIP)",
          "Cupons, promoções e tabelas de preço",
          "Marketplace e multivendedor",
        ],
      },
      apps: {
        title: "Aplicações",
        summary: "Produto próprio, para seus clientes ou para sua equipe.",
        items: [
          "Apps móveis iOS e Android",
          "Aplicações web e plataformas SaaS",
          "Progressive Web Apps",
          "Portais de clientes e fornecedores",
          "Aplicações internas para operações",
          "Publicação na App Store e Google Play",
          "Notificações push",
          "Modo offline e sincronização",
        ],
      },
      sistemas: {
        title: "Sistemas sob medida",
        summary: "Quando nenhum software de mercado faz exatamente o que você precisa.",
        items: [
          "CRM próprio adaptado ao seu processo",
          "ERP leve e gestão administrativa",
          "Gestão de projetos e obras",
          "Sistemas de agendamento e reservas",
          "Rastreamento e rastreabilidade logística",
          "Controle de estoque e inventário",
          "Intranets e portais internos",
          "Sistemas de laboratório e clínicos",
          "Faturamento, cobrança e conciliação",
          "Assinatura digital e gestão documental",
          "Gestão de frotas e manutenção",
          "Controle de ponto e RH",
        ],
      },
      integraciones: {
        title: "Integrações e automação",
        summary: "Que seus sistemas conversem entre si e parem de gerar trabalho manual.",
        items: [
          "Desenvolvimento e consumo de APIs",
          "Integração com HubSpot, Salesforce, Zoho e Pipedrive",
          "Conexão com ERPs (Tango, Bejerman, SAP)",
          "Automações com n8n, Make e Zapier",
          "RPA e scripts que conectam sistemas",
          "Bots de WhatsApp Business API",
          "Chatbots e assistentes com IA",
          "Sincronização entre plataformas e filiais",
          "Webhooks e processamento de eventos",
          "Migração de dados entre sistemas",
        ],
      },
      datos: {
        title: "Dados e inteligência",
        summary: "Ver o negócio num painel em vez de reconstruí-lo à mão todo mês.",
        items: [
          "Dashboards e painéis de BI",
          "Relatórios automáticos por e-mail ou WhatsApp",
          "Data warehouse e consolidação de fontes",
          "Web scraping e captura de dados",
          "Modelos preditivos e IA aplicada",
          "Busca semântica e assistentes internos",
          "Análise de dados históricos",
          "Alertas por limites de negócio",
        ],
      },
      infra: {
        title: "Infraestrutura de produto",
        summary: "Que o que construímos esteja online, rápido e monitorado.",
        items: [
          "Hospedagem e administração de domínios",
          "Deploy em Vercel, AWS e Cloudflare",
          "Pipelines de CI/CD",
          "Certificados SSL e segurança de transporte",
          "Monitoramento, logs e alertas",
          "Backups de aplicação e banco de dados",
          "Escala e otimização de custos em nuvem",
          "Ambientes de staging e teste",
        ],
      },
      "seguridad-apps": {
        title: "Qualidade e segurança de aplicações",
        summary: "Antes que outro encontre.",
        items: [
          "Testes automatizados",
          "Auditoria de código legado",
          "Hardening de aplicações",
          "Pentest de aplicações web",
          "Conformidade com proteção de dados pessoais",
          "Auditoria de performance",
          "Revisão de dependências e vulnerabilidades",
        ],
      },
      post: {
        title: "Manutenção e suporte",
        summary: "O projeto não termina quando é entregue.",
        items: [
          "Manutenção evolutiva",
          "Contratos de suporte com prazos acordados",
          "Treinamento da equipe do cliente",
          "Manuais e documentação técnica",
          "Central de ajuda do sistema",
          "Novos módulos e funcionalidades",
          "Assumir projetos desenvolvidos por terceiros",
        ],
      },
    },
    process: [
      {
        title: "Levantamento",
        description:
          "Entendemos o processo real, não o que está escrito. Conversamos com quem vai usar o sistema todos os dias.",
      },
      {
        title: "Proposta e protótipo",
        description:
          "Escopo, prazos e custo fechado por etapa. Você vê o design funcionando antes de escrever o código definitivo.",
      },
      {
        title: "Desenvolvimento por entregas",
        description:
          "Trabalhamos em ciclos curtos com demos periódicas. Você nunca espera três meses para ver algo.",
      },
      {
        title: "Produção e suporte",
        description:
          "Entrada em produção, treinamento da equipe e acompanhamento posterior com manutenção.",
      },
    ],
    metrics: [
      { value: "Next.js", label: "Stack moderno em produção" },
      { value: "9", label: "Famílias de serviços" },
      { value: "100%", label: "Código próprio e auditável" },
      { value: "Pós", label: "Suporte depois da entrega" },
    ],
    crossSell: {
      marketing:
        "Um sistema ou uma loja sem tráfego não fatura. Montamos a estratégia e a mídia que leva clientes até lá.",
      it: "Se o software precisa de servidores próprios, rede interna, terminais ou leitores, a infraestrutura é nossa também.",
    },
    seo: {
      title: "Desenvolvimento de Software e Aplicativos sob Medida",
      description:
        "Desenvolvimento web, e-commerce, apps móveis, CRM e sistemas sob medida. Integrações, automação, dashboards e manutenção. Next.js, React e TypeScript para empresas.",
    },
  },

  it: {
    name: "TI e infraestrutura",
    navLabel: "TI",
    teaser: "Redes, câmeras, energia, climatização e suporte. Tudo o que sustenta a operação.",
    chips: ["Redes", "CFTV", "Suporte", "Energia", "Climatização", "Cibersegurança"],
    owner: {
      role: "Sócio fundador",
      title: "Diretor de TI e Infraestrutura",
      area: "TI & infraestrutura",
    },
    hero: {
      eyebrow: "Área de TI",
      titleStart: "A infraestrutura que",
      titleHighlight: "só se nota quando falha",
      subtitle:
        "Cabeamento, redes, câmeras de segurança, servidores, nobreaks, climatização e eletromecânica. Instalamos, mantemos e reparamos tudo o que faz uma empresa funcionar todos os dias, com contratos mensais ou por trabalho pontual.",
      bullets: [
        "Levantamento e orçamento no local",
        "Contratos mensais de manutenção",
        "Instalação, assistência e plantão",
      ],
    },
    problems: [
      {
        title: "Cada problema técnico é um fornecedor diferente",
        description:
          "Um para a rede, outro para as câmeras, outro para o ar-condicionado. Quando algo falha, ninguém assume. Conosco é um só interlocutor.",
      },
      {
        title: "Você não tem backup real de nada",
        description:
          "Se amanhã um disco quebra ou entra um ransomware, você perde anos de trabalho. Montamos backup automático e plano de recuperação.",
      },
      {
        title: "Você sempre conserta depois que quebra",
        description:
          "A manutenção corretiva sai mais cara e para a operação. Passamos para um esquema preventivo com visitas programadas.",
      },
    ],
    families: {
      redes: {
        title: "Redes e conectividade",
        summary: "A base de tudo: que os dados cheguem rápido e sem quedas.",
        items: [
          "Cabeamento estruturado categoria 5e, 6 e 6A",
          "Lançamento e fusão de fibra óptica",
          "Montagem de racks, patch panels e organização",
          "Switches, roteadores e firewalls",
          "Wi-Fi corporativo e sistemas mesh",
          "Segmentação por VLAN",
          "VPN e acesso remoto seguro",
          "Links ponto a ponto entre filiais",
          "Certificação e medição de rede",
          "Plantas e documentação de rede",
          "Ampliação de rede existente",
          "Redes industriais e de planta",
        ],
      },
      "seguridad-electronica": {
        title: "Segurança eletrônica",
        summary: "Câmeras, acessos e alarmes, com monitoramento pelo celular.",
        items: [
          "Instalação de câmeras de segurança e CFTV",
          "Câmeras IP, analógicas e com visão noturna",
          "Gravadores DVR e NVR",
          "Monitoramento remoto por celular e PC",
          "Controle de acesso por cartão e biometria",
          "Catracas e barreiras de pedestres",
          "Fechaduras eletrônicas e videoporteiros",
          "Alarmes, sensores e sirenes",
          "Portões e cancelas automáticas",
          "Detecção de fumaça e incêndio",
          "Manutenção de sistemas já instalados",
          "Ampliação e migração para IP",
        ],
      },
      soporte: {
        title: "Suporte técnico e equipamentos",
        summary: "O dia a dia das máquinas e de quem as usa.",
        items: [
          "Suporte técnico presencial e remoto",
          "Central de ajuda para a equipe",
          "Montagem, upgrade e reparo de PCs",
          "Assistência de notebooks",
          "Servidores, NAS e armazenamento",
          "Impressoras, multifuncionais e etiquetadoras",
          "Instalação de sistemas operacionais e software",
          "Gestão de licenças e assinaturas",
          "Migrações de equipamentos e dados",
          "Preparação de estações de trabalho",
          "Contratos mensais de manutenção",
          "Fornecimento e compra de equipamentos",
        ],
      },
      ciberseguridad: {
        title: "Cibersegurança",
        summary: "Proteção real, não só um antivírus instalado e esquecido.",
        items: [
          "Firewall de perímetro e configuração de regras",
          "Antivírus e EDR corporativo",
          "Políticas de acesso e permissões por usuário",
          "Autenticação em dois fatores",
          "Filtragem de conteúdo e navegação",
          "Treinamento antiphishing para a equipe",
          "Auditoria de segurança de rede",
          "Resposta a incidentes",
          "Gestão centralizada de senhas",
        ],
      },
      backups: {
        title: "Backup e recuperação de dados",
        summary: "O seguro que ninguém valoriza até o dia em que precisa.",
        items: [
          "Backup local e em nuvem",
          "Automação e verificação de backups",
          "Recuperação de dados de discos danificados",
          "Recuperação após ransomware",
          "Plano de continuidade do negócio",
          "Réplica de servidores",
          "Arquivamento histórico e retenção",
          "Testes periódicos de restauração",
        ],
      },
      energia: {
        title: "Energia e respaldo elétrico",
        summary: "Para que uma queda de luz não custe o dia de trabalho.",
        items: [
          "Instalação e manutenção de nobreaks",
          "Troca de baterias",
          "Grupos geradores",
          "Estabilizadores de tensão",
          "Quadros elétricos e proteções",
          "Aterramento e proteção contra descargas",
          "Instalação elétrica de escritórios e lojas",
          "Iluminação LED e eficiência energética",
          "Medição de consumo e qualidade de energia",
        ],
      },
      clima: {
        title: "Climatização e refrigeração",
        summary: "Ar-condicionado, câmaras frias e salas de servidores.",
        items: [
          "Instalação de ar-condicionado",
          "Assistência e reparo de equipamentos de frio",
          "Manutenção preventiva e recarga de gás",
          "Climatização de salas de servidores",
          "Câmaras frias e geladeiras comerciais",
          "Cortinas de ar",
          "Sistemas de exaustão e ventilação",
          "Aquecimento e equipamentos quente-frio",
          "Contratos de manutenção sazonal",
        ],
      },
      electromecanica: {
        title: "Eletromecânica e eletrodomésticos",
        summary: "Reparo de equipamentos, com diagnóstico e orçamento antes de mexer em nada.",
        items: [
          "Reparo de TV e micro-ondas",
          "Geladeiras, freezers e expositores",
          "Lavadoras e secadoras",
          "Fornos, cooktops e fogões",
          "Aquecedores e boilers",
          "Motores elétricos e bombas",
          "Manutenção industrial leve",
          "Reparo de equipamentos gastronômicos",
          "Diagnóstico e orçamento sem custo",
        ],
      },
      av: {
        title: "Áudio, vídeo e sinalização digital",
        summary: "Painéis, som e salas de reunião que funcionam de primeira.",
        items: [
          "Painéis de LED e digital signage",
          "TVs de sinalização para lojas e vitrines",
          "Projetores e telas de projeção",
          "Sistemas de som ambiente",
          "Salas de reunião e videoconferência",
          "Transmissão de eventos",
          "Instalação, suporte e calibração",
          "Conteúdo rotativo para painéis",
        ],
      },
      "consultoria-it": {
        title: "Consultoria e implementação",
        summary: "Antes de comprar equipamento, convém saber o que é necessário.",
        items: [
          "Levantamento técnico no local",
          "Projeto e orçamento de obra",
          "Plantas de rede e elétricas",
          "Assessoria na compra de equipamentos",
          "Mudanças de escritório e montagem completa",
          "Abertura técnica de novas filiais",
          "Direção técnica de obra",
          "Inventário e documentação de ativos",
        ],
      },
    },
    process: [
      {
        title: "Visita e levantamento",
        description:
          "Vamos ao local, medimos e documentamos o que existe. Sem diagnóstico à distância nem orçamento no chute.",
      },
      {
        title: "Projeto e orçamento",
        description:
          "Apresentamos o que será instalado, com quais materiais, em quanto tempo e a que custo. Tudo por escrito.",
      },
      {
        title: "Instalação",
        description:
          "Executamos com a menor interrupção possível da sua operação, em horários combinados com sua equipe.",
      },
      {
        title: "Manutenção",
        description:
          "Contrato mensal com visitas preventivas, plantão para falhas e documentação sempre atualizada.",
      },
    ],
    metrics: [
      { value: "Local", label: "Presença física, não só remoto" },
      { value: "10", label: "Famílias de serviços" },
      { value: "24/7", label: "Plantão para clientes com contrato" },
      { value: "1", label: "Um só fornecedor para tudo" },
    ],
    crossSell: {
      software:
        "Se além do equipamento você precisa de um sistema que o controle (estoque, acessos, agendamentos), desenvolvemos sob medida.",
      marketing:
        "Instalamos os painéis e a sinalização digital, e também produzimos o conteúdo que aparece neles.",
    },
    seo: {
      title: "Serviços de TI, Redes, Câmeras e Manutenção",
      description:
        "Cabeamento estruturado, fibra óptica, câmeras de segurança CFTV, suporte técnico, servidores, nobreaks, climatização e eletromecânica. Instalação e contratos de manutenção para empresas.",
    },
  },
}
