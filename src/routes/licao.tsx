import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import luviMascot from "@/assets/luvi-mascot.png";
import { LibrasLessonMirror, type LessonMirrorScore } from "@/components/LibrasLessonMirror";
import { AlphabetReferenceModal } from "@/components/AlphabetReferenceModal";
import { getAlphabetReference } from "@/utils/alphabetReference";
import { getAnimalMascot, type AnimalMascot } from "@/utils/animalMascots";
import { AnimalMascotDisplay } from "@/components/AnimalMascotDisplay";
import { soundFx } from "@/lib/sound-effects";
import { getActiveUser, saveUser, User } from "@/lib/user-store";
import { toast } from "sonner";
import { BookOpen, Play, RotateCw, Sparkles, CheckCircle2, Lightbulb, Heart, ArrowRight, RefreshCw, Trophy } from "lucide-react";

/** Função utilitária para embaralhar alternativas de resposta */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type LessonItem = {
  pt: string;
  letter: string;
  sign: string;
  emoji: string;
  tone: string;
  targetLetter: string;
  signTip: string;
  handShapeDesc?: string;
  bodyLocation?: string;
  animalName: string;
  species: string;
  animalEmoji: string;
};

export type LessonNodeData = {
  id: number;
  title: string;
  subtitle: string;
  colors: LessonItem[];
};

/**
 * CURRÍCULO 100% ALFABETO EM LIBRAS:
 * Cada lição ensina exatamente 3 letras por vez com os bichinhos mascotes,
 * usando as imagens/vídeos oficiais como exemplo de referência!
 */
