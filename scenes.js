const SCENES = [
  {
    id: 'alma',
    data: [['COORDENADAS', '23°01′ S  67°45′ O'], ['ALTITUDE', '5000m'], ['OBSERVA', 'Ondas milimétricas']],
    thumb: 'img/thumbs/alma.jpg',
    title: 'Observatório ALMA',
    short: 'Observatório ALMA',
    intro: {
      title: 'Três observatórios no deserto do Atacama',
      body: 'O norte do Chile tem ar muito seco, grande altitude e céus escuros. Por isso é um dos melhores lugares do mundo para observar o espaço. Percorre os três locais pelos portais.'
    },
    img: 'img/alma-night.jpg',
    credit: 'ESO/B. Tafreshi (twanight.org)',
    body: 'O ALMA tem 66 antenas e observa ondas milimétricas e submilimétricas. Estas ondas não precisam de escuridão, por isso trabalha de dia e de noite. É uma parceria entre a Europa, os Estados Unidos e o Leste Asiático.',
    panel: { az: 0, el: -4 },
    portals: [
      { to: 'la-silla', az: -38, el: -4 },
      { to: 'paranal', az: 38,  el: -4 }
    ]
  },
  {
    id: 'paranal',
    data: [['COORDENADAS', '24°37′ S  70°24′ O'], ['ALTITUDE', '2635m'], ['OBSERVA', 'Visível e infravermelho']],
    thumb: 'img/thumbs/paranal.jpg',
    title: 'Observatório do Paranal',
    short: 'Observatório do Paranal',
    img: 'img/paranal-night.jpg',
    credit: 'Y. Beletsky (LCO)/ESO',
    body: 'Aqui fica o Very Large Telescope da ESO, com quatro telescópios principais de 8,2m e outros mais pequenos. O laser amarelo cria uma estrela artificial a cerca de 90 km de altitude. Serve de referência para corrigir o desfoque causado pela atmosfera.',
    panel: { az: 0, el: -4 },
    portals: [
      { to: 'alma', az: -38, el: -4 },
      { to: 'la-silla', az: 38,  el: -4 }
    ]
  },
  {
    id: 'la-silla',
    data: [['COORDENADAS', '29°15′ S  70°44′ O'], ['ALTITUDE', '2400m'], ['OBSERVA', 'Visível e infravermelho']],
    thumb: 'img/thumbs/la-silla.jpg',
    title: 'Observatório de La Silla',
    short: 'Observatório de La Silla',
    img: 'img/la-silla-night.jpg',
    credit: 'ESO/B. Tafreshi',
    body: 'Foi o primeiro observatório da ESO no Chile e continua em funcionamento. Aqui estão telescópios como o NTT, o de 3,6m da ESO e o de 2,2m. Por cima, vê-se a Via Láctea.',
    panel: { az: 0, el: -4 },
    portals: [
      { to: 'paranal', az: -38, el: -4 },
      { to: 'alma', az: 38,  el: -4 }
    ]
  }
];
