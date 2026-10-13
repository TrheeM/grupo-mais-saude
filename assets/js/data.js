/* =========================================================
   Grupo Mais Saúde: conteúdo do site
   Tudo que muda (convênios, preço, lojas) fica aqui.
   Fonte: posts do Instagram @maissaudegrupo.
   ========================================================= */

export const WHATSAPP = '551231994242';
export const PHONE = '(12) 3199-4242';
export const INSTAGRAM = 'https://www.instagram.com/maissaudegrupo/';
export const ADDRESS = {
    street: 'Rua Barão da Bocaina, 308',
    area: 'Centro · Lorena, SP',
    query: 'Rua Barão da Bocaina, 308, Centro, Lorena - SP',
};

export const GROUPS = [
    { id: 'todos', label: 'Todos' },
    { id: 'medicos', label: 'Consultas médicas' },
    { id: 'exames', label: 'Exames' },
    { id: 'terapias', label: 'Terapias e odonto' },
];

/* icon = id do símbolo no sprite do index.html (#i-<icon>) */
export const CONVENIOS = [
    { id: 'clinica-geral', name: 'Clínica Geral', group: 'medicos', icon: 'stetho', line: 'Primeira consulta, check-up e encaminhamento.' },
    { id: 'pediatria', name: 'Pediatria', group: 'medicos', icon: 'baby', line: 'Consultas para bebês, crianças e adolescentes.' },
    { id: 'cardiologia', name: 'Cardiologia', group: 'medicos', icon: 'heart', line: 'Coração e pressão arterial.' },
    { id: 'ortopedia', name: 'Ortopedia', group: 'medicos', icon: 'bone', line: 'Ossos, articulações, coluna e lesões.' },
    { id: 'urologia', name: 'Urologia', group: 'medicos', icon: 'drop', line: 'Rins, bexiga e próstata.' },
    { id: 'andrologia', name: 'Andrologia', group: 'medicos', icon: 'mars', line: 'Saúde do homem.' },
    { id: 'ginecologia', name: 'Ginecologia', group: 'medicos', icon: 'venus', line: 'Saúde da mulher.' },
    { id: 'obstetricia', name: 'Obstetrícia', group: 'medicos', icon: 'bump', line: 'Acompanhamento da gestação.' },
    { id: 'geriatria', name: 'Geriatria', group: 'medicos', icon: 'cane', line: 'Acompanhamento da pessoa idosa.' },
    { id: 'exames-laboratoriais', name: 'Exames Laboratoriais', group: 'exames', icon: 'tube', line: 'Desconto em laboratórios de análises clínicas.' },
    { id: 'diagnostico-imagem', name: 'Diagnóstico por Imagem', group: 'exames', icon: 'scan', line: 'Desconto em exames de imagem.' },
    { id: 'psicologia', name: 'Psicologia', group: 'terapias', icon: 'talk', line: 'Atendimento adulto e infantil.' },
    { id: 'fisioterapia', name: 'Fisioterapia', group: 'terapias', icon: 'weight', line: 'Reabilitação e tratamento de dores.' },
    { id: 'acupuntura', name: 'Acupuntura', group: 'terapias', icon: 'needle', line: 'Sessões com profissional conveniado.' },
    { id: 'massoterapia', name: 'Massoterapia', group: 'terapias', icon: 'hand', line: 'Massagem terapêutica.' },
    { id: 'odontologia', name: 'Odontologia', group: 'terapias', icon: 'tooth', line: 'Dentista com desconto pelo cartão.' },
];

/* Convênios que passam no topo (os que têm post próprio no Instagram).
   theme = [centro, meio, borda] do fundo; glow = brilho atrás do cartão. */
export const HERO = [
    { id: 'clinica-geral', word: 'Clínica Geral', theme: ['#1f8a84', '#0e4a48', '#05201f'], glow: '#6fe0d4' },
    { id: 'pediatria', word: 'Pediatria', theme: ['#2a86b0', '#12465e', '#061c27'], glow: '#ffd34d' },
    { id: 'ortopedia', word: 'Ortopedia', theme: ['#3f7d8c', '#183e49', '#07181d'], glow: '#9fd8e6' },
    { id: 'fisioterapia', word: 'Fisioterapia', theme: ['#22987d', '#0d4c40', '#04201a'], glow: '#8ff0c8' },
    { id: 'urologia', word: 'Urologia', theme: ['#3b6ea6', '#1a3557', '#0a1526'], glow: '#9cc4ff' },
    { id: 'odontologia', word: 'Odontologia', theme: ['#2b9cc2', '#114f69', '#06212c'], glow: '#bdf2ff' },
];

export const BENEFITS = [
    {
        id: 'consultas', icon: 'stetho', n: '01', title: 'Consulta a preço popular',
        text: 'Médicos conveniados em várias especialidades, com valor reduzido para quem tem o cartão.',
        cta: 'Ver especialidades', href: '#convenios',
    },
    {
        id: 'exames', icon: 'tube', n: '02', title: 'Exames com desconto',
        text: 'Laboratórios de análises clínicas e diagnóstico por imagem com preço de conveniado.',
        msg: 'Olá! Quero saber dos descontos em exames pelo cartão Mais Saúde.',
    },
    {
        id: 'vacinas', icon: 'syringe', n: '03', title: 'Vacinas na MedCenter Lorena',
        text: 'Desconto especial para conveniados e pagamento em até 10 vezes no cartão de crédito.',
        msg: 'Olá! Quero saber das vacinas com desconto na MedCenter Lorena pelo cartão Mais Saúde.',
    },
    {
        id: 'funeral', icon: 'flower', n: '04', title: 'Assistência funeral',
        text: 'Benefício para toda a família. Pergunte no WhatsApp o que está incluído e quem entra como dependente.',
        msg: 'Olá! Quero saber como funciona a assistência funeral do Grupo Mais Saúde.',
    },
    {
        id: 'remocao', icon: 'ambulance', n: '05', title: 'Remoção de pacientes',
        text: 'Ambulância para acamados, com suporte básico (SBV) e UTI móvel. Em emergência, ligue 192.',
        msg: 'Olá! Preciso de informação sobre remoção de pacientes (SBV / UTI móvel).',
    },
    {
        id: 'comercio', icon: 'tag', n: '06', title: 'Desconto no comércio',
        text: 'Farmácia, oficina de motos, empório e bar de Lorena dão desconto para quem mostra o cartão. Tem também carro pet.',
        cta: 'Ver lojas', href: '#lojas',
    },
];

// lojas conveniadas publicadas no post "Convênios" (a lista do post continua; confirme as demais)
export const LOJAS = [
    { name: 'Farma Uchôas', kind: 'Farmácia' },
    { name: 'MedCenter Lorena', kind: 'Vacinas' },
    { name: 'Street Motos', kind: 'Motos' },
    { name: 'Cantinho Mineiro', kind: 'Empório' },
    { name: "Junqueira's Bar", kind: 'Bar' },
];
