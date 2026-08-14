import type { Dict } from "../types"

export const pt: Dict = {
  locale: "pt-BR",
  langName: "Português",
  langShort: "PT",

  nav: {
    areas: "Áreas",
    casos: "Cases",
    nosotros: "Sobre",
    equipo: "Equipe",
    contacto: "Contato",
    cta: "Pedir proposta",
    ctaLong: "Pedir minha proposta",
    available: "Disponível para novos projetos",
  },

  a11y: {
    home: "Orion Marketing — Início",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    changeLanguage: "Mudar idioma",
    toLight: "Ativar tema claro",
    toDark: "Ativar tema escuro",
    backToAreas: "Voltar às três áreas",
  },

  notFound: {
    kicker: "Erro 404",
    title: "Esta página não existe",
    lead: "O link pode estar desatualizado ou a página pode ter mudado de lugar. A partir daqui você volta para qualquer parte do site.",
    home: "Ir para o início",
    contact: "Falar com a gente",
    areasLabel: "Ou entre direto em uma área",
  },

  legal: {
    updated: "Última atualização: agosto de 2026",
    backHome: "Voltar ao início",
    privacyTitle: "Política de privacidade",
    privacyLead: "Quais dados pedimos, para que os usamos e como pedir que sejam apagados.",
    privacySections: [
      {
        title: "Quem é responsável pelos seus dados",
        body: [
          "A Orion Marketing, com sede em Buenos Aires, Argentina, é responsável pelo tratamento dos dados enviados por este site. Para qualquer dúvida sobre seus dados, escreva para hola@orionmkt.com.ar.",
        ],
      },
      {
        title: "Quais dados coletamos",
        body: [
          "Os que você preenche voluntariamente no formulário de contato: nome, telefone, e-mail, tipo de serviço de interesse e a mensagem que deixar.",
          "Também coletamos dados de navegação anônimos e agregados (páginas vistas, origem da visita, tipo de dispositivo) por meio de ferramentas de analytics. Esses dados não identificam você individualmente.",
        ],
      },
      {
        title: "Para que os usamos",
        body: [
          "Apenas para responder à sua consulta, preparar uma proposta e manter o contato comercial decorrente dela.",
          "Não vendemos nem cedemos seus dados. Eles são compartilhados somente com os fornecedores que viabilizam o serviço: a plataforma que processa o envio do formulário e a ferramenta de analytics do site.",
        ],
      },
      {
        title: "Por quanto tempo guardamos",
        body: [
          "Enquanto durar a relação comercial e pelo tempo necessário para cumprir obrigações legais ou contratuais. Se você pedir a exclusão, apagamos.",
        ],
      },
      {
        title: "Seus direitos",
        body: [
          "Você pode nos pedir a qualquer momento acesso, retificação, atualização ou exclusão dos seus dados, escrevendo para hola@orionmkt.com.ar. Respondemos dentro dos prazos previstos na Lei 25.326 de Proteção de Dados Pessoais da Argentina.",
          "A Agencia de Acceso a la Información Pública, como órgão de controle da Lei 25.326, atende às denúncias e reclamações de quem tiver seus direitos afetados.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "Usamos cookies próprios e de terceiros para analytics e medição de campanhas. Você pode bloqueá-los ou apagá-los nas configurações do navegador; o site continua funcionando sem eles.",
        ],
      },
    ],
    termsTitle: "Termos e condições",
    termsLead: "As regras de uso deste site e o alcance do que publicamos nele.",
    termsSections: [
      {
        title: "Alcance",
        body: [
          "Este site é informativo. A descrição dos serviços, os catálogos e os cases publicados são de referência e não constituem oferta contratual.",
          "Enviar o formulário de contato não significa contratar nenhum serviço nem gera obrigação para você ou para nós: é o início de uma conversa.",
        ],
      },
      {
        title: "Orçamentos e propostas",
        body: [
          "Toda proposta é entregue por escrito, com escopo, prazos e preço detalhados. Os preços informados em uma proposta valem pelo período nela indicado.",
          "O trabalho é considerado contratado somente quando a proposta é aceita expressamente por ambas as partes.",
        ],
      },
      {
        title: "Propriedade intelectual",
        body: [
          "A marca Orion, o design do site, seus textos e imagens pertencem à Orion Marketing, salvo indicação em contrário.",
          "Os logos e nomes comerciais dos clientes exibidos no site pertencem aos seus respectivos titulares e aparecem apenas como referência de trabalhos realizados.",
        ],
      },
      {
        title: "Responsabilidade",
        body: [
          "Procuramos manter a informação publicada atualizada e correta, mas o site é oferecido no estado em que se encontra. Não respondemos por interrupções do serviço nem pelo conteúdo de sites de terceiros aqui linkados.",
        ],
      },
      {
        title: "Lei aplicável",
        body: [
          "Estes termos regem-se pelas leis da República Argentina. Qualquer controvérsia será submetida aos tribunais ordinários da Cidade Autônoma de Buenos Aires.",
        ],
      },
    ],
  },

  hero: {
    intro:
      "Somos a Orion: agência de marketing, desenvolvimento de software e infraestrutura de TI, em Buenos Aires.",
    titleStart: "Marketing, software e infraestrutura,",
    titleHighlight: "sob uma única direção",
    lead: "Três disciplinas que hoje você gerencia com cinco fornecedores diferentes, resolvidas por um único time responsável pelo resultado.",
    pick: "Escolha por onde começar",
    viewArea: "Ver a área",
    notSure: "Não sabe qual precisa? Conte o problema e nós encaminhamos",
    badges: ["Diagnóstico sem custo", "Contato direto com os fundadores", "Buenos Aires, Argentina"],
  },

  owner: {
    label: "Dono e diretor da área",
    meetTitle: "Com quem você vai falar",
    direct:
      "Seu projeto é conduzido por {name}, {role} da Orion. Fala com você desde a primeira reunião até a entrega.",
    noAccountManager: "Sem executivos de conta nem intermediários no meio.",
    ctaLine: "Do outro lado responde {name}, dono da área.",
  },

  areasSection: {
    kicker: "O que fazemos",
    titleStart: "Três áreas que cobrem",
    titleHighlight: "todo o negócio",
    lead: "{families} famílias de serviços e mais de {items} trabalhos diferentes. Você pode contratar uma área ou as três, sem somar fornecedores nem repetir explicações.",
    servicesLabel: "serviços",
    noFitTitle: "Seu projeto não se encaixa em nenhuma das três?",
    noFitBody:
      "Trabalhamos com uma rede de especialistas, produtoras e fornecedores em todos os setores. Se um projeto precisa de uma disciplina que não temos internamente, nós buscamos, coordenamos e respondemos pelo resultado.",
    noFitCta: "Conte seu projeto",
  },

  about: {
    kicker: "Sobre nós",
    titleStart: "Uma agência que começa",
    titleHighlight: "por entender você",
    p1: "Somos um time de Buenos Aires que trabalha com PMEs e startups de toda a região. Cada cliente é um mundo, e tratamos assim. Por isso sempre começamos com um diagnóstico real antes de colocar qualquer ideia na mesa.",
    p2: "Cobrimos três áreas sob o mesmo teto: marketing, desenvolvimento de software e infraestrutura de TI. Isso significa que você resolve a campanha, o sistema e o cabeamento com um único interlocutor.",
    features: [
      "Diagnóstico antes de propor",
      "Plano único, nunca modelo reaproveitado",
      "Marketing, software e TI em um só time",
      "Relatórios claros e transparentes",
    ],
    sheetTitle: "Ficha da agência",
    sheet: [
      { label: "Time", value: "3 sócios · contato direto" },
      { label: "Áreas", value: "Marketing · Software · TI" },
      { label: "Clientes ativos", value: "8 marcas" },
      { label: "Base", value: "Buenos Aires, Argentina" },
      { label: "Alcance", value: "Todo o país e LATAM" },
      { label: "Formato", value: "Remoto e presencial" },
    ],
  },

  areaPage: {
    problemsKicker: "O ponto de partida",
    problemsTitle: "Os problemas com que costumam nos procurar",
    catalogKicker: "Catálogo completo",
    catalogTitle: "Tudo o que fazemos em {area}",
    catalogLead:
      "{families} famílias de serviços e {items} trabalhos diferentes. Pode levar um só, um combo, ou nos deixar montar o plano completo.",
    whatsappCta: "Falar direto pelo WhatsApp",
    quoteCta: "Pedir orçamento",
    seeAllCta: "Ver tudo o que fazemos",
    starLabel: "Estrela",
    consultPrefix: "Consultar sobre",
    processKicker: "Como trabalhamos",
    processTitle: "Da primeira conversa à entrega",
    crossKicker: "As outras duas estrelas",
    crossTitle: "Isto combina bem com",
    crossLead:
      "Somos o mesmo time. Se o seu projeto toca duas ou três áreas, não há fornecedores diferentes para coordenar nem necessidade de explicar o negócio duas vezes.",
    ctaTitlePrefix: "Conte o que você precisa em",
    ctaLead:
      "Diagnóstico sem custo e proposta em menos de 24 horas. Se o projeto não for para nós, dizemos e encaminhamos para quem for.",
    ctaForm: "Preencher o formulário",
    ctaWhatsapp: "Falar pelo WhatsApp",
    ctaMail: "Ou escreva para",
  },

  capability: {
    eyebrow: "Sem limite de alcance",
    title: "Não está na lista?",
    highlight: "Resolvemos do mesmo jeito",
    description:
      "Este catálogo é o que fazemos habitualmente, não o teto do que podemos fazer. Trabalhamos com uma rede de especialistas, fornecedores e produtoras em todos os setores: se um projeto precisa de uma disciplina que não está aqui, nós buscamos, coordenamos e respondemos pelo resultado como se fosse nosso.",
    cta: "Conte seu projeto",
    points: [
      {
        title: "Um único interlocutor",
        description:
          "Você fala com a gente. A coordenação entre fornecedores, prazos e responsabilidades fica por nossa conta.",
      },
      {
        title: "Rede em todos os setores",
        description:
          "Produtoras, gráficas, instaladores, mídia, desenvolvedores e especialistas técnicos com quem já trabalhamos.",
      },
      {
        title: "Projetos de qualquer escala",
        description:
          "De um trabalho pontual de um dia a implementações que combinam as três áreas durante meses.",
      },
      {
        title: "Orçamento claro desde o início",
        description:
          "Dizemos o que dá para fazer com o orçamento que você tem, e o que seria preciso para o cenário ideal.",
      },
    ],
  },

  brands: {
    kicker: "Cases de sucesso",
    titleStart: "Marcas que",
    titleHighlight: "confiaram na gente",
    lead: "De startups a empresas consolidadas, em marketing, software e TI.",
    activeBrands: "marcas ativas",
    industries: "setores",
    inProduction: "Projetos em produção",
    realCase: "Case real",
    viewCase: "Ver case",
    dragHint: "Arraste para controlar · Passe o mouse para pausar · Clique para ver o case completo",
    industryByBrand: {
      Vittal: "Saúde",
      ADN: "Aplicação web",
      Schepens: "Varejo",
      CMVet: "Aplicação web · Veterinária",
      PlotChain: "Tecnologia & blockchain",
      "RR Sintético": "Aplicação web",
      "Soul Security": "Site",
      "Imperio 51": "Site",
    },
    taglineByBrand: {
      Vittal: "Comunicação digital para serviço de emergências médicas",
      ADN: "Plataforma de construtora com CRM sob medida",
      Schepens: "Estratégia digital para empresa de varejo",
      CMVet: "Sistema sob medida para análises clínicas veterinárias",
      PlotChain: "Posicionamento de marca no ecossistema Web3",
      "RR Sintético": "App web com sistema de orçamentos e gestão de projetos",
      "Soul Security": "Site corporativo para empresa de segurança privada",
      "Imperio 51": "Site moderno com identidade digital de alto impacto",
    },
  },

  cases: {
    kicker: "Cases de sucesso",
    titleStart: "Soluções reais para",
    titleHighlight: "problemas concretos",
    lead: "Cada projeto parte de um desafio diferente. Estes são dois exemplos de como resolvemos.",
    caseLabel: "Case",
    clientLabel: "Cliente",
    challengeLabel: "O desafio",
    solutionLabel: "Nossa solução",
    resultsLabel: "Resultados",
    ctaQuestion: "Quer melhores resultados para o seu negócio?",
    ctaButton: "Sim, quero minha proposta",
    items: [
      {
        industry: "SEO & Marketing Digital",
        title: "De um site sem alcance a referência digital do setor",
        challenge:
          "A Schepens tinha um site sem conversões, sem alcance orgânico e com um design que não transmitia a qualidade real do produto. Cada visita se perdia sem gerar contato e a marca era praticamente invisível nos buscadores.",
        solution:
          "Redesenhamos o site inteiro com foco em conversão, implementamos uma estratégia de SEO técnico e de conteúdo, e reforçamos a presença digital com uma proposta visual muito mais atrativa e alinhada à marca.",
        results: [
          { metric: "SEO+", label: "Posicionamento orgânico" },
          { metric: "Visitas", label: "Crescimento sustentado" },
          { metric: "Conversões", label: "Melhora real em leads" },
        ],
      },
      {
        industry: "Desenvolvimento sob medida",
        title: "De informação dispersa a um CRM que fecha vendas",
        challenge:
          "A ADN era uma construtora com as informações de projetos e unidades espalhadas entre planilhas, e-mails e pastas. Levar dados atualizados aos clientes era lento e confuso, e isso travava o fechamento de negócios e o crescimento.",
        solution:
          "Projetamos e desenvolvemos um CRM interno sob medida que centraliza absolutamente tudo: projetos, unidades uma a uma, status, clientes e acompanhamento de vendas. Uma única fonte de verdade para todo o time.",
        results: [
          { metric: "100%", label: "Informação centralizada" },
          { metric: "Unidade a unidade", label: "Rastreabilidade total" },
          { metric: "Mais vendas", label: "Fechamento mais ágil" },
        ],
      },
    ],
  },

  testimonials: {
    kicker: "Depoimentos",
    titleStart: "O que dizem quem já",
    titleHighlight: "trabalhou com a gente",
    lead: "Cada cliente recebe uma solução pensada para a sua realidade. Isto é o que eles contam.",
    items: [
      {
        quote:
          "Excelente e rápido trabalho da equipe, tudo bem tranquilo. Não há do que reclamar.",
        role: "Dono · Soul Security",
      },
      {
        quote:
          "Super satisfeito com todo o serviço. A verdade é que impulsionou muito o crescimento. Recomendo.",
        role: "Dono · RR Sintético",
      },
      {
        quote:
          "A Orion nos ajudou a organizar nossa mensagem e a focar nos clientes certos. Desde então, a qualidade dos nossos leads melhorou bastante.",
        role: "Brand Manager · Schepens",
      },
    ],
  },

  team: {
    kicker: "Nosso time",
    titleStart: "Um sócio à frente de",
    titleHighlight: "cada área",
    lead: "Três áreas, três responsáveis, um mesmo time. Você fala direto com quem executa, não com um intermediário nem com um atendimento que devolve suas dúvidas.",
    viewProfile: "Ver perfil",
    details: "Detalhes",
    leadsPrefix: "Lidera",
    areaLed: "Área que lidera",
    specialties: "Especialidades",
    portfolio: "Portfólio",
    members: {
      lucas: {
        role: "Sócio fundador e CEO",
        area: "Desenvolvimento de software & web",
        short:
          "Traduz os objetivos comerciais em produto: sites, landings e aplicações que convertem.",
        bio: [
          "Desenvolvedor full-stack e fundador da Orion. Trabalha na interseção entre marketing e produto, traduzindo objetivos de negócio em sites, landings e aplicações web que realmente convertem.",
          "É especializado em stacks modernos (Next.js, React, TypeScript) e em montar soluções técnicas sob medida para cada cliente: de landings focadas em performance a integrações, painéis internos e e-commerces.",
        ],
      },
      david: {
        role: "Sócio fundador",
        area: "Marketing & estratégia",
        short:
          "Desenha a estratégia comercial de cada cliente: posicionamento, funil, conteúdo e campanhas.",
        bio: [
          "Especialista em marketing digital e cofundador da Orion. Desenha a estratégia comercial de cada cliente: posicionamento, funil, conteúdo e campanhas pagas.",
          "Sua abordagem combina branding e performance: construir marcas que se sustentem no tempo e que, ao mesmo tempo, gerem demanda mensurável mês a mês.",
        ],
      },
      nicolas: {
        role: "Sócio fundador",
        area: "TI & infraestrutura",
        short: "Responsável geral da área de TI: infraestrutura, sistemas e operações técnicas.",
        bio: [
          "Cofundador da Orion e responsável por toda a área de TI. Lidera a infraestrutura, os sistemas internos e as operações técnicas que sustentam o dia a dia da agência e de cada projeto.",
          "Seu papel garante que tudo o que projetamos e desenvolvemos seja entregue sobre uma base estável, segura e escalável: hospedagem, domínios, integrações, automações e suporte contínuo.",
        ],
      },
    },
  },

  contact: {
    kicker: "Contato",
    titleStart: "Transforme sua",
    titleHighlight: "marca digital",
    lead: "Preencha o formulário e entramos em contato em menos de 24 horas com uma proposta personalizada para impulsionar seu negócio.",
    name: "Nome completo",
    phone: "Telefone / WhatsApp",
    email: "E-mail",
    projectType: "Que tipo de serviço você precisa?",
    projectOptions: [
      "Marketing",
      "Desenvolvimento de software",
      "TI e infraestrutura",
      "Várias áreas",
      "Ainda não sei",
    ],
    message: "Conte sobre o seu projeto...",
    submit: "Enviar consulta",
    submitting: "Enviando...",
    optional: "opcional",
    requiredHint: "Os campos com * são obrigatórios.",
    errorTitle: "Não conseguimos enviar sua consulta",
    errorBody:
      "Pode ser um problema de conexão ou um bloqueador de anúncios. Tente de novo ou fale direto com a gente: seus dados continuam aqui.",
    errorRetry: "Tentar de novo",
    errorWhatsapp: "Enviar pelo WhatsApp",
    errorMail: "Enviar por e-mail",
    infoTitle: "Informações de contato",
    labels: { phone: "Telefone", email: "E-mail", hours: "Horário" },
    hoursValue: "Seg - Sex: 10:00 - 18:00",
    whatsappLead: "Prefere falar direto pelo WhatsApp?",
    whatsappCta: "Fale pelo WhatsApp",
  },

  qrContact: {
    dismissLabel: "Ocultar",
    saveContact: "Salvar contato",
    closeLabel: "Fechar",
    modalTitle: "Deixe seus dados",
    modalSubtitle: "Entramos em contato em menos de 24h.",
    namePlaceholder: "Nome e sobrenome",
    emailPlaceholder: "E-mail",
    phonePlaceholder: "Telefone / WhatsApp",
    companyPlaceholder: "Empresa (opcional)",
    messagePlaceholder: "Como podemos ajudar? (opcional)",
    successMsg: "Obrigado! Entraremos em contato em breve.",
    sendingLabel: "Enviando...",
    sentLabel: "Enviado ✓",
    sendLabel: "Enviar",
    consentText: "Ao enviar você concorda que entremos em contato pelos meios fornecidos.",
    genericError: "Não foi possível enviar",
    networkError: "Erro de rede",
  },

  footer: {
    description:
      "Agência de marketing, desenvolvimento de software e infraestrutura de TI. Três áreas, um só time, para PMEs e startups.",
    areasHeading: "Áreas",
    companyHeading: "Empresa",
    location: "Argentina — Atuamos em todo o país e na LATAM",
    copyright: "© {year} Orion Marketing. Todos os direitos reservados.",
    privacy: "Privacidade",
    terms: "Termos",
  },
}
