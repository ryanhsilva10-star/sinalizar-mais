// Importação de todos os modelos visuais oficiais do alfabeto manual em LIBRAS
import letterA from "@/assets/A.jpg";
import letterB from "@/assets/B.jpg";
import letterC from "@/assets/C.jpg";
import letterD from "@/assets/D.webp";
import letterE from "@/assets/E.webp";
import letterF_front from "@/assets/F de frente.webp";
import letterF_side from "@/assets/F de lado.webp";
import letterG from "@/assets/G.webp";
import letterH_gif from "@/assets/H gif.mp4";
import letterI from "@/assets/I.webp";
import letterJ_gif from "@/assets/J gif.mp4";
import letterK_gif from "@/assets/K gif.mp4";
import letterL from "@/assets/L.webp";
import letterM from "@/assets/M.webp";
import letterN from "@/assets/N.webp";
import letterO from "@/assets/O.webp";
import letterP from "@/assets/P.webp";
import letterQ from "@/assets/Q.webp";
import letterR from "@/assets/R.webp";
import letterS from "@/assets/S.webp";
import letterT_front from "@/assets/T de frente.webp";
import letterT_side from "@/assets/T de lado.webp";
import letterU from "@/assets/U.webp";
import letterV from "@/assets/V.webp";
import letterW from "@/assets/W.webp";
import letterX_gif from "@/assets/X gif.mp4";
import letterY from "@/assets/Y.jpg";
import letterZ_gif from "@/assets/Z gif.mp4";

export type AlphabetLetterReference = {
  letter: string;
  name: string;
  emoji: string;
  mediaType: "image" | "video" | "dual_image";
  primaryMedia: string;
  secondaryMedia?: string;
  secondaryLabel?: string;
  hasMovement: boolean;
  movementType?: "rotation" | "curve" | "upward_bounce" | "pull" | "zigzag" | "static";
  movementInstructions?: string;
  handShapeDescription: string;
  orientationDescription: string;
  pedagogicalTip: string;
  correctionCues: {
    rule: string;
    correction: string;
  }[];
  relatedSigns?: string[];
};