export const LESSONS_DATA: Record<number, LessonNodeData> = {
  // MUNDO 1 (Fases 1 a 12)
  1: {
    id: 1,
    title: "Letras A, B e C com os Mascotes",
    subtitle: "Lição 1: Primeiras Letras do Alfabeto em LIBRAS",
    colors: [
      {
        pt: "Letra A",
        letter: "A",
        targetLetter: "A",
        sign: "Punho fechado com polegar lateral",
        emoji: "🦫",
        animalEmoji: "🦫",
        animalName: "Capivarinha Luvi",
        species: "Capivara",
        tone: "bg-sunshine",
        signTip: "Feche a mão em punho e apoie o polegar estendido ao lado do dedo indicador.",
        handShapeDesc: "Punho fechado com polegar ao lado",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra B",
        letter: "B",
        targetLetter: "B",
        sign: "4 dedos eretos com polegar na palma",
        emoji: "🐰",
        animalEmoji: "🐰",
        animalName: "Coelhinho Theo",
        species: "Coelho",
        tone: "bg-sky",
        signTip: "Mantenha os 4 dedos unidos apontando para cima e dobre o polegar sobre a palma.",
        handShapeDesc: "Mão em 'B' com dedos unidos",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra C",
        letter: "C",
        targetLetter: "C",
        sign: "Dedos curvados em formato de C",
        emoji: "🐱",
        animalEmoji: "🐱",
        animalName: "Gatinha Mel",
        species: "Gatinha",
        tone: "bg-coral",
        signTip: "Curve os dedos e o polegar suavemente formando um semicírculo em forma de 'C'.",
        handShapeDesc: "Dedos em arco semicircular",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  2: {
    id: 2,
    title: "Letras D, E e F com os Mascotes",
    subtitle: "Lição 2: Letras de Dedo Indicador e Polegar",
    colors: [
      {
        pt: "Letra D",
        letter: "D",
        targetLetter: "D",
        sign: "Indicador para cima e dedos no polegar",
        emoji: "🦖",
        animalEmoji: "🦖",
        animalName: "Dinossauro Dino",
        species: "Dino",
        tone: "bg-mint",
        signTip: "Aponte apenas o indicador para o alto e encoste os outros dedos no polegar.",
        handShapeDesc: "Indicador ereto com base em anel",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra E",
        letter: "E",
        targetLetter: "E",
        sign: "Dedos curvados apoiados no polegar",
        emoji: "🐘",
        animalEmoji: "🐘",
        animalName: "Elefantinho Nino",
        species: "Elefante",
        tone: "bg-grape",
        signTip: "Dobre os 4 dedos com as pontinhas apoiadas no polegar recolhido.",
        handShapeDesc: "Dedos recolhidos no polegar",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra F",
        letter: "F",
        targetLetter: "F",
        sign: "Polegar por FORA do indicador dobrado",
        emoji: "🦭",
        animalEmoji: "🦭",
        animalName: "Foquinha Pipoca",
        species: "Foca",
        tone: "bg-sky",
        signTip: "Dobre o indicador e coloque o polegar por FORA dele. Lembre-se: F = Fora!",
        handShapeDesc: "Indicador dobrado com polegar externo",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  3: {
    id: 3,
    title: "Revisão: Letras A, B e C",
    subtitle: "Fixação e Prática Rápida com os Bichinhos",
    colors: [
      {
        pt: "Letra A",
        letter: "A",
        targetLetter: "A",
        sign: "Punho fechado com polegar lateral",
        emoji: "🦫",
        animalEmoji: "🦫",
        animalName: "Capivarinha Luvi",
        species: "Capivara",
        tone: "bg-sunshine",
        signTip: "Punho fechado com o polegar ao lado do indicador.",
        handShapeDesc: "Punho fechado",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra B",
        letter: "B",
        targetLetter: "B",
        sign: "4 dedos eretos e polegar recolhido",
        emoji: "🐰",
        animalEmoji: "🐰",
        animalName: "Coelhinho Theo",
        species: "Coelho",
        tone: "bg-sky",
        signTip: "4 dedos unidos apontados para cima.",
        handShapeDesc: "Mão em 'B'",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra C",
        letter: "C",
        targetLetter: "C",
        sign: "Dedos em semicírculo 'C'",
        emoji: "🐱",
        animalEmoji: "🐱",
        animalName: "Gatinha Mel",
        species: "Gatinha",
        tone: "bg-coral",
        signTip: "Curvatura aberta em C.",
        handShapeDesc: "Arco em C",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  4: {
    id: 4,
    title: "Chefe da Ilha 1: Letras D, E e F",
    subtitle: "Desafio de Maestria das Letras Iniciais",
    colors: [
      {
        pt: "Letra D",
        letter: "D",
        targetLetter: "D",
        sign: "Indicador ereto para cima",
        emoji: "🦖",
        animalEmoji: "🦖",
        animalName: "Dinossauro Dino",
        species: "Dino",
        tone: "bg-mint",
        signTip: "Indicador apontando para cima com círculo na base.",
        handShapeDesc: "Haste do D",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra E",
        letter: "E",
        targetLetter: "E",
        sign: "Dedos recolhidos no polegar",
        emoji: "🐘",
        animalEmoji: "🐘",
        animalName: "Elefantinho Nino",
        species: "Elefante",
        tone: "bg-grape",
        signTip: "Dedos curvados sobre o polegar.",
        handShapeDesc: "Letra E dobrada",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra F",
        letter: "F",
        targetLetter: "F",
        sign: "Polegar por FORA do indicador",
        emoji: "🦭",
        animalEmoji: "🦭",
        animalName: "Foquinha Pipoca",
        species: "Foca",
        tone: "bg-sky",
        signTip: "Polegar cruzado por fora do dedo indicador.",
        handShapeDesc: "Letra F oficial",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  5: {
    id: 5,
    title: "Letras G, H e I com os Mascotes",
    subtitle: "Lição 3: Movimento e Dedos Especiais",
    colors: [
      {
        pt: "Letra G",
        letter: "G",
        targetLetter: "G",
        sign: "Indicador e polegar paralelos para cima",
        emoji: "🦒",
        animalEmoji: "🦒",
        animalName: "Girafinha Gigi",
        species: "Girafa",
        tone: "bg-sunshine",
        signTip: "Estenda o indicador para cima com o polegar ao lado formando uma haste.",
        handShapeDesc: "Indicador e polegar paralelos",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra H",
        letter: "H",
        targetLetter: "H",
        sign: "Dedos em V com polegar no meio girando",
        emoji: "🦛",
        animalEmoji: "🦛",
        animalName: "Hipopótamo Pipo",
        species: "Hipopótamo",
        tone: "bg-mint",
        signTip: "Faça o sinal em 'V' com o polegar no meio e faça um giro suave do pulso.",
        handShapeDesc: "Mão em 'V' com giro",
        bodyLocation: "Espaço neutro",
      },
      {
        pt: "Letra I",
        letter: "I",
        targetLetter: "I",
        sign: "Dedo mindinho estendido para cima",
        emoji: "🦎",
        animalEmoji: "🦎",
        animalName: "Iguana Izi",
        species: "Iguana",
        tone: "bg-neon",
        signTip: "Feche a mão e estenda somente o dedo mínimo (mindinho) para o alto.",
        handShapeDesc: "Mindinho ereto",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  6: {
    id: 6,
    title: "Letras J, K e L com os Mascotes",
    subtitle: "Lição 4: Traçado no Ar e Ângulo Reto",
    colors: [
      {
        pt: "Letra J",
        letter: "J",
        targetLetter: "J",
        sign: "Mindinho desenhando um 'J' no ar",
        emoji: "🐊",
        animalEmoji: "🐊",
        animalName: "Jacarezinho Joca",
        species: "Jacaré",
        tone: "bg-mint",
        signTip: "Mantenha a mão em 'I' (mindinho) e desenhe a curva da letra J no ar.",
        handShapeDesc: "Traçado com mindinho",
        bodyLocation: "Ar em frente ao corpo",
      },
      {
        pt: "Letra K",
        letter: "K",
        targetLetter: "K",
        sign: "Dedos em V com polegar no meio subindo",
        emoji: "🐨",
        animalEmoji: "🐨",
        animalName: "Coala Kiki",
        species: "Coala",
        tone: "bg-grape",
        signTip: "Forme o 'V' com o polegar entre os dedos e faça um movimento curto para cima.",
        handShapeDesc: "Mão em 'K' com impulso",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra L",
        letter: "L",
        targetLetter: "L",
        sign: "Indicador e polegar em ângulo reto 'L'",
        emoji: "🦁",
        animalEmoji: "🦁",
        animalName: "Leãozinho Léo",
        species: "Leão",
        tone: "bg-coral",
        signTip: "Abra o indicador para cima e o polegar para o lado formando a letra 'L'.",
        handShapeDesc: "Ângulo reto 'L'",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  7: {
    id: 7,
    title: "Espelho com IA: Letras G, H e I",
    subtitle: "Prática e Validação na Câmera com os Mascotes",
    colors: [
      {
        pt: "Letra G",
        letter: "G",
        targetLetter: "G",
        sign: "Indicador para cima com polegar",
        emoji: "🦒",
        animalEmoji: "🦒",
        animalName: "Girafinha Gigi",
        species: "Girafa",
        tone: "bg-sunshine",
        signTip: "Mostre o indicador ereto para a câmera.",
        handShapeDesc: "Letra G na câmera",
        bodyLocation: "Centro do vídeo",
      },
      {
        pt: "Letra H",
        letter: "H",
        targetLetter: "H",
        sign: "Dedos em V com giro suave",
        emoji: "🦛",
        animalEmoji: "🦛",
        animalName: "Hipopótamo Pipo",
        species: "Hipopótamo",
        tone: "bg-mint",
        signTip: "Faça o formato em V com polegar no meio.",
        handShapeDesc: "Letra H na câmera",
        bodyLocation: "Centro do vídeo",
      },
      {
        pt: "Letra I",
        letter: "I",
        targetLetter: "I",
        sign: "Mindinho para cima",
        emoji: "🦎",
        animalEmoji: "🦎",
        animalName: "Iguana Izi",
        species: "Iguana",
        tone: "bg-neon",
        signTip: "Erga o mindinho bem firme por 2 segundos.",
        handShapeDesc: "Letra I na câmera",
        bodyLocation: "Centro do vídeo",
      },
    ],
  },
  8: {
    id: 8,
    title: "Chefe da Ilha 2: Letras J, K e L",
    subtitle: "Desafio de Agilidade do Meio do Alfabeto",
    colors: [
      {
        pt: "Letra J",
        letter: "J",
        targetLetter: "J",
        sign: "Mindinho desenhando curva do J",
        emoji: "🐊",
        animalEmoji: "🐊",
        animalName: "Jacarezinho Joca",
        species: "Jacaré",
        tone: "bg-mint",
        signTip: "Desenhe a curvinha do J no ar com alegria.",
        handShapeDesc: "Traçado do J",
        bodyLocation: "Ar",
      },
      {
        pt: "Letra K",
        letter: "K",
        targetLetter: "K",
        sign: "Mão em V com polegar no meio",
        emoji: "🐨",
        animalEmoji: "🐨",
        animalName: "Coala Kiki",
        species: "Coala",
        tone: "bg-grape",
        signTip: "Formato do K com impulso para cima.",
        handShapeDesc: "Letra K",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra L",
        letter: "L",
        targetLetter: "L",
        sign: "Indicador e polegar em 'L'",
        emoji: "🦁",
        animalEmoji: "🦁",
        animalName: "Leãozinho Léo",
        species: "Leão",
        tone: "bg-coral",
        signTip: "Formato perfeito de 'L' com os dedos.",
        handShapeDesc: "Letra L",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  9: {
    id: 9,
    title: "Letras M, N e O com os Mascotes",
    subtitle: "Lição 5: Dedos Apontados para Baixo e Círculo",
    colors: [
      {
        pt: "Letra M",
        letter: "M",
        targetLetter: "M",
        sign: "Três dedos apontando para baixo",
        emoji: "🐵",
        animalEmoji: "🐵",
        animalName: "Macaquinho Mico",
        species: "Macaco",
        tone: "bg-sunshine",
        signTip: "Aponte 3 dedos (indicador, médio e anelar) para baixo apoiados no polegar.",
        handShapeDesc: "3 dedos para baixo",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra N",
        letter: "N",
        targetLetter: "N",
        sign: "Dois dedos apontando para baixo",
        emoji: "🐋",
        animalEmoji: "🐋",
        animalName: "Narval Nino",
        species: "Narval",
        tone: "bg-sky",
        signTip: "Aponte apenas 2 dedos (indicador e médio) para baixo sobre o polegar.",
        handShapeDesc: "2 dedos para baixo",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra O",
        letter: "O",
        targetLetter: "O",
        sign: "Todas as pontas dos dedos unidas no polegar",
        emoji: "🐑",
        animalEmoji: "🐑",
        animalName: "Ovelhinha Olívia",
        species: "Ovelha",
        tone: "bg-coral",
        signTip: "Junte as pontas de todos os dedos no polegar formando um círculo 'O' fechado.",
        handShapeDesc: "Círculo O fechado",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  10: {
    id: 10,
    title: "Letras P, Q e R com os Mascotes",
    subtitle: "Lição 6: Pinças e Dedos Cruzados",
    colors: [
      {
        pt: "Letra P",
        letter: "P",
        targetLetter: "P",
        sign: "Configuração em K apontada na horizontal",
        emoji: "🐼",
        animalEmoji: "🐼",
        animalName: "Pandinha Pan",
        species: "Panda",
        tone: "bg-grape",
        signTip: "Faça a mão como a letra K, mas posicione os dedos na horizontal para a frente.",
        handShapeDesc: "Mão em 'P' horizontal",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra Q",
        letter: "Q",
        targetLetter: "Q",
        sign: "Indicador e polegar para baixo em pinça",
        emoji: "🦘",
        animalEmoji: "🦘",
        animalName: "Quokka Quico",
        species: "Quokka",
        tone: "bg-mint",
        signTip: "Aponte o indicador e o polegar para baixo como uma pinça invertida.",
        handShapeDesc: "Pinça para baixo",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra R",
        letter: "R",
        targetLetter: "R",
        sign: "Médio cruzado sobre o indicador (dedos cruzados)",
        emoji: "🦊",
        animalEmoji: "🦊",
        animalName: "Raposinha Rubi",
        species: "Raposa",
        tone: "bg-coral",
        signTip: "Cruze o dedo médio sobre o indicador estendido, como sinal de boa sorte.",
        handShapeDesc: "Dedos cruzados 'R'",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  11: {
    id: 11,
    title: "Revisão: Letras M, N e O",
    subtitle: "Fixação e Prática Rápida com os Mascotes",
    colors: [
      {
        pt: "Letra M",
        letter: "M",
        targetLetter: "M",
        sign: "3 dedos para baixo",
        emoji: "🐵",
        animalEmoji: "🐵",
        animalName: "Macaquinho Mico",
        species: "Macaco",
        tone: "bg-sunshine",
        signTip: "3 dedinhos virados para baixo.",
        handShapeDesc: "Letra M",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra N",
        letter: "N",
        targetLetter: "N",
        sign: "2 dedos para baixo",
        emoji: "🐋",
        animalEmoji: "🐋",
        animalName: "Narval Nino",
        species: "Narval",
        tone: "bg-sky",
        signTip: "2 dedinhos virados para baixo.",
        handShapeDesc: "Letra N",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra O",
        letter: "O",
        targetLetter: "O",
        sign: "Círculo fechado em O",
        emoji: "🐑",
        animalEmoji: "🐑",
        animalName: "Ovelhinha Olívia",
        species: "Ovelha",
        tone: "bg-coral",
        signTip: "Círculo completo com os dedos.",
        handShapeDesc: "Letra O",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  12: {
    id: 12,
    title: "Grande Chefe Mundo 1: Letras P, Q e R",
    subtitle: "Batalha do Castelo do Saber e Conclusão do Mundo 1",
    colors: [
      {
        pt: "Letra P",
        letter: "P",
        targetLetter: "P",
        sign: "Mão na horizontal em P",
        emoji: "🐼",
        animalEmoji: "🐼",
        animalName: "Pandinha Pan",
        species: "Panda",
        tone: "bg-grape",
        signTip: "Dedo médio e indicador na horizontal.",
        handShapeDesc: "Letra P",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra Q",
        letter: "Q",
        targetLetter: "Q",
        sign: "Pinça apontada para baixo",
        emoji: "🦘",
        animalEmoji: "🦘",
        animalName: "Quokka Quico",
        species: "Quokka",
        tone: "bg-mint",
        signTip: "Indicador e polegar para baixo.",
        handShapeDesc: "Letra Q",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra R",
        letter: "R",
        targetLetter: "R",
        sign: "Dedos cruzados da sorte",
        emoji: "🦊",
        animalEmoji: "🦊",
        animalName: "Raposinha Rubi",
        species: "Raposa",
        tone: "bg-coral",
        signTip: "Médio cruzado no indicador.",
        handShapeDesc: "Letra R",
        bodyLocation: "Frente do peito",
      },
    ],
  },

  // MUNDO 2 (Fases 13 a 24)
  13: {
    id: 13,
    title: "Letras S, T e U com os Mascotes",
    subtitle: "Lição 7: Polegar na Frente, Dentro e Dedos Juntos",
    colors: [
      {
        pt: "Letra S",
        letter: "S",
        targetLetter: "S",
        sign: "Punho fechado com polegar na FRENTE dos dedos",
        emoji: "🐸",
        animalEmoji: "🐸",
        animalName: "Sapinho Sapeca",
        species: "Sapo",
        tone: "bg-neon",
        signTip: "Feche a mão em punho e cruze o polegar na FRENTE dos dedos indicador e médio.",
        handShapeDesc: "Polegar na frente do punho",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra T",
        letter: "T",
        targetLetter: "T",
        sign: "Indicador dobrado com polegar por DENTRO",
        emoji: "🐢",
        animalEmoji: "🐢",
        animalName: "Tartaruga Tatá",
        species: "Tartaruga",
        tone: "bg-mint",
        signTip: "Dobre o indicador e esconda o polegar por DENTRO dele. Lembre-se: T = de 'Toca' (dentro)!",
        handShapeDesc: "Polegar escondido por dentro",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra U",
        letter: "U",
        targetLetter: "U",
        sign: "Indicador e médio eretos e bem UNIDOS",
        emoji: "🐻",
        animalEmoji: "🐻",
        animalName: "Ursinho Uli",
        species: "Urso",
        tone: "bg-sunshine",
        signTip: "Estenda o indicador e o dedo médio bem coladinhos para cima.",
        handShapeDesc: "2 dedos juntos eretos",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  14: {
    id: 14,
    title: "Letras V, W e X com os Mascotes",
    subtitle: "Lição 8: Sinais da Paz, Três Dedos e Gancho",
    colors: [
      {
        pt: "Letra V",
        letter: "V",
        targetLetter: "V",
        sign: "Indicador e médio eretos e AFASTADOS",
        emoji: "🐮",
        animalEmoji: "🐮",
        animalName: "Vaquinha Vivi",
        species: "Vaca",
        tone: "bg-coral",
        signTip: "Abra o indicador e o médio formando o sinal em 'V' da vitória.",
        handShapeDesc: "Dedos em 'V' abertos",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra W",
        letter: "W",
        targetLetter: "W",
        sign: "Três dedos eretos para cima e afastados",
        emoji: "🦡",
        animalEmoji: "🦡",
        animalName: "Wombat Wally",
        species: "Wombat",
        tone: "bg-grape",
        signTip: "Levante o indicador, médio e anelar abertos apontando para cima formando um 'W'.",
        handShapeDesc: "3 dedos em 'W'",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra X",
        letter: "X",
        targetLetter: "X",
        sign: "Indicador em gancho puxando para trás",
        emoji: "🦜",
        animalEmoji: "🦜",
        animalName: "Pássaro Xexéu",
        species: "Pássaro",
        tone: "bg-sky",
        signTip: "Curve o indicador como um pequeno anzol e puxe a mão suavemente para trás.",
        handShapeDesc: "Gancho puxando em 'X'",
        bodyLocation: "Espaço neutro",
      },
    ],
  },
  15: {
    id: 15,
    title: "Revisão: Letras S, T e U",
    subtitle: "Fixação e Prática com os Mascotes",
    colors: [
      {
        pt: "Letra S",
        letter: "S",
        targetLetter: "S",
        sign: "Punho fechado com polegar na frente",
        emoji: "🐸",
        animalEmoji: "🐸",
        animalName: "Sapinho Sapeca",
        species: "Sapo",
        tone: "bg-neon",
        signTip: "Polegar cruzado na frente do punho.",
        handShapeDesc: "Letra S",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra T",
        letter: "T",
        targetLetter: "T",
        sign: "Polegar por dentro do indicador",
        emoji: "🐢",
        animalEmoji: "🐢",
        animalName: "Tartaruga Tatá",
        species: "Tartaruga",
        tone: "bg-mint",
        signTip: "Polegar escondido por dentro do indicador.",
        handShapeDesc: "Letra T",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra U",
        letter: "U",
        targetLetter: "U",
        sign: "2 dedos juntos para cima",
        emoji: "🐻",
        animalEmoji: "🐻",
        animalName: "Ursinho Uli",
        species: "Urso",
        tone: "bg-sunshine",
        signTip: "Dois dedos colados para cima.",
        handShapeDesc: "Letra U",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  16: {
    id: 16,
    title: "Chefe da Ilha 4: Letras V, W e X",
    subtitle: "Desafio de Agilidade dos Mascotes Aventureiros",
    colors: [
      {
        pt: "Letra V",
        letter: "V",
        targetLetter: "V",
        sign: "Dedos em V abertos",
        emoji: "🐮",
        animalEmoji: "🐮",
        animalName: "Vaquinha Vivi",
        species: "Vaca",
        tone: "bg-coral",
        signTip: "Dois dedos abertos em 'V'.",
        handShapeDesc: "Letra V",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra W",
        letter: "W",
        targetLetter: "W",
        sign: "Três dedos abertos em 'W'",
        emoji: "🦡",
        animalEmoji: "🦡",
        animalName: "Wombat Wally",
        species: "Wombat",
        tone: "bg-grape",
        signTip: "Três dedos levantados para cima.",
        handShapeDesc: "Letra W",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra X",
        letter: "X",
        targetLetter: "X",
        sign: "Gancho puxando para trás",
        emoji: "🦜",
        animalEmoji: "🦜",
        animalName: "Pássaro Xexéu",
        species: "Pássaro",
        tone: "bg-sky",
        signTip: "Gancho puxando para trás com suavidade.",
        handShapeDesc: "Letra X",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  17: {
    id: 17,
    title: "Letras Y, Z e A com os Mascotes",
    subtitle: "Lição 9: Hang Loose, Zigue-Zague e Recapitulação",
    colors: [
      {
        pt: "Letra Y",
        letter: "Y",
        targetLetter: "Y",
        sign: "Polegar e mínimo abertos (Hang Loose)",
        emoji: "🦬",
        animalEmoji: "🦬",
        animalName: "Yak Yoyo",
        species: "Yak",
        tone: "bg-sunshine",
        signTip: "Estenda o polegar e o dedo mínimo para os lados como o sinal de Hang Loose.",
        handShapeDesc: "Mão em 'Y' aberta",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra Z",
        letter: "Z",
        targetLetter: "Z",
        sign: "Indicador desenhando um Z no ar",
        emoji: "🦓",
        animalEmoji: "🦓",
        animalName: "Zebrinha Zazá",
        species: "Zebra",
        tone: "bg-grape",
        signTip: "Aponte o indicador e desenhe o zigue-zague da letra Z no ar.",
        handShapeDesc: "Traçado do Z no ar",
        bodyLocation: "Ar em frente ao corpo",
      },
      {
        pt: "Letra A",
        letter: "A",
        targetLetter: "A",
        sign: "Punho fechado com polegar lateral",
        emoji: "🦫",
        animalEmoji: "🦫",
        animalName: "Capivarinha Luvi",
        species: "Capivara",
        tone: "bg-sunshine",
        signTip: "Punho fechado com polegar encostado na lateral do indicador.",
        handShapeDesc: "Punho fechado",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  18: {
    id: 18,
    title: "Letras Dinâmicas: H, J e Z",
    subtitle: "Lição 10: Letras com Movimento no Ar em LIBRAS",
    colors: [
      {
        pt: "Letra H",
        letter: "H",
        targetLetter: "H",
        sign: "Dedos em V com rotação suave do pulso",
        emoji: "🦛",
        animalEmoji: "🦛",
        animalName: "Hipopótamo Pipo",
        species: "Hipopótamo",
        tone: "bg-mint",
        signTip: "Faça o giro de pulso com os dedos em V e o polegar no meio.",
        handShapeDesc: "Rotação com V",
        bodyLocation: "Espaço neutro",
      },
      {
        pt: "Letra J",
        letter: "J",
        targetLetter: "J",
        sign: "Mindinho traçando anzol do J",
        emoji: "🐊",
        animalEmoji: "🐊",
        animalName: "Jacarezinho Joca",
        species: "Jacaré",
        tone: "bg-mint",
        signTip: "Desenhe a curva do J com o dedo mindinho.",
        handShapeDesc: "Curva do J",
        bodyLocation: "Ar",
      },
      {
        pt: "Letra Z",
        letter: "Z",
        targetLetter: "Z",
        sign: "Indicador traçando zigue-zague do Z",
        emoji: "🦓",
        animalEmoji: "🦓",
        animalName: "Zebrinha Zazá",
        species: "Zebra",
        tone: "bg-grape",
        signTip: "Desenhe as 3 linhas do Z no ar.",
        handShapeDesc: "Zigue-zague do Z",
        bodyLocation: "Ar",
      },
    ],
  },
  19: {
    id: 19,
    title: "Espelho com IA: Letras F, T e S",
    subtitle: "Diferenciação Crítica de Polegar na Câmera",
    colors: [
      {
        pt: "Letra F",
        letter: "F",
        targetLetter: "F",
        sign: "Polegar por FORA do indicador",
        emoji: "🦭",
        animalEmoji: "🦭",
        animalName: "Foquinha Pipoca",
        species: "Foca",
        tone: "bg-sky",
        signTip: "Mostre o polegar claramente pelo lado de FORA do indicador.",
        handShapeDesc: "Polegar por fora",
        bodyLocation: "Frente da câmera",
      },
      {
        pt: "Letra T",
        letter: "T",
        targetLetter: "T",
        sign: "Polegar por DENTRO do indicador",
        emoji: "🐢",
        animalEmoji: "🐢",
        animalName: "Tartaruga Tatá",
        species: "Tartaruga",
        tone: "bg-mint",
        signTip: "Encaixe o polegar por DENTRO do indicador dobrado.",
        handShapeDesc: "Polegar por dentro",
        bodyLocation: "Frente da câmera",
      },
      {
        pt: "Letra S",
        letter: "S",
        targetLetter: "S",
        sign: "Punho fechado com polegar na frente",
        emoji: "🐸",
        animalEmoji: "🐸",
        animalName: "Sapinho Sapeca",
        species: "Sapo",
        tone: "bg-neon",
        signTip: "Cruze o polegar na frente dos dedos do punho fechado.",
        handShapeDesc: "Polegar na frente",
        bodyLocation: "Frente da câmera",
      },
    ],
  },
  20: {
    id: 20,
    title: "Chefe da Ilha 5: Letras K, P e D",
    subtitle: "Desafio de Orientação Espacial e Dedos",
    colors: [
      {
        pt: "Letra K",
        letter: "K",
        targetLetter: "K",
        sign: "Mão em K com impulso para cima",
        emoji: "🐨",
        animalEmoji: "🐨",
        animalName: "Coala Kiki",
        species: "Coala",
        tone: "bg-grape",
        signTip: "Dedos em V com polegar no meio apontando para cima.",
        handShapeDesc: "Letra K vertical",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra P",
        letter: "P",
        targetLetter: "P",
        sign: "Mão em P apontando na horizontal",
        emoji: "🐼",
        animalEmoji: "🐼",
        animalName: "Pandinha Pan",
        species: "Panda",
        tone: "bg-grape",
        signTip: "Mesma configuração do K, virada na horizontal.",
        handShapeDesc: "Letra P horizontal",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra D",
        letter: "D",
        targetLetter: "D",
        sign: "Indicador ereto para cima",
        emoji: "🦖",
        animalEmoji: "🦖",
        animalName: "Dinossauro Dino",
        species: "Dino",
        tone: "bg-mint",
        signTip: "Apenas indicador levantado com base circular.",
        handShapeDesc: "Letra D",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  21: {
    id: 21,
    title: "Dedos Unidos e Abertos: R, U e V",
    subtitle: "Lição 11: Variações de Dois Dedos em LIBRAS",
    colors: [
      {
        pt: "Letra R",
        letter: "R",
        targetLetter: "R",
        sign: "Dedos cruzados da sorte",
        emoji: "🦊",
        animalEmoji: "🦊",
        animalName: "Raposinha Rubi",
        species: "Raposa",
        tone: "bg-coral",
        signTip: "Médio cruzado sobre o indicador.",
        handShapeDesc: "Cruzamento em R",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra U",
        letter: "U",
        targetLetter: "U",
        sign: "Dois dedos colados para cima",
        emoji: "🐻",
        animalEmoji: "🐻",
        animalName: "Ursinho Uli",
        species: "Urso",
        tone: "bg-sunshine",
        signTip: "Indicador e médio estendidos juntos.",
        handShapeDesc: "Dedos unidos em U",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra V",
        letter: "V",
        targetLetter: "V",
        sign: "Dois dedos abertos em 'V'",
        emoji: "🐮",
        animalEmoji: "🐮",
        animalName: "Vaquinha Vivi",
        species: "Vaca",
        tone: "bg-coral",
        signTip: "Indicador e médio abertos em 'V'.",
        handShapeDesc: "Dedos abertos em V",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  22: {
    id: 22,
    title: "Dedos para Baixo e Cima: M, N e W",
    subtitle: "Lição 12: Contagem de Dedos em LIBRAS",
    colors: [
      {
        pt: "Letra M",
        letter: "M",
        targetLetter: "M",
        sign: "3 dedos para baixo",
        emoji: "🐵",
        animalEmoji: "🐵",
        animalName: "Macaquinho Mico",
        species: "Macaco",
        tone: "bg-sunshine",
        signTip: "Três dedos apontados para baixo.",
        handShapeDesc: "Letra M",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra N",
        letter: "N",
        targetLetter: "N",
        sign: "2 dedos para baixo",
        emoji: "🐋",
        animalEmoji: "🐋",
        animalName: "Narval Nino",
        species: "Narval",
        tone: "bg-sky",
        signTip: "Dois dedos apontados para baixo.",
        handShapeDesc: "Letra N",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra W",
        letter: "W",
        targetLetter: "W",
        sign: "3 dedos para cima",
        emoji: "🦡",
        animalEmoji: "🦡",
        animalName: "Wombat Wally",
        species: "Wombat",
        tone: "bg-grape",
        signTip: "Três dedos levantados para cima.",
        handShapeDesc: "Letra W",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  23: {
    id: 23,
    title: "Super Revisão: Letras A, L e Y",
    subtitle: "Fixação e Velocidade com os Mascotes",
    colors: [
      {
        pt: "Letra A",
        letter: "A",
        targetLetter: "A",
        sign: "Punho fechado com polegar ao lado",
        emoji: "🦫",
        animalEmoji: "🦫",
        animalName: "Capivarinha Luvi",
        species: "Capivara",
        tone: "bg-sunshine",
        signTip: "Punho fechado com polegar lateral.",
        handShapeDesc: "Letra A",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra L",
        letter: "L",
        targetLetter: "L",
        sign: "Mão em 'L' com indicador e polegar",
        emoji: "🦁",
        animalEmoji: "🦁",
        animalName: "Leãozinho Léo",
        species: "Leão",
        tone: "bg-coral",
        signTip: "Ângulo reto 'L' perfeito.",
        handShapeDesc: "Letra L",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra Y",
        letter: "Y",
        targetLetter: "Y",
        sign: "Hang Loose com polegar e mindinho",
        emoji: "🦬",
        animalEmoji: "🦬",
        animalName: "Yak Yoyo",
        species: "Yak",
        tone: "bg-sunshine",
        signTip: "Sinal de Hang Loose em 'Y'.",
        handShapeDesc: "Letra Y",
        bodyLocation: "Frente do peito",
      },
    ],
  },
  24: {
    id: 24,
    title: "O Grande Trono: Letras X, Y e Z",
    subtitle: "Grande Chefe Final e Maestria do Alfabeto LIBRAS",
    colors: [
      {
        pt: "Letra X",
        letter: "X",
        targetLetter: "X",
        sign: "Gancho puxando para trás",
        emoji: "🦜",
        animalEmoji: "🦜",
        animalName: "Pássaro Xexéu",
        species: "Pássaro",
        tone: "bg-sky",
        signTip: "Puxe o gancho do X para trás com firmeza.",
        handShapeDesc: "Letra X final",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra Y",
        letter: "Y",
        targetLetter: "Y",
        sign: "Polegar e mindinho abertos em Y",
        emoji: "🦬",
        animalEmoji: "🦬",
        animalName: "Yak Yoyo",
        species: "Yak",
        tone: "bg-sunshine",
        signTip: "Sinal de Hang Loose com movimento suave.",
        handShapeDesc: "Letra Y final",
        bodyLocation: "Frente do peito",
      },
      {
        pt: "Letra Z",
        letter: "Z",
        targetLetter: "Z",
        sign: "Zigue-zague triunfal do Z",
        emoji: "🦓",
        animalEmoji: "🦓",
        animalName: "Zebrinha Zazá",
        species: "Zebra",
        tone: "bg-grape",
        signTip: "Desenhe o Z no ar para coroar o final do alfabeto em LIBRAS!",
        handShapeDesc: "Letra Z triunfal",
        bodyLocation: "Ar em frente ao corpo",
      },
    ],
  },
};

export const Route = createFileRoute("/licao")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search?.nodeId;
    const parsed = typeof raw === "number" ? raw : parseInt(String(raw || ""), 10);
    return {
      nodeId: parsed >= 1 && parsed <= 24 ? parsed : 1,
    };
  },
  head: () => ({
    meta: [
      { title: "Lição do Alfabeto em LIBRAS com Mascotes · SinaLINK" },
      {
        name: "description",
        content:
          "Aprenda o alfabeto em LIBRAS com os bichinhos mascotes, 3 letras por lição, com modelos visuais de exemplo e inteligência artificial.",
      },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const nodeId = search.nodeId || 1;
  const currentLesson = LESSONS_DATA[nodeId] || LESSONS_DATA[1];
  const colors = currentLesson.colors;

  const [isValidating, setIsValidating] = useState(true);
  const [authorizedUser, setAuthorizedUser] = useState<User | null>(null);

  const [step, setStep] = useState(0);
  const [mirrorScore, setMirrorScore] = useState<LessonMirrorScore | null>(null);
  const [isAlphabetModalOpen, setIsAlphabetModalOpen] = useState(false);
  const [modalLetter, setModalLetter] = useState("A");
  const total = 5;

  useEffect(() => {
    setStep(0);
    setMirrorScore(null);
  }, [nodeId]);

  useEffect(() => {
    const user = getActiveUser();

    if (!user) {
      toast.error("🔒 Faça login como Aluno para acessar as lições de LIBRAS.");
      navigate({ to: "/login", replace: true });
      return;
    }

    if (user.role === "professor") {
      toast.info("🔒 Professores não realizam lições diretas de alunos. Redirecionando para o Painel.");
      navigate({ to: "/onboarding", replace: true });
      return;
    }

    setAuthorizedUser(user);
    setIsValidating(false);
  }, [navigate]);

  const openAlphabetGuide = (letter?: string) => {
    if (letter) setModalLetter(letter);
    setIsAlphabetModalOpen(true);
    soundFx.playPop();
  };

  const next = () => {
    soundFx.playPop();
    const nextStep = Math.min(step + 1, total);
    setStep(nextStep);

    // Ao atingir o passo final (Recompensa), salva a lição concluída
    if (nextStep === total && authorizedUser) {
      const scoreVal = mirrorScore
        ? Math.round(((mirrorScore.accuracy + mirrorScore.orientationScore + mirrorScore.stabilityScore) / 9) * 100)
        : 90;

      const lessonId = `trail_node_${nodeId}`;
      const existingLessons = authorizedUser.completedLessons ?? [];
      const alreadyDone = existingLessons.some((l) => l.id === lessonId);
      if (!alreadyDone) {
        const updated = saveUser({
          ...authorizedUser,
          completedLessons: [
            ...existingLessons,
            {
              id: lessonId,
              title: currentLesson.title,
              score: scoreVal,
              completedAt: new Date().toISOString().split("T")[0],
            },
          ],
          xp: (authorizedUser.xp ?? 0) + 25,
          streak: (authorizedUser.streak ?? 0) + 1,
        });
        setAuthorizedUser(updated);
      }
    }
  };

  const restart = () => {
    setMirrorScore(null);
    setStep(0);
  };

  const handleNextLesson = () => {
    const nextId = nodeId + 1;
    if (nextId <= 24) {
      navigate({ to: "/licao", search: { nodeId: nextId } });
      soundFx.playChime();
    }
  };

  if (isValidating || !authorizedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 font-display text-sm font-extrabold text-muted-foreground">
            Carregando lição dos mascotes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero shadow">
      <TopBar
        step={step}
        total={total}
        title={currentLesson.title}
        nodeId={nodeId}
        onExit={restart}
        onOpenAlphabet={() => openAlphabetGuide(colors[0]?.targetLetter || "A")}
      />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-7 sm:py-10">
        {step === 0 && (
          <ScreenIntro
            lesson={currentLesson}
            onNext={next}
            onOpenAlphabet={openAlphabetGuide}
          />
        )}
        {step === 1 && (
          <ScreenTeach
            lesson={currentLesson}
            onNext={next}
            onOpenAlphabet={openAlphabetGuide}
          />
        )}
        {step === 2 && <ScreenQuiz target={colors[0]} colors={colors} onNext={next} />}
        {step === 3 && <ScreenBubble target={colors[1] || colors[0]} colors={colors} onNext={next} />}
        {step === 4 && (
          <ScreenMirror
            target={colors[0]}
            colors={colors}
            onNext={(score) => {
              setMirrorScore(score);
              next();
            }}
          />
        )}
        {step === 5 && (
          <ScreenReward
            nodeId={nodeId}
            score={mirrorScore}
            onRestart={restart}
            onNextLesson={handleNextLesson}
          />
        )}
      </div>

      {/* Modal de Exemplo Oficial do Alfabeto */}
      <AlphabetReferenceModal
        isOpen={isAlphabetModalOpen}
        onClose={() => setIsAlphabetModalOpen(false)}
        initialLetter={modalLetter}
      />
    </div>
  );
}

function TopBar({
  step,
  total,
  title,
  nodeId,
  onExit,
  onOpenAlphabet,
}: {
  step: number;
  total: number;
  title: string;
  nodeId: number;
  onExit: () => void;
  onOpenAlphabet?: () => void;
}) {
  const pct = (step / total) * 100;
  const isWorld2 = nodeId >= 13;
  const worldLabel = isWorld2 ? `Mundo 2 (Fase ${nodeId})` : `Mundo 1 (Fase ${nodeId})`;

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          to="/trilha"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-border bg-card text-lg font-bold transition-transform hover:scale-105"
          aria-label="Sair da Lição"
        >
          ✕
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs font-extrabold mb-1">
            <span className="text-primary truncate max-w-[180px] sm:max-w-none">
              {worldLabel} · {title}
            </span>
            <span className="text-muted-foreground shrink-0">{step}/{total}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-rainbow transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {onOpenAlphabet && (
          <button
            onClick={onOpenAlphabet}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20 shadow-xs"
            title="Abrir Exemplo de Referência do Alfabeto Oficial"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exemplo A-Z</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-soft shrink-0">
          <span className="text-lg">❤️</span>
          <span className="font-display font-extrabold">5</span>
        </div>
        <button
          onClick={onExit}
          className="hidden text-xs font-bold text-muted-foreground hover:text-foreground md:block"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-pop rounded-4xl bg-card p-6 shadow-chunky md:p-10 border border-border/50">
      {children}
    </div>
  );
}

function ScreenIntro({
  lesson,
  onNext,
  onOpenAlphabet,
}: {
  lesson: LessonNodeData;
  onNext: () => void;
  onOpenAlphabet?: (letter?: string) => void;
}) {
  const isWorld2 = lesson.id >= 13;
  const worldBadge = isWorld2
    ? `Mundo 2: Trilha dos Bichinhos Aventureiros · Fase ${lesson.id} de 24`
    : `Mundo 1: Alfabeto dos Bichinhos · Fase ${lesson.id} de 12`;

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          {worldBadge}
        </span>
        <h1 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-bold">{lesson.subtitle}</p>

        {/* Card Dica Didática: 3 Letras por Vez com Mascotes */}
        <div className="mx-auto my-5 flex max-w-lg items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-left text-xs text-amber-900 dark:text-amber-200 shadow-xs">
          <span className="text-3xl shrink-0">🐾</span>
          <div>
            <strong className="font-extrabold block text-amber-950 dark:text-amber-100 text-sm">
              3 Letras nesta Lição com os Bichinhos!
            </strong>
            Nesta lição você aprenderá <strong>3 letras do alfabeto em LIBRAS</strong>. Os bichinhos mostram o sinal nos exercícios e você pode consultar as imagens reais como exemplo de apoio!
          </div>
        </div>

        {/* Exibição dos 3 Bichinhos da Lição */}
        <div className="mx-auto my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
          {lesson.colors.map((c) => {
            const mascot = getAnimalMascot(c.targetLetter);
            return (
              <div
                key={c.targetLetter}
                onClick={() => onOpenAlphabet?.(c.targetLetter)}
                className={`group cursor-pointer rounded-3xl ${mascot.tone} p-4 text-center shadow-chunky transition-transform hover:scale-105 border-2 border-border/40`}
              >
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl border-2 border-black/20 bg-black/10 shadow-inner">
                  {mascot.image ? (
                    <img
                      src={mascot.image}
                      alt={mascot.animalName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      {mascot.emoji}
                    </div>
                  )}
                  <span className="absolute top-1 right-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-black text-white">
                    {c.targetLetter}
                  </span>
                </div>
                <div className="mt-2 font-display text-sm font-black text-slate-900">
                  {mascot.animalName}
                </div>
                <div className="text-[11px] font-extrabold text-slate-800/80">
                  Ensinando: <strong>Letra {c.targetLetter}</strong>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onNext}
          className="rounded-full bg-primary px-10 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <span>▶ Começar Exercícios com os Bichinhos</span>
        </button>
      </div>
    </ScreenShell>
  );
}

function ScreenTeach({
  lesson,
  onNext,
  onOpenAlphabet,
}: {
  lesson: LessonNodeData;
  onNext: () => void;
  onOpenAlphabet?: (letter?: string) => void;
}) {
  const [i, setI] = useState(0);
  const [activeAngleView, setActiveAngleView] = useState<"primary" | "secondary">("primary");
  const colors = lesson.colors;
  const c = colors[i] || colors[0];
  const mascot: AnimalMascot = getAnimalMascot(c.targetLetter);
  const ref = getAlphabetReference(c.targetLetter);

  const advance = () => {
    setActiveAngleView("primary");
    if (i < colors.length - 1) {
      setI(i + 1);
    } else {
      onNext();
    }
  };

  return (
    <ScreenShell>
      <div className="text-center">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Passo 1: Apresentação da Letra com o Mascote
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
            Letra {i + 1} de {colors.length} ({c.targetLetter})
          </span>
        </div>

        <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          Como fazer a <span className="text-primary">Letra {c.targetLetter}</span> em LIBRAS
        </h2>

        {/* Card Didático: Mascote Fazendo o Sinal com a Mãozinha + Exemplo Oficial */}
        <div className="relative mx-auto mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden rounded-3xl bg-muted border-2 border-border p-5 shadow-inner text-left">
          {/* Mascote Animal Fazendo o Sinal com a Mãozinha (Esquerda) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center text-center">
            <div className={`relative aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl ${mascot.tone} border-4 border-primary/40 shadow-chunky p-2 flex flex-col items-center justify-center`}>
              {mascot.letter === "A" || mascot.letter === "B" ? (
                <img
                  src={mascot.image}
                  alt={`${mascot.animalName} fazendo o sinal ${c.targetLetter}`}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-between py-2 bg-card/40 rounded-2xl p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl animate-bounce-soft">{mascot.emoji}</span>
                    <span className="font-display font-black text-lg text-slate-900">
                      {mascot.animalName}
                    </span>
                  </div>

                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-black/20 bg-black/10 shadow-sm">
                    {ref.mediaType === "video" ? (
                      <video
                        src={ref.primaryMedia}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={ref.primaryMedia}
                        alt={`Sinal da mão da Letra ${c.targetLetter}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Patinha em LIBRAS ✋
                  </span>
                </div>
              )}

              {/* Badge da Letra (visível na Apresentação) */}
              <div className="absolute top-3 right-3 rounded-full bg-black/85 px-3 py-1 text-xs font-black text-white shadow-sm border border-white/20">
                Letra {c.targetLetter}
              </div>
            </div>

            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1 text-xs font-black shadow-xs border border-border">
                <span>{mascot.emoji}</span>
                <span>{mascot.animalName}</span>
              </span>
              <p className="mt-1 text-xs font-extrabold text-primary">
                "{mascot.librasExplanation}"
              </p>
            </div>
          </div>

          {/* Exemplo de Apoio Oficial & Instruções (Direita) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-3">
            <div>
              {/* Thumbnail do Exemplo Oficial (Foto / Vídeo de Referência) */}
              <div className="rounded-2xl bg-card p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Exemplo Visual Oficial de Apoio:
                  </span>
                  {ref.secondaryMedia && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setActiveAngleView("primary")}
                        className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold ${
                          activeAngleView === "primary" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        Frente
                      </button>
                      <button
                        onClick={() => setActiveAngleView("secondary")}
                        className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold ${
                          activeAngleView === "secondary" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        Lado
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-black/20 bg-black">
                    {ref.mediaType === "video" ? (
                      <video
                        src={ref.primaryMedia}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={activeAngleView === "secondary" && ref.secondaryMedia ? ref.secondaryMedia : ref.primaryMedia}
                        alt={`Exemplo oficial Letra ${c.targetLetter}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    <strong className="text-foreground block">{ref.orientationDescription}</strong>
                    <span>{ref.pedagogicalTip}</span>
                  </div>
                </div>
              </div>

              {/* Dica da Patinha / Mão */}
              <div className="mt-3 rounded-2xl bg-card p-3 border border-border text-xs">
                <strong className="text-primary block font-black mb-1">🐾 Como Fazer com a Mãozinha:</strong>
                <p className="text-foreground font-medium leading-relaxed">{c.signTip}</p>
              </div>

              {ref.movementInstructions && (
                <div className="mt-2 rounded-2xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  <strong className="block font-bold">✨ Movimento no Ar:</strong>
                  <span>{ref.movementInstructions}</span>
                </div>
              )}
            </div>

            {onOpenAlphabet && (
              <button
                onClick={() => onOpenAlphabet(c.targetLetter)}
                className="text-left text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Ver detalhes da Letra {c.targetLetter} no Guia Oficial</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={advance}
            className="rounded-full bg-foreground px-10 py-4 font-display text-lg font-extrabold text-background transition-transform hover:-translate-y-1 shadow-chunky active:scale-95"
          >
            {i < colors.length - 1 ? "Próxima Letra da Lição →" : "Entendi, vamos aos Exercícios! ✓"}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenQuiz({
  target,
  colors,
  onNext,
}: {
  target: LessonItem;
  colors: LessonItem[];
  onNext: () => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const correct = choice === target.targetLetter;
  const targetMascot = getAnimalMascot(target.targetLetter);

  // Embaralha as alternativas com os bichinhos
  const shuffledColors = useMemo(() => shuffleArray(colors), [colors]);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Passo 2: Desafio Visual de LIBRAS 🐾
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold">
          Qual bichinho está fazendo a <span className="rounded-xl bg-accent px-3 py-1">Letra {target.targetLetter}</span> com a mãozinha?
        </h2>
        <p className="mt-1 text-xs text-muted-foreground font-bold">
          Observe com atenção a mão de cada bichinho e selecione o sinal correto!
        </p>

        {/* Grid com os Mascotes Fazendo os Sinais SEM INDICAR A LETRA NAS OPÇÕES */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {shuffledColors.map((c) => {
            const isSel = choice === c.targetLetter;
            const isRight = isSel && c.targetLetter === target.targetLetter;
            const isWrong = isSel && c.targetLetter !== target.targetLetter;
            const mascot = getAnimalMascot(c.targetLetter);
            const ref = getAlphabetReference(c.targetLetter);

            return (
              <button
                key={c.targetLetter}
                onClick={() => {
                  if (!choice) {
                    setChoice(c.targetLetter);
                    if (c.targetLetter === target.targetLetter) soundFx.playChime();
                    else soundFx.playPop();
                  }
                }}
                className={`group relative flex flex-col items-center justify-center p-4 rounded-3xl border-4 ${mascot.tone} transition-all ${
                  isRight
                    ? "border-mint bg-mint/30 animate-pop scale-105 shadow-chunky ring-4 ring-mint/40"
                    : isWrong
                    ? "border-destructive bg-destructive/10 opacity-75"
                    : "border-transparent hover:border-primary hover:-translate-y-1 shadow-soft"
                }`}
              >
                {/* Visual da mãozinha do mascote (SEM PLACA, SEM EXIBIR A LETRA ANTES DA RESPOSTA) */}
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-black/20 bg-card/70 shadow-sm flex flex-col items-center justify-center p-1">
                  {mascot.letter === "A" || mascot.letter === "B" ? (
                    <img
                      src={mascot.image}
                      alt={mascot.animalName}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-between py-1">
                      <span className="text-3xl animate-bounce-soft">{mascot.emoji}</span>
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-black/20 bg-black/5">
                        {ref.mediaType === "video" ? (
                          <video
                            src={ref.primaryMedia}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={ref.primaryMedia}
                            alt="Sinal da mão"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* SÓ REVELA A LETRA APÓS O ALUNO TER CLICADO PARA RESPONDER! */}
                  {choice && (
                    <span
                      className={`absolute top-1 right-1 rounded-md px-1.5 py-0.5 text-xs font-black text-white shadow-sm ${
                        c.targetLetter === target.targetLetter ? "bg-mint text-slate-950" : "bg-black/80"
                      }`}
                    >
                      {c.targetLetter}
                    </span>
                  )}
                </div>

                <div className="mt-3 font-display text-base font-black text-slate-900">
                  {mascot.animalName}
                </div>
                <span className="mt-0.5 text-[11px] font-extrabold text-slate-800/80">
                  {choice ? `Fez a Letra ${c.targetLetter}` : "Observe o sinal da mão ✋"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 min-h-[70px]">
          {correct && (
            <div className="animate-pop rounded-2xl bg-mint/30 p-4 border border-mint/40 text-emerald-950 dark:text-emerald-100">
              <div className="font-display text-xl font-extrabold">Excelente! 🎉</div>
              <p className="text-sm font-bold">
                {targetMascot.cheerMessage} ({target.signTip})
              </p>
            </div>
          )}
          {choice && !correct && (
            <div className="animate-pop rounded-2xl bg-destructive/10 p-4 border border-destructive/20 text-destructive">
              <div className="font-display text-xl font-extrabold">Quase lá! 👀</div>
              <p className="text-sm font-bold">
                O sinal que você escolheu foi a <strong>Letra {choice}</strong>. A <strong>Letra {target.targetLetter}</strong> é feita pelo(a) {targetMascot.animalName} ({target.signTip})!
              </p>
            </div>
          )}
        </div>

        {choice && (
          <button
            onClick={onNext}
            className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105"
          >
            Continuar para o Jogo das Bolhas 🫧 →
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function ScreenBubble({
  target,
  colors,
  onNext,
}: {
  target: LessonItem;
  colors: LessonItem[];
  onNext: () => void;
}) {
  const [popped, setPopped] = useState<string | null>(null);
  const targetMascot = getAnimalMascot(target.targetLetter);

  // Embaralha as bolhas de resposta
  const shuffledColors = useMemo(() => shuffleArray(colors), [colors]);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Passo 3: Jogo das Bolhas dos Mascotes 🫧
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold">
          Estoure a bolha com a mãozinha da <span className="rounded-xl bg-accent px-3 py-1">Letra {target.targetLetter}</span>!
        </h2>
        <p className="mt-1 text-xs text-muted-foreground font-bold">
          Observe a mão de cada bichinho nas bolhas flutuantes!
        </p>

        <div className="relative mt-8 grid h-76 place-items-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky/30 to-mint/20 border border-border">
          <div className="flex items-end justify-around gap-4 sm:gap-6 drop-shadow-xl/25 px-4">
            {shuffledColors.map((c, i) => {
              const isPopped = popped === c.targetLetter;
              const isRight = isPopped && c.targetLetter === target.targetLetter;
              const mascot = getAnimalMascot(c.targetLetter);
              const ref = getAlphabetReference(c.targetLetter);

              return (
                <button
                  key={c.targetLetter}
                  onClick={() => {
                    if (!popped) {
                      setPopped(c.targetLetter);
                      if (c.targetLetter === target.targetLetter) soundFx.playChime();
                      else soundFx.playPop();
                    }
                  }}
                  disabled={!!popped}
                  style={{ animationDelay: `${i * 0.4}s` }}
                  className={`animate-float rounded-3xl ${mascot.tone} p-3 shadow-chunky transition-all ${
                    isPopped
                      ? isRight
                        ? "scale-125 opacity-30 ring-4 ring-mint"
                        : "scale-75 opacity-40"
                      : "hover:scale-110"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-2xl border border-black/20 bg-card/70 p-1 flex flex-col items-center justify-center">
                      {mascot.letter === "A" || mascot.letter === "B" ? (
                        <img
                          src={mascot.image}
                          alt={mascot.animalName}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-between py-0.5">
                          <span className="text-2xl animate-bounce-soft">{mascot.emoji}</span>
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-black/20 bg-black/5">
                            {ref.mediaType === "video" ? (
                              <video
                                src={ref.primaryMedia}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={ref.primaryMedia}
                                alt="Mãozinha"
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* SÓ REVELA A LETRA APÓS O ALUNO TER ESTOURADO A BOLHA! */}
                      {popped && (
                        <span className="absolute top-1 right-1 rounded-md bg-black/80 px-1.5 py-0.2 text-[10px] font-black text-white shadow-sm">
                          {c.targetLetter}
                        </span>
                      )}
                    </div>
                    <span className="mt-1 font-display text-xs font-black text-slate-900">
                      {mascot.animalName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 min-h-[60px]">
          {popped && popped === target.targetLetter && (
            <div className="animate-pop font-display text-2xl font-extrabold text-mint">
              POW! Bolha com a Letra {target.targetLetter} estourada com sucesso! 🎯
            </div>
          )}
          {popped && popped !== target.targetLetter && (
            <div className="animate-pop text-lg font-bold text-destructive">
              Ops! Essa bolha tinha o sinal da Letra {popped}. A bolha da Letra {target.targetLetter} era do(a) {targetMascot.animalName}!
            </div>
          )}
        </div>

        {popped && (
          <button
            onClick={onNext}
            className="rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105"
          >
            Próximo desafio: Espelho com IA 🪞 →
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function ScreenMirror({
  target,
  colors,
  onNext,
}: {
  target: LessonItem;
  colors: LessonItem[];
  onNext: (score: LessonMirrorScore) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<LessonItem>(target);
  const mascot = getAnimalMascot(selectedColor.targetLetter);

  return (
    <ScreenShell>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Passo 4: 🪞 Desafio do Espelho com IA &amp; Mascote
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold">
          Faça a <span className="text-primary">Letra {selectedColor.targetLetter}</span> na Câmera!
        </h2>
        <p className="mt-1 text-xs text-muted-foreground font-bold">
          {mascot.animalName} está pronto para torcer por você na câmera!
        </p>

        {/* Alternador de Letras da Lição */}
        <div className="my-5 flex flex-wrap justify-center gap-2">
          {colors.map((c) => {
            const m = getAnimalMascot(c.targetLetter);
            return (
              <button
                key={c.targetLetter}
                onClick={() => {
                  setSelectedColor(c);
                  soundFx.playPop();
                }}
                className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${
                  selectedColor.targetLetter === c.targetLetter
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.animalName} (Letra {c.targetLetter})</span>
              </button>
            );
          })}
        </div>

        {/* Componente Split-Screen com Exemplo Oficial + Câmera IA */}
        <LibrasLessonMirror
          targetLetter={selectedColor.targetLetter}
          targetLabel={`Letra ${selectedColor.targetLetter}`}
          targetDescription={selectedColor.signTip}
          onComplete={onNext}
          onSkip={() => {
            onNext({
              accuracy: 3,
              orientationScore: 3,
              stabilityScore: 2,
              detectedLetter: selectedColor.targetLetter,
            });
          }}
        />
      </div>
    </ScreenShell>
  );
}

function ScreenReward({
  nodeId,
  score,
  onRestart,
  onNextLesson,
}: {
  nodeId: number;
  score: LessonMirrorScore | null;
  onRestart: () => void;
  onNextLesson: () => void;
}) {
  const nextNodeId = nodeId + 1;
  const hasNextLesson = nextNodeId <= 24;
  const nextLessonData = LESSONS_DATA[nextNodeId];
  const isWorld2 = nodeId >= 13;
  const currentLessonData = LESSONS_DATA[nodeId] || LESSONS_DATA[1];

  return (
    <ScreenShell>
      <div className="text-center">
        <div className="relative">
          <img
            src={luviMascot}
            alt="Luvi e bichinhos celebrando"
            width={1024}
            height={1024}
            className="mx-auto w-52 animate-bounce-soft drop-shadow-xl/25"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-rainbow opacity-30 blur-3xl" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
          {isWorld2 ? `Fase ${nodeId} do Mundo 2 Concluída! 🎉` : `Fase ${nodeId} Concluída! 🎉`}
        </h1>
        <p className="mt-2 text-muted-foreground font-bold">
          Parabéns! Você aprendeu e validou <strong>{currentLessonData.title}</strong> em LIBRAS com os mascotes!
        </p>

        {/* Mascotes da Lição Concluída */}
        <div className="mx-auto my-5 flex justify-center gap-3">
          {currentLessonData.colors.map((c) => {
            const m = getAnimalMascot(c.targetLetter);
            return (
              <div
                key={c.targetLetter}
                className={`flex items-center gap-2 rounded-2xl ${m.tone} px-3.5 py-1.5 shadow-sm border border-black/10`}
              >
                <span className="text-lg">{m.emoji}</span>
                <span className="font-display text-xs font-black text-slate-900">
                  Letra {c.targetLetter} ✓
                </span>
              </div>
            );
          })}
        </div>

        {/* Breakdown das estrelas */}
        <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-3">
          <div className="rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="text-xs font-extrabold uppercase text-muted-foreground">Config. Mão</div>
            <div className="mt-1 text-lg">{"⭐".repeat(score?.accuracy || 3)}</div>
          </div>
          <div className="rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="text-xs font-extrabold uppercase text-muted-foreground">Orientação</div>
            <div className="mt-1 text-lg">{"⭐".repeat(score?.orientationScore || 3)}</div>
          </div>
          <div className="rounded-2xl bg-card p-3 shadow-soft border border-border">
            <div className="text-xs font-extrabold uppercase text-muted-foreground">Estabilidade</div>
            <div className="mt-1 text-lg">{"⭐".repeat(score?.stabilityScore || 3)}</div>
          </div>
        </div>

        <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-3">
          <RewardCard icon="⭐" label="+25 XP" tone="bg-sunshine" />
          <RewardCard icon="🌟" label="+3 Estrelas" tone="bg-mint" />
          <RewardCard icon="🔥" label="Streak +1" tone="bg-coral text-white" />
        </div>

        {/* Botão de Próxima Lição */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {hasNextLesson ? (
            <button
              onClick={onNextLesson}
              className="w-full max-w-md rounded-full bg-primary px-8 py-5 font-display text-lg sm:text-xl font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-bounce-soft"
            >
              <span>
                ▶ Próxima Fase: {nextLessonData?.title || `Fase ${nextNodeId}`}
              </span>
              <span className="text-2xl">→</span>
            </button>
          ) : (
            <div className="w-full max-w-md rounded-2xl bg-mint/30 border border-mint p-4 text-emerald-900 dark:text-emerald-200 font-display font-black text-center shadow-soft">
              🏆 Parabéns! Você concluiu todas as 24 lições do Alfabeto em LIBRAS com os Mascotes!
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 w-full max-w-md mt-2">
            <button
              onClick={onRestart}
              className="flex-1 rounded-full border-2 border-foreground/20 bg-card px-6 py-4 font-display font-extrabold shadow-soft hover:bg-muted"
            >
              🔄 Repetir lição
            </button>
            <Link
              to="/trilha"
              className="flex-1 rounded-full border-2 border-primary/40 bg-card px-6 py-4 font-display font-extrabold text-primary text-center shadow-soft hover:bg-primary/10"
            >
              🗺️ Ver Trilha
            </Link>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function RewardCard({ icon, label, tone }: { icon: string; label: string; tone: string }) {
  return (
    <div className={`animate-pop rounded-2xl ${tone} p-4 shadow-soft`}>
      <div className="text-3xl">{icon}</div>
      <div className="mt-1 font-display text-sm font-extrabold">{label}</div>
    </div>
  );
}