export const ALPHABET_OFFICIAL_REFERENCES: Record<string, AlphabetLetterReference> = {
  A: {
    letter: "A",
    name: "Letra A",
    emoji: "🅰️",
    mediaType: "image",
    primaryMedia: letterA,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Punho fechado com os 4 dedos recolhidos na palma e o polegar estendido ao lado do indicador.",
    orientationDescription: "Palma da mão voltada para a frente, dedos na vertical.",
    pedagogicalTip: "Feche a mão como se fosse dar um soco leve, mas deixe o polegar ereto e encostado na lateral do indicador.",
    correctionCues: [
      {
        rule: "Polegar na lateral",
        correction: "Não cruze o polegar sobre os dedos (isso seria a letra S). Deixe-o encostado ao lado do indicador.",
      },
      {
        rule: "Palma para frente",
        correction: "Mantenha o dorso da mão visível pelo lado e a palma virada para a frente/câmera.",
      },
    ],
    relatedSigns: ["ARCO-IRIS", "AMOR", "AMIZADE", "APRENDER"],
  },
  B: {
    letter: "B",
    name: "Letra B",
    emoji: "🅱️",
    mediaType: "image",
    primaryMedia: letterB,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Quatro dedos estendidos e unidos para cima; o polegar fica dobrado e repousando sobre a palma da mão.",
    orientationDescription: "Palma da mão voltada para a frente com dedos retos apontando para cima.",
    pedagogicalTip: "Mantenha os 4 dedos (indicador ao mínimo) bem unidos e esticados para cima, dobrando o polegar na frente da palma.",
    correctionCues: [
      {
        rule: "Dedos unidos",
        correction: "Não afaste os dedos (mantenha indicador, médio, anelar e mínimo colados).",
      },
      {
        rule: "Polegar recolhido",
        correction: "Dobre o polegar sobre o centro da palma da mão.",
      },
    ],
    relatedSigns: ["AZUL", "TCHAU", "BOM DIA", "BEM-VINDO", "TUDO BEM"],
  },
  C: {
    letter: "C",
    name: "Letra C",
    emoji: "🌙",
    mediaType: "image",
    primaryMedia: letterC,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Todos os 4 dedos e o polegar curvados formando um semicírculo em formato de 'C'.",
    orientationDescription: "Mão levemente inclinada de perfil/frente para evidenciar o arco do 'C'.",
    pedagogicalTip: "Curve os dedos suavemente como se estivesse segurando um copo ou maçã, formando a curva da letra C.",
    correctionCues: [
      {
        rule: "Arco aberto",
        correction: "Não feche as pontas dos dedos no polegar (isso seria a letra O). Deixe um espaço entre as pontas.",
      },
      {
        rule: "Curvatura uniforme",
        correction: "Mantenha todos os dedos curvados no mesmo arco paralelo.",
      },
    ],
    relatedSigns: ["CAO", "COELHO", "CASTELO", "CASA", "CONHECER", "CORAGEM"],
  },
  D: {
    letter: "D",
    name: "Letra D",
    emoji: "☝️",
    mediaType: "image",
    primaryMedia: letterD,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Apenas o dedo indicador estendido apontando para cima; as pontas do médio, anelar e mínimo tocam a ponta do polegar formando um círculo.",
    orientationDescription: "Indicador ereto na vertical; anel formado pelos demais dedos voltado para frente.",
    pedagogicalTip: "Aponte o indicador para o alto e encoste as pontas dos outros 3 dedos no polegar, criando a haste e a barriga da letra D.",
    correctionCues: [
      {
        rule: "Apenas indicador ereto",
        correction: "Certifique-se de que o dedo médio não está levantado. Apenas o indicador deve ficar ereto.",
      },
      {
        rule: "Círculo na base",
        correction: "Una as pontas dos dedos médio, anelar e mínimo na ponta do polegar.",
      },
    ],
    relatedSigns: ["VERMELHO", "DADO", "DIA"],
  },
  E: {
    letter: "E",
    name: "Letra E",
    emoji: "✊",
    mediaType: "image",
    primaryMedia: letterE,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Todos os 4 dedos dobrados pelas falanges médias sobre a palma; o polegar fica recolhido por baixo tocando as pontas dos dedos.",
    orientationDescription: "Palma voltada para a frente, mostrando a curva das unhas e falanges.",
    pedagogicalTip: "Dobre os quatro dedos para baixo como uma garra fechada e repouse as pontas sobre a lateral/ponta do polegar.",
    correctionCues: [
      {
        rule: "Falanges flexionadas",
        correction: "Dobre apenas as duas primeiras articulações dos dedos, sem fechar totalmente o punho.",
      },
      {
        rule: "Polegar abaixo dos dedos",
        correction: "O polegar deve ficar recolhido por baixo dos dedos dobrados.",
      },
    ],
    relatedSigns: ["ESCOLA", "ESTUDAR", "ESPERANCA"],
  },
  F: {
    letter: "F",
    name: "Letra F",
    emoji: "👌",
    mediaType: "dual_image",
    primaryMedia: letterF_front,
    secondaryMedia: letterF_side,
    secondaryLabel: "Vista de Lado (Polegar por Fora)",
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dedos médio, anelar e mínimo estendidos para cima. O indicador dobra e o polegar encosta POR FORA dele.",
    orientationDescription: "Palma voltada para a frente. O polegar fica posicionado no lado externo do indicador.",
    pedagogicalTip: "Regra mnemônica de ouro: 'F de Fora' (o polegar fica por FORA do indicador). Compare com a Letra T onde o polegar é por dentro!",
    correctionCues: [
      {
        rule: "Polegar por FORA",
        correction: "O polegar DEVE ficar encostado no lado externo do indicador. Se estiver por dentro, torna-se a letra T!",
      },
      {
        rule: "Três dedos esticados",
        correction: "Mantenha o médio, anelar e mínimo retos e apontados para cima.",
      },
    ],
    relatedSigns: ["FELIZ", "FAMILIA", "FILHO", "FESTA"],
  },
  G: {
    letter: "G",
    name: "Letra G",
    emoji: "👉",
    mediaType: "image",
    primaryMedia: letterG,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Mão posicionada de lado; dedo indicador estendido na horizontal e polegar paralelo a ele apontando para o mesmo lado.",
    orientationDescription: "Mão de perfil/lado, indicador e polegar paralelos na horizontal, outros dedos recolhidos.",
    pedagogicalTip: "Coloque a mão na horizontal apontando o indicador para o lado, com o polegar reto ao lado dele, como se medisse uma distância pequena.",
    correctionCues: [
      {
        rule: "Orientação horizontal",
        correction: "Vire a mão de lado. O indicador não deve apontar para cima nem para baixo.",
      },
      {
        rule: "Polegar paralelo",
        correction: "O polegar deve ficar paralelo ao indicador, sem abrir em 90 graus.",
      },
    ],
    relatedSigns: ["GATO", "GALINHA", "GOSTAR"],
  },
  H: {
    letter: "H",
    name: "Letra H",
    emoji: "✌️",
    mediaType: "video",
    primaryMedia: letterH_gif,
    hasMovement: true,
    movementType: "rotation",
    movementInstructions: "Com o indicador e médio estendidos e polegar entre eles, gire a mão em 180° ou balance suavemente na horizontal.",
    handShapeDescription: "Indicador e dedo médio estendidos para a frente com o polegar apoiado entre eles; anelar e mínimo dobrados.",
    orientationDescription: "Mão na horizontal realizando movimento de rotação/giro no próprio eixo.",
    pedagogicalTip: "Observe o GIF oficial: mantenha a configuração de dois dedos com o polegar no meio e faça a rotação suave do punho!",
    correctionCues: [
      {
        rule: "Movimento de giro",
        correction: "O sinal da letra H possui rotação! Gire o punho na horizontal como indicado no modelo visual.",
      },
      {
        rule: "Polegar entre os dedos",
        correction: "Apoie a ponta do polegar entre as bases do indicador e do dedo médio.",
      },
    ],
    relatedSigns: ["HARMONIA", "HOJE", "HORA"],
  },
  I: {
    letter: "I",
    name: "Letra I",
    emoji: "🤙",
    mediaType: "image",
    primaryMedia: letterI,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Apenas o dedo mínimo (mindinho) estendido e apontado para cima. Os outros 3 dedos dobrados com o polegar sobre eles.",
    orientationDescription: "Palma voltada para a frente com o mindinho ereto na vertical.",
    pedagogicalTip: "Erga apenas o menor dedo da mão (o mindinho) para o alto e recolha todos os outros dedos na palma.",
    correctionCues: [
      {
        rule: "Apenas o mindinho",
        correction: "Dobre o indicador, médio e anelar na palma e cubra-os com o polegar.",
      },
      {
        rule: "Sem polegar aberto",
        correction: "Não estenda o polegar para o lado (isso seria a letra Y). Deixe o polegar repousado sobre os dedos.",
      },
    ],
    relatedSigns: ["IRMAO", "IGREJA", "IDADE"],
  },
  J: {
    letter: "J",
    name: "Letra J",
    emoji: "🪄",
    mediaType: "video",
    primaryMedia: letterJ_gif,
    hasMovement: true,
    movementType: "curve",
    movementInstructions: "Com a mão em 'I' (mindinho para cima), desenhe a curva da letra 'J' no ar descendo e virando para dentro.",
    handShapeDescription: "Configuração de mão da letra 'I' (apenas o mindinho estendido para cima) com movimento de traçado curvo.",
    orientationDescription: "Movimento descendente em curva no ar em frente ao corpo.",
    pedagogicalTip: "Observe o GIF oficial: use a ponta do dedo mindinho como se fosse uma caneta mágica desenhando o gancho da letra J no ar!",
    correctionCues: [
      {
        rule: "Traçado curvo",
        correction: "Desça a mão e faça a volta curva do 'J' no ar em direção ao seu corpo.",
      },
      {
        rule: "Mantenha apenas o mindinho",
        correction: "Não abra outros dedos durante a execução do traçado.",
      },
    ],
    relatedSigns: ["JUNTOS", "JOGAR", "JOVEM"],
  },
  K: {
    letter: "K",
    name: "Letra K",
    emoji: "✌️",
    mediaType: "video",
    primaryMedia: letterK_gif,
    hasMovement: true,
    movementType: "upward_bounce",
    movementInstructions: "Indicador para cima e médio inclinado com polegar no meio; dê um impulso seco da mão para CIMA.",
    handShapeDescription: "Indicador estendido para cima, dedo médio inclinado para frente e polegar apoiado entre eles.",
    orientationDescription: "Mão na vertical/diagonal realizando um movimento rápido de elevação (para cima).",
    pedagogicalTip: "Observe o GIF oficial: monte a configuração dos dedos e dê um salto/toque suave com a mão para o alto!",
    correctionCues: [
      {
        rule: "Movimento para CIMA",
        correction: "A letra K exige o movimento de subida/impulso vertical. Eleve a mão durante o sinal.",
      },
      {
        rule: "Posicionamento do polegar",
        correction: "Encaixe a ponta do polegar entre o indicador e o dedo médio.",
      },
    ],
    relatedSigns: ["KILO", "KART", "KID"],
  },
  L: {
    letter: "L",
    name: "Letra L",
    emoji: "👆",
    mediaType: "image",
    primaryMedia: letterL,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dedo indicador estendido para cima e polegar aberto lateralmente a 90°, formando a letra 'L'. Demais dedos recolhidos.",
    orientationDescription: "Palma voltada para a frente, destacando o ângulo reto entre o indicador e o polegar.",
    pedagogicalTip: "Forme um 'L' perfeito com o indicador reto para o alto e o polegar bem aberto para o lado.",
    correctionCues: [
      {
        rule: "Ângulo de 90°",
        correction: "Abra bem o polegar para a lateral formando um ângulo reto com o indicador.",
      },
      {
        rule: "3 dedos recolhidos",
        correction: "Mantenha o médio, anelar e mínimo bem fechados na palma.",
      },
    ],
    relatedSigns: ["LARANJA", "LIVRO", "LUA", "LEAO"],
  },
  M: {
    letter: "M",
    name: "Letra M",
    emoji: "👇",
    mediaType: "image",
    primaryMedia: letterM,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Três dedos (indicador, médio e anelar) estendidos e apontados para BAIXO sobre o polegar recolhido. Mínimo dobrado.",
    orientationDescription: "Mão voltada com os 3 dedos apontando para baixo, simulando as 3 pernas da letra M.",
    pedagogicalTip: "Aponte 3 dedos (indicador, médio e anelar) para baixo, apoiados sobre o polegar escondido.",
    correctionCues: [
      {
        rule: "3 dedos para baixo",
        correction: "Verifique se o dedo anelar também está estendido para baixo junto ao indicador e médio.",
      },
      {
        rule: "Mínimo recolhido",
        correction: "Apenas o dedo mínimo fica fechado na palma.",
      },
    ],
    relatedSigns: ["MAE", "MEU", "MACA"],
  },
  N: {
    letter: "N",
    name: "Letra N",
    emoji: "👇",
    mediaType: "image",
    primaryMedia: letterN,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dois dedos (indicador e médio) estendidos e apontados para BAIXO sobre o polegar. Anelar e mínimo recolhidos.",
    orientationDescription: "Mão voltada com os 2 dedos apontando para baixo, simulando as 2 pernas da letra N.",
    pedagogicalTip: "Aponte 2 dedos (indicador e médio) para baixo, dobrando o anelar e o mindinho.",
    correctionCues: [
      {
        rule: "Apenas 2 dedos para baixo",
        correction: "Não estenda o anelar (com 3 dedos seria a letra M). Mantenha apenas indicador e médio.",
      },
      {
        rule: "Orientação para baixo",
        correction: "Os dedos devem apontar diretamente para baixo.",
      },
    ],
    relatedSigns: ["NOME", "NOITE", "NAVIO"],
  },
  O: {
    letter: "O",
    name: "Letra O",
    emoji: "⭕",
    mediaType: "image",
    primaryMedia: letterO,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "As pontas de todos os quatro dedos encostam na ponta do polegar, formando um círculo ou óvalo perfeito.",
    orientationDescription: "Palma voltada levemente de frente/lado para mostrar o círculo aberto do 'O'.",
    pedagogicalTip: "Encoste as pontas dos dedos na ponta do polegar formando uma rodinha redonda perfeita como a letra O.",
    correctionCues: [
      {
        rule: "Pontas unidas ao polegar",
        correction: "Feche as pontas dos 4 dedos no polegar formando um anel completo.",
      },
      {
        rule: "Espaço oco no centro",
        correction: "Mantenha o meio da mão aberto formando um túnel redondo visível.",
      },
    ],
    relatedSigns: ["OI", "OBRIGADO", "OUVIR", "ONIBUS"],
  },
  P: {
    letter: "P",
    name: "Letra P",
    emoji: "👇",
    mediaType: "image",
    primaryMedia: letterP,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Indicador na horizontal, dedo médio inclinado apontando para BAIXO e polegar apoiado entre eles.",
    orientationDescription: "Mão na horizontal com o dedo médio apontado para baixo.",
    pedagogicalTip: "Mesma configuração da letra K e H, porém com a mão inclinada de modo que o dedo médio aponte para baixo.",
    correctionCues: [
      {
        rule: "Médio para baixo",
        correction: "Incline a mão de forma que o dedo médio fique apontado para o chão.",
      },
      {
        rule: "Indicador horizontal",
        correction: "O indicador deve permanecer estendido na horizontal.",
      },
    ],
    relatedSigns: ["PAI", "POR FAVOR", "PRAZER", "PAZ"],
  },
  Q: {
    letter: "Q",
    name: "Letra Q",
    emoji: "👇",
    mediaType: "image",
    primaryMedia: letterQ,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Indicador e polegar estendidos e apontados para BAIXO em formato de pinça aberta. Médio, anelar e mínimo fechados.",
    orientationDescription: "Mão virada para baixo com a pinça aberta (como um 'G' apontado para o chão).",
    pedagogicalTip: "Faça a pinça com o indicador e polegar apontando para o chão, como se fosse pinçar algo embaixo.",
    correctionCues: [
      {
        rule: "Apontar para BAIXO",
        correction: "Vire o punho de modo que a pinça aponte para baixo (se apontar para o lado seria a letra G).",
      },
      {
        rule: "Pinça aberta",
        correction: "Deixe um espaço de 2 a 3 cm entre a ponta do indicador e do polegar.",
      },
    ],
    relatedSigns: ["QUERER", "QUEM", "QUANDO"],
  },
  R: {
    letter: "R",
    name: "Letra R",
    emoji: "🤞",
    mediaType: "image",
    primaryMedia: letterR,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dedo indicador e médio estendidos para cima e CRUZADOS (o dedo médio cruza sobre o indicador). Anelar e mínimo dobrados com polegar sobre eles.",
    orientationDescription: "Palma voltada para a frente com os dedos cruzados apontando para o alto.",
    pedagogicalTip: "Faça o famoso sinal de 'dedos cruzados' (boa sorte) com o indicador e dedo médio entrelaçados para cima.",
    correctionCues: [
      {
        rule: "Dedos cruzados",
        correction: "Cruze o dedo médio por cima do indicador.",
      },
      {
        rule: "Polegar sobre anelar e mínimo",
        correction: "Mantenha os dedos anelar e mindinho bem recolhidos pelo polegar.",
      },
    ],
    relatedSigns: ["REI", "ROXO", "RUA", "RESPEITO"],
  },
  S: {
    letter: "S",
    name: "Letra S",
    emoji: "✊",
    mediaType: "image",
    primaryMedia: letterS,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Punho totalmente fechado, com o polegar CRUZANDO POR CIMA dos dedos (na frente das falanges médias).",
    orientationDescription: "Palma voltada para a frente, mostrando o polegar na horizontal na frente dos dedos fechados.",
    pedagogicalTip: "Feche a mão em punho e passe o polegar por CIMA dos dedos. Compare com a letra A (onde o polegar fica ao lado!).",
    correctionCues: [
      {
        rule: "Polegar cruzando na frente",
        correction: "O polegar deve repousar transversalmente na frente dos dedos fechados (não ao lado como na letra A).",
      },
      {
        rule: "Punho cerrado",
        correction: "Feche bem os quatro dedos na palma da mão.",
      },
    ],
    relatedSigns: ["SABER", "SAUDADE", "SINALIZAR", "SOL"],
  },
  T: {
    letter: "T",
    name: "Letra T",
    emoji: "🤞",
    mediaType: "dual_image",
    primaryMedia: letterT_front,
    secondaryMedia: letterT_side,
    secondaryLabel: "Vista de Lado (Polegar por Dentro)",
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dedos médio, anelar e mínimo estendidos para cima. O indicador dobra e o polegar fica encaixado POR DENTRO dele (figas).",
    orientationDescription: "Palma voltada para a frente. O polegar surge entre o indicador e o médio.",
    pedagogicalTip: "Regra mnemônica de ouro: 'T de Toca/Dentro' (o polegar fica escondido por DENTRO do indicador). Compare com o F (polegar por fora)!",
    correctionCues: [
      {
        rule: "Polegar por DENTRO",
        correction: "O polegar DEVE ficar encaixado por dentro (entre o indicador e o dedo médio). Se estiver por fora, é a letra F!",
      },
      {
        rule: "Três dedos estendidos",
        correction: "Mantenha médio, anelar e mínimo eretos apontados para cima.",
      },
    ],
    relatedSigns: ["TRISTE", "TER", "TRABALHAR", "TEMPO"],
  },
  U: {
    letter: "U",
    name: "Letra U",
    emoji: "✌️",
    mediaType: "image",
    primaryMedia: letterU,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dedo indicador e médio estendidos para cima, bem JUNTOS e paralelos. Polegar sobre anelar e mínimo recolhidos.",
    orientationDescription: "Palma voltada para a frente com os 2 dedos colados apontando para o alto.",
    pedagogicalTip: "Estique o indicador e o dedo médio para cima mantendo-os coladinhos lado a lado, sem abrir espaço entre eles.",
    correctionCues: [
      {
        rule: "Dedos colados/juntos",
        correction: "Não afaste os dedos (se abrir, vira a letra V). Mantenha indicador e médio colados.",
      },
      {
        rule: "Polegar segurando os outros",
        correction: "Mantenha anelar e mínimo dobrados com o polegar travando-os.",
      },
    ],
    relatedSigns: ["UNIAO", "URSO", "UNIVERSIDADE", "UM"],
  },
  V: {
    letter: "V",
    name: "Letra V",
    emoji: "✌️",
    mediaType: "image",
    primaryMedia: letterV,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Dedo indicador e médio estendidos para cima, bem AFASTADOS em formato de 'V' (sinal da paz/vitória).",
    orientationDescription: "Palma voltada para a frente com abertura evidente entre indicador e médio.",
    pedagogicalTip: "Faça o sinal da paz/vitória esticando o indicador e o dedo médio e abrindo bastante o espaço entre eles em forma de V.",
    correctionCues: [
      {
        rule: "Dedos bem afastados",
        correction: "Abra os dedos formando um 'V' nítido (se ficarem juntos, será a letra U).",
      },
      {
        rule: "Dois dedos eretos",
        correction: "Mantenha ambos os dedos retos e esticados para cima.",
      },
    ],
    relatedSigns: ["VITORIA", "VERMELHO", "VACA", "VERDE"],
  },
  W: {
    letter: "W",
    name: "Letra W",
    emoji: "🖐️",
    mediaType: "image",
    primaryMedia: letterW,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Três dedos (indicador, médio e anelar) estendidos para cima e AFASTADOS em forma de 'W'. Polegar sobre o mínimo dobrado.",
    orientationDescription: "Palma voltada para a frente com os 3 dedos abertos para cima.",
    pedagogicalTip: "Erga 3 dedos (indicador, médio e anelar) bem abertos e separados para cima formando a letra W.",
    correctionCues: [
      {
        rule: "3 dedos abertos",
        correction: "Mantenha indicador, médio e anelar estendidos e afastados entre si.",
      },
      {
        rule: "Mínimo recolhido",
        correction: "Apenas o dedo mínimo fica recolhido na palma sob o polegar.",
      },
    ],
    relatedSigns: ["WEB", "WHATSAPP", "WIFI"],
  },
  X: {
    letter: "X",
    name: "Letra X",
    emoji: "☝️",
    mediaType: "video",
    primaryMedia: letterX_gif,
    hasMovement: true,
    movementType: "pull",
    movementInstructions: "Dobre o indicador em formato de gancho/anzol e puxe a mão em direção ao seu corpo com um movimento suave.",
    handShapeDescription: "Dedo indicador flexionado em gancho (meio dobrado) com os outros dedos recolhidos e movimento de puxar.",
    orientationDescription: "Palma voltada de lado/frente realizando o movimento de tração/puxada para trás.",
    pedagogicalTip: "Observe o GIF oficial: dobre a ponta do indicador como um anzol de pesca e puxe a mão para trás em direção ao peito!",
    correctionCues: [
      {
        rule: "Indicador em gancho",
        correction: "Dobre a articulação do indicador formando um gancho.",
      },
      {
        rule: "Movimento de puxar",
        correction: "Puxe o sinal para trás em direção ao seu peito.",
      },
    ],
    relatedSigns: ["XICARA", "XERIFE", "XADREZ"],
  },
  Y: {
    letter: "Y",
    name: "Letra Y",
    emoji: "🤙",
    mediaType: "image",
    primaryMedia: letterY,
    hasMovement: false,
    movementType: "static",
    handShapeDescription: "Polegar e dedo mínimo estendidos para fora (sinal Hang Loose); indicador, médio e anelar dobrados na palma.",
    orientationDescription: "Palma voltada para você ou para frente com polegar e mindinho esticados para as laterais.",
    pedagogicalTip: "Faça o famoso sinal 'Hang Loose' abrindo o polegar e o dedo mindinho para os lados e fechando os 3 dedos do meio.",
    correctionCues: [
      {
        rule: "Polegar e mindinho esticados",
        correction: "Estenda simultaneamente o polegar e o dedo mínimo para fora.",
      },
      {
        rule: "3 dedos do meio fechados",
        correction: "Mantenha indicador, médio e anelar bem recolhidos na palma.",
      },
    ],
    relatedSigns: ["AMARELO", "DESCULPA", "VACA"],
  },
  Z: {
    letter: "Z",
    name: "Letra Z",
    emoji: "⚡",
    mediaType: "video",
    primaryMedia: letterZ_gif,
    hasMovement: true,
    movementType: "zigzag",
    movementInstructions: "Com o indicador estendido para a frente, desenhe o traçado da letra 'Z' no ar (reta direita -> diagonal esquerda -> reta direita).",
    handShapeDescription: "Dedo indicador estendido apontando para frente realizando a trajetória completa de um 'Z' no ar.",
    orientationDescription: "Indicador desenha o zigue-zague no ar no espaço neutro em frente ao peito.",
    pedagogicalTip: "Observe o GIF oficial: use a ponta do indicador para desenhar um raio ou a letra Z no ar, com 3 traços claros!",
    correctionCues: [
      {
        rule: "Traçar o Z completo",
        correction: "Desenhe os 3 traços da letra Z no ar: linha horizontal superior, diagonal para baixo e linha horizontal inferior.",
      },
      {
        rule: "Apenas indicador",
        correction: "Mantenha todos os outros dedos fechados na palma.",
      },
    ],
    relatedSigns: ["ZEBRA", "ZERO", "ZOO"],
  },
};

/**
 * Retorna a referência oficial da letra do alfabeto em LIBRAS.
 */
export function getAlphabetReference(letter: string): AlphabetLetterReference {
  const upper = letter.toUpperCase();
  if (ALPHABET_OFFICIAL_REFERENCES[upper]) {
    return ALPHABET_OFFICIAL_REFERENCES[upper];
  }
  // Fallback padrão se não encontrado
  return ALPHABET_OFFICIAL_REFERENCES["A"];
}

/**
 * Lista de todas as 26 letras com referências oficiais
 */
export const ALL_ALPHABET_LETTERS: AlphabetLetterReference[] = Object.values(
  ALPHABET_OFFICIAL_REFERENCES
);
