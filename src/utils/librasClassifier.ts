export type Landmark = {
  x: number;
  y: number;
  z: number;
};

export type HandDetectionResult = {
  letter: string;
  confidence: number;
  description: string;
  isFramed: boolean;
  landmarksCount: number;
  orientation: "UP" | "DOWN" | "SIDEWAYS";
};

export type TwoHandSignResult = {
  signName: string;
  confidence: number;
  description: string;
  isFramed: boolean;
  handsCount: number;
};

// Informações pedagógicas para cada letra do alfabeto manual em LIBRAS
export const ALPHABET_GUIDE: Record<
  string,
  { name: string; tip: string; orientation: string; emoji: string }
> = {
  A: {
    name: "Letra A",
    tip: "Feche os 4 dedos na palma e deixe o polegar ereto encostado ao lado do indicador.",
    orientation: "Para cima",
    emoji: "🅰️",
  },
  B: {
    name: "Letra B",
    tip: "Mantenha os 4 dedos estendidos e unidos para cima, com o polegar dobrado sobre a palma.",
    orientation: "Para cima",
    emoji: "🅱️",
  },
  C: {
    name: "Letra C",
    tip: "Curve os 4 dedos e o polegar formando um arco semicircular em formato de 'C'.",
    orientation: "De frente/lateral",
    emoji: "🌙",
  },
  D: {
    name: "Letra D",
    tip: "Apenas o indicador apontado para cima. As pontas dos outros dedos tocam o polegar formando um círculo.",
    orientation: "Para cima",
    emoji: "☝️",
  },
  E: {
    name: "Letra E",
    tip: "Dobre todos os dedos pelas falanges para baixo, com o polegar recolhido na palma.",
    orientation: "Para cima",
    emoji: "✊",
  },
  F: {
    name: "Letra F",
    tip: "Mantenha médio, anelar e mínimo para cima. O indicador dobra e o polegar fica por fora encostado nele.",
    orientation: "Para cima",
    emoji: "👌",
  },
  G: {
    name: "Letra G",
    tip: "Mão virada de lado, com indicador estendido na horizontal e polegar paralelo.",
    orientation: "De lado",
    emoji: "👉",
  },
  H: {
    name: "Letra H",
    tip: "Indicador e médio estendidos para o lado, com o polegar entre eles e movimento sutil.",
    orientation: "De lado",
    emoji: "✌️",
  },
  I: {
    name: "Letra I",
    tip: "Apenas o dedo mindinho (mínimo) estendido para cima. Polegar sobre os outros dedos.",
    orientation: "Para cima",
    emoji: "🤙",
  },
  J: {
    name: "Letra J",
    tip: "Com a mão em 'I' (mindinho para cima), desenhe a curva de um 'J' no ar.",
    orientation: "Para baixo em curva",
    emoji: "🪄",
  },
  K: {
    name: "Letra K",
    tip: "Indicador para cima e médio levemente inclinado com o polegar no meio, movendo para cima.",
    orientation: "De lado/cima",
    emoji: "✌️",
  },
  L: {
    name: "Letra L",
    tip: "Indicador para cima e polegar aberto formando um 'L' perfeito de 90°.",
    orientation: "Para cima",
    emoji: "👆",
  },
  M: {
    name: "Letra M",
    tip: "Três dedos (indicador, médio e anelar) estendidos e apontados para baixo.",
    orientation: "Para baixo",
    emoji: "👇",
  },
  N: {
    name: "Letra N",
    tip: "Dois dedos (indicador e médio) estendidos apontando para baixo.",
    orientation: "Para baixo",
    emoji: "👇",
  },
  O: {
    name: "Letra O",
    tip: "Pontas de todos os dedos encostadas no polegar formando um círculo aberto.",
    orientation: "De frente",
    emoji: "⭕",
  },
  P: {
    name: "Letra P",
    tip: "Mão na horizontal com indicador estendido e médio apontando para baixo.",
    orientation: "Para frente/baixo",
    emoji: "👇",
  },
  Q: {
    name: "Letra Q",
    tip: "Indicador e polegar estendidos e apontados para baixo em pinça aberta.",
    orientation: "Para baixo",
    emoji: "👇",
  },
  R: {
    name: "Letra R",
    tip: "Indicador e médio estendidos para cima e cruzados (um sobre o outro).",
    orientation: "Para cima",
    emoji: "🤞",
  },
  S: {
    name: "Letra S",
    tip: "Punho totalmente fechado com o polegar cruzado passando por cima dos dedos.",
    orientation: "Para cima",
    emoji: "✊",
  },
  T: {
    name: "Letra T",
    tip: "Sinal de figas: polegar encaixado entre o indicador e o médio.",
    orientation: "Para cima",
    emoji: "🤞",
  },
  U: {
    name: "Letra U",
    tip: "Indicador e médio estendidos para cima bem colados e paralelos.",
    orientation: "Para cima",
    emoji: "✌️",
  },
  V: {
    name: "Letra V",
    tip: "Indicador e médio estendidos para cima bem afastados em forma de 'V'.",
    orientation: "Para cima",
    emoji: "✌️",
  },
  W: {
    name: "Letra W",
    tip: "Três dedos (indicador, médio e anelar) estendidos para cima e separados.",
    orientation: "Para cima",
    emoji: "🖐️",
  },
  X: {
    name: "Letra X",
    tip: "Indicador dobrado em formato de gancho puxando para trás.",
    orientation: "Para cima/gancho",
    emoji: "☝️",
  },
  Y: {
    name: "Letra Y",
    tip: "Sinal de 'Hang Loose': apenas o polegar e o dedo mínimo estendidos para os lados.",
    orientation: "Para os lados",
    emoji: "🤙",
  },
  Z: {
    name: "Letra Z",
    tip: "Indicador estendido desenhando a letra 'Z' no ar.",
    orientation: "Movimento no ar",
    emoji: "⚡",
  },
};

// Calcula a distância euclidiana 3D entre dois pontos
export function distance(p1: Landmark, p2: Landmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Calcula o ângulo em graus entre dois vetores a partir de um vértice
export function getAngleDegrees(vertex: Landmark, p1: Landmark, p2: Landmark): number {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return Math.acos(cosTheta) * (180 / Math.PI);
}

// Calcula o ângulo de abertura real em graus entre indicador e polegar em relação ao pulso
export function getWristApertureAngle(
  wrist: Landmark,
  indexTip: Landmark,
  thumbTip: Landmark
): number {
  const vIndex = { x: indexTip.x - wrist.x, y: indexTip.y - wrist.y };
  const vThumb = { x: thumbTip.x - wrist.x, y: thumbTip.y - wrist.y };

  const dot = vIndex.x * vThumb.x + vIndex.y * vThumb.y;
  const magIndex = Math.sqrt(vIndex.x * vIndex.x + vIndex.y * vIndex.y);
  const magThumb = Math.sqrt(vThumb.x * vThumb.x + vThumb.y * vThumb.y);

  if (magIndex === 0 || magThumb === 0) return 0;

  const cosTheta = Math.max(-1, Math.min(1, dot / (magIndex * magThumb)));
  return Math.acos(cosTheta) * (180 / Math.PI);
}

// Verifica se a ponta do polegar está dentro da área geométrica da palma
export function isThumbInsidePalmRegion(
  thumbTip: Landmark,
  wrist: Landmark,
  indexMcp: Landmark,
  middleMcp: Landmark,
  pinkyMcp: Landmark
): boolean {
  const topPalmY = Math.min(indexMcp.y, middleMcp.y, pinkyMcp.y);
  const bottomPalmY = wrist.y;

  const minPalmX = Math.min(wrist.x, indexMcp.x, pinkyMcp.x) - 0.03;
  const maxPalmX = Math.max(wrist.x, indexMcp.x, pinkyMcp.x) + 0.03;

  const isInsideY = thumbTip.y >= topPalmY - 0.02 && thumbTip.y <= bottomPalmY + 0.05;
  const isInsideX = thumbTip.x >= minPalmX && thumbTip.x <= maxPalmX;

  return isInsideY && isInsideX;
}

// Verifica se a mão está centralizada e com bom tamanho na câmera
export function checkHandFraming(landmarks: Landmark[] | undefined | null): {
  isFramed: boolean;
  message: string;
  progress: number;
} {
  if (!landmarks || landmarks.length < 21) {
    return {
      isFramed: false,
      message: "Posicione sua mão em frente à câmera",
      progress: 0,
    };
  }

  const wrist = landmarks[0];
  const indexTip = landmarks[8];
  const pinkyTip = landmarks[20];

  const isCentered =
    wrist.x > 0.05 &&
    wrist.x < 0.95 &&
    wrist.y > 0.05 &&
    wrist.y < 0.95 &&
    indexTip.x > 0.05 &&
    indexTip.x < 0.95 &&
    pinkyTip.x > 0.05 &&
    pinkyTip.x < 0.95;

  if (!isCentered) {
    return {
      isFramed: false,
      message: "Mantenha a mão centralizada no campo de visão",
      progress: 50,
    };
  }

  const palmScale = distance(wrist, landmarks[9]);
  if (palmScale < 0.08) {
    return {
      isFramed: false,
      message: "Aproxime a mão um pouco mais da câmera",
      progress: 75,
    };
  }

  return {
    isFramed: true,
    message: "Mão perfeitamente enquadrada!",
    progress: 100,
  };
}

// Classificador Principal de Sinais Individuais (Alfabeto A-Z e Formatos de Mão)
export function classifyLibrasSign(landmarks: Landmark[]): HandDetectionResult {
  if (!landmarks || landmarks.length < 21) {
    return {
      letter: "-",
      confidence: 0,
      description: "Nenhuma mão detectada",
      isFramed: false,
      landmarksCount: 0,
      orientation: "UP",
    };
  }

  // --- LANDMARKS DA MÃO ---
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];

  const indexTip = landmarks[8];
  const indexDip = landmarks[7];
  const indexPip = landmarks[6];
  const indexMcp = landmarks[5];

  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const middleMcp = landmarks[9];

  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const ringMcp = landmarks[13];

  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];
  const pinkyMcp = landmarks[17];

  // Escala de referência da palma da mão
  const palmSize = distance(wrist, middleMcp);
  if (palmSize === 0) {
    return {
      letter: "-",
      confidence: 0,
      description: "Erro de escala da mão",
      isFramed: false,
      landmarksCount: landmarks.length,
      orientation: "UP",
    };
  }

  // --- DETECÇÃO DE ORIENTAÇÃO 3D (CIMA / BAIXO / LADO) ---
  const deltaX = Math.abs(middleMcp.x - wrist.x);
  const deltaY = middleMcp.y - wrist.y;

  let orientation: "UP" | "DOWN" | "SIDEWAYS" = "SIDEWAYS";
  if (deltaY < -0.06 && deltaY < -deltaX) {
    orientation = "UP";
  } else if (deltaY > 0.06 && deltaY > deltaX) {
    orientation = "DOWN";
  } else {
    orientation = "SIDEWAYS";
  }

  // Ângulo de abertura do polegar e indicador em relação ao pulso
  const wristApertureAngle = getWristApertureAngle(wrist, indexTip, thumbTip);

  // Verificação de dedos apontados para baixo
  const isFingersPointingDown = indexTip.y > indexMcp.y && middleTip.y > middleMcp.y;

  // Direção dominante do indicador
  const isIndexPointingVerticalUp =
    indexTip.y < indexMcp.y &&
    Math.abs(indexTip.y - indexMcp.y) > Math.abs(indexTip.x - indexMcp.x) * 0.85;

  const isIndexPointingHorizontalSideways =
    Math.abs(indexTip.x - indexMcp.x) > Math.abs(indexTip.y - indexMcp.y) * 0.85;

  // Extensão do dedo mínimo
  const isPinkyExt =
    distance(wrist, pinkyTip) > distance(wrist, pinkyPip) * 1.12 ||
    distance(pinkyMcp, pinkyTip) > distance(pinkyMcp, pinkyPip) * 1.3;

  // Estados individuais de extensão dos outros 3 dedos
  const isIndexExt =
    distance(wrist, indexTip) > distance(wrist, indexPip) * 1.15 ||
    isIndexPointingHorizontalSideways;
  const isMiddleExt =
    distance(wrist, middleTip) > distance(wrist, middlePip) * 1.15 ||
    Math.abs(middleTip.x - middleMcp.x) > palmSize * 0.3;
  const isRingExt = distance(wrist, ringTip) > distance(wrist, ringPip) * 1.15;

  // Verificação estrita de dedos dobrados no punho
  const isIndexFoldedInFist = distance(wrist, indexTip) < distance(wrist, indexMcp) * 1.25;
  const isMiddleFoldedInFist = distance(wrist, middleTip) < distance(wrist, middleMcp) * 1.25;
  const isRingFoldedInFist = distance(wrist, ringTip) < distance(wrist, ringMcp) * 1.25;
  const isPinkyFoldedInFist = distance(wrist, pinkyTip) < distance(wrist, pinkyMcp) * 1.25;

  const extendedCount = [isIndexExt, isMiddleExt, isRingExt, isPinkyExt].filter(Boolean).length;

  // Distâncias relativas entre dedos normalizadas pela palma
  const indexMiddleDist = distance(indexTip, middleTip) / palmSize;
  const thumbIndexDist = distance(thumbTip, indexTip) / palmSize;
  const thumbMiddleDist = distance(thumbTip, middleTip) / palmSize;
  const thumbPinkyDist = distance(thumbTip, pinkyTip) / palmSize;
  const thumbToMiddleTipDist = distance(thumbTip, middleTip) / palmSize;
  const thumbToRingTipDist = distance(thumbTip, ringTip) / palmSize;

  const indexWristDist = distance(indexTip, wrist) / palmSize;
  const middleWristDist = distance(middleTip, wrist) / palmSize;
  const ringWristDist = distance(ringTip, wrist) / palmSize;
  const pinkyWristDist = distance(pinkyTip, wrist) / palmSize;
  const avgWristDist = (indexWristDist + middleWristDist + ringWristDist + pinkyWristDist) / 4;

  // Verificação de anel formado para o D
  const isRingFormedWithThumb =
    thumbToMiddleTipDist < 0.38 ||
    (thumbToMiddleTipDist < 0.42 && thumbToRingTipDist < 0.42);

  // REGRA DA LETRA X: Gancho elevado com indicador
  const isIndexHooked =
    distance(indexTip, indexDip) < palmSize * 0.22 ||
    distance(indexTip, indexPip) < palmSize * 0.32 ||
    (indexPip.y < middlePip.y - palmSize * 0.03 && indexTip.y > indexPip.y - palmSize * 0.03);

  // REGRA DO S: Polegar cruza sobre falanges
  const isThumbCrossingOverToRingFinger =
    (distance(thumbTip, ringPip) / palmSize < 0.38 ||
      distance(thumbTip, ringMcp) / palmSize < 0.38) &&
    distance(thumbTip, indexPip) / palmSize < 0.35 &&
    thumbTip.z < indexPip.z;

  // Verificação se polegar está dentro da palma
  const isThumbInPalmArea = isThumbInsidePalmRegion(
    thumbTip,
    wrist,
    indexMcp,
    middleMcp,
    pinkyMcp
  );

  let letter = "?";
  let confidence = 0.85;
  let description = "Gesto em análise";

  // =========================================================================
  // REGRAS ESPECÍFICAS INDIVIDUAIS PARA CADA LETRA DO ALFABETO MANUAL LIBRAS
  // =========================================================================

  // 1. LETRA B: Todos os 4 dedos estendidos para CIMA e polegar recolhido sobre a palma
  if (
    isIndexExt &&
    isMiddleExt &&
    isRingExt &&
    isPinkyExt &&
    (orientation === "UP" || indexTip.y < indexMcp.y)
  ) {
    letter = "B";
    confidence = 0.98;
    description = "Letra B: Quatro dedos estendidos para CIMA e polegar recolhido sobre a palma";
  }

  // 2. LETRA D: APENAS o indicador estendido para CIMA e anel com demais dedos
  else if (
    distance(wrist, indexTip) > distance(wrist, indexMcp) * 1.3 &&
    !isIndexFoldedInFist &&
    !isMiddleExt &&
    !isRingExt &&
    !isPinkyExt &&
    (orientation === "UP" || indexTip.y < indexMcp.y) &&
    isRingFormedWithThumb
  ) {
    letter = "D";
    confidence = 0.98;
    description = "Letra D: Indicador estendido para CIMA e pontas dos demais dedos unidas ao polegar";
  }

  // 3. LETRA G: Mão de LADO com indicador horizontal e polegar paralelo
  else if (
    isIndexExt &&
    !isMiddleExt &&
    !isRingExt &&
    !isPinkyExt &&
    !isRingFormedWithThumb &&
    (isIndexPointingHorizontalSideways || orientation === "SIDEWAYS") &&
    !isIndexPointingVerticalUp &&
    !isFingersPointingDown &&
    wristApertureAngle < 52
  ) {
    letter = "G";
    confidence = 0.98;
    description = "Letra G: Mão de lado com indicador apontando na horizontal";
  }

  // 4. LETRA L: Indicador estendido para CIMA e polegar aberto em 90 graus
  else if (
    !isIndexFoldedInFist &&
    distance(wrist, indexTip) > distance(wrist, indexMcp) * 1.3 &&
    isIndexPointingVerticalUp &&
    isMiddleFoldedInFist &&
    isRingFoldedInFist &&
    isPinkyFoldedInFist &&
    !isRingFormedWithThumb &&
    (wristApertureAngle >= 25 ||
      thumbIndexDist > 0.28 ||
      distance(thumbTip, indexMcp) > palmSize * 0.28)
  ) {
    letter = "L";
    confidence = 0.98;
    description = "Letra L: Indicador para CIMA e polegar aberto em L";
  }

  // 5. LETRA R: Indicador e médio estendidos e cruzados
  else if (
    indexTip.y < indexMcp.y - palmSize * 0.08 &&
    middleTip.y < middleMcp.y - palmSize * 0.08 &&
    !isIndexFoldedInFist &&
    !isMiddleFoldedInFist &&
    !isRingExt &&
    !isPinkyExt &&
    (indexTip.x - middleTip.x) * (indexMcp.x - middleMcp.x) < 0
  ) {
    letter = "R";
    confidence = 0.98;
    description = "Letra R: Indicador e médio estendidos para CIMA e cruzados";
  }

  // 6. BLOCO MÃO DE FRENTE (DEDOS PARA CIMA) -> U OU V
  else if (
    indexTip.y < indexMcp.y &&
    middleTip.y < middleMcp.y &&
    isIndexExt &&
    isMiddleExt &&
    !isIndexFoldedInFist &&
    !isMiddleFoldedInFist &&
    (!isRingExt || isRingFoldedInFist) &&
    (!isPinkyExt || isPinkyFoldedInFist) &&
    !isIndexPointingHorizontalSideways &&
    !isFingersPointingDown
  ) {
    if (indexMiddleDist > 0.28) {
      letter = "V";
      confidence = 0.98;
      description = "Letra V: Indicador e médio estendidos AFASTADOS em V";
    } else {
      letter = "U";
      confidence = 0.98;
      description = "Letra U: Indicador e médio estendidos JUNTOS / PARALELOS";
    }
  }

  // 7. BLOCO MÃO DE LADO -> K OU H
  else if (
    isIndexExt &&
    isMiddleExt &&
    !isIndexFoldedInFist &&
    !isMiddleFoldedInFist &&
    !isRingExt &&
    !isPinkyExt &&
    !isRingFormedWithThumb &&
    !isFingersPointingDown &&
    (orientation === "SIDEWAYS" ||
      Math.abs(indexMcp.x - wrist.x) > 0.03 ||
      Math.abs(middleMcp.x - wrist.x) > 0.03 ||
      isIndexPointingHorizontalSideways)
  ) {
    if (
      indexMiddleDist > 0.26 ||
      Math.abs(middleTip.x - indexTip.x) > 0.04 ||
      middleTip.y > indexTip.y + 0.02
    ) {
      letter = "K";
      confidence = 0.98;
      description = "Letra K: Mão de lado com indicador e médio AFASTADOS";
    } else {
      letter = "H";
      confidence = 0.98;
      description = "Letra H: Mão de lado com indicador e médio JUNTOS na horizontal";
    }
  }

  // 8. LETRA M: 3 dedos para baixo
  else if (
    isIndexExt &&
    isMiddleExt &&
    isRingExt &&
    !isRingFoldedInFist &&
    !isPinkyExt &&
    indexTip.y > indexPip.y &&
    middleTip.y > middlePip.y &&
    ringTip.y > ringPip.y
  ) {
    letter = "M";
    confidence = 0.98;
    description = "Letra M: Indicador, médio e anelar apontados para BAIXO";
  }

  // 9. LETRA N: 2 dedos para baixo
  else if (
    isIndexExt &&
    isMiddleExt &&
    (isRingFoldedInFist || !isRingExt) &&
    !isPinkyExt &&
    indexTip.y > indexMcp.y &&
    middleTip.y > middleMcp.y
  ) {
    letter = "N";
    confidence = 0.98;
    description = "Letra N: Indicador e médio apontados para BAIXO";
  }

  // 10. LETRA P: Indicador horizontal, médio para baixo
  else if (
    indexTip.y < wrist.y &&
    middleTip.y >= wrist.y - palmSize * 0.1 &&
    !isRingExt &&
    !isPinkyExt &&
    (isRingFoldedInFist || ringWristDist < 0.75) &&
    (isPinkyFoldedInFist || pinkyWristDist < 0.75)
  ) {
    letter = "P";
    confidence = 0.98;
    description = "Letra P: Indicador acima do pulso e médio abaixo do pulso";
  }

  // 11. LETRA W: 3 dedos para cima
  else if (
    isIndexExt &&
    isMiddleExt &&
    isRingExt &&
    !isPinkyExt &&
    (orientation === "UP" || indexTip.y < indexMcp.y)
  ) {
    letter = "W";
    confidence = 0.97;
    description = "Letra W: Indicador, médio e anelar estendidos para CIMA";
  }

  // 12. LETRA I: Apenas mindinho para cima
  else if (
    !isPinkyFoldedInFist &&
    distance(wrist, pinkyTip) > distance(wrist, pinkyMcp) * 1.25 &&
    !isIndexExt &&
    !isMiddleExt &&
    !isRingExt &&
    pinkyTip.y < wrist.y &&
    (isThumbInPalmArea || distance(thumbTip, indexMcp) < palmSize * 0.4)
  ) {
    letter = "I";
    confidence = 0.98;
    description = "Letra I: Dedo mínimo estendido para CIMA e polegar recolhido";
  }

  // 13. LETRA J: Mindinho em movimento descendente/curvo
  else if (
    !isPinkyFoldedInFist &&
    distance(wrist, pinkyTip) > distance(wrist, pinkyMcp) * 1.2 &&
    !isIndexExt &&
    !isMiddleExt &&
    !isRingExt &&
    (pinkyTip.y > pinkyMcp.y - palmSize * 0.1 || pinkyTip.y >= wrist.y - palmSize * 0.15)
  ) {
    letter = "J";
    confidence = 0.98;
    description = "Letra J: Dedo mínimo estendido com movimento descendente";
  }

  // 14. LETRA F: 3 dedos para cima, polegar e indicador em pinça externa
  else if (isMiddleExt && isRingExt && isPinkyExt && thumbIndexDist < 0.35) {
    letter = "F";
    confidence = 0.96;
    description = "Letra F: Médio, anelar e mínimo para CIMA com indicador e polegar em pinça";
  }

  // 15. LETRA Q: Indicador e polegar para baixo
  else if (
    isIndexExt &&
    !isMiddleExt &&
    !isRingExt &&
    !isPinkyExt &&
    (orientation === "DOWN" || isFingersPointingDown)
  ) {
    letter = "Q";
    confidence = 0.96;
    description = "Letra Q: Indicador e polegar apontados para BAIXO";
  }

  // 16. LETRA X: Gancho com indicador
  else if (
    isIndexHooked &&
    isMiddleFoldedInFist &&
    isRingFoldedInFist &&
    isPinkyFoldedInFist &&
    !isIndexExt
  ) {
    letter = "X";
    confidence = 0.98;
    description = "Letra X: Dedo indicador em formato de gancho para CIMA";
  }

  // 17. BLOCO DE PUNHO (A, T, S, E)
  else if (
    (extendedCount === 0 ||
      (isIndexFoldedInFist && isMiddleFoldedInFist && isRingFoldedInFist)) &&
    isPinkyFoldedInFist
  ) {
    const isThumbExtendedUp =
      thumbTip.y < thumbIp.y || thumbTip.y < indexPip.y + palmSize * 0.05;

    const isThumbTipBetweenJoints6and10 =
      (thumbTip.x - indexPip.x) * (thumbTip.x - middlePip.x) < -0.0001;

    if (isThumbTipBetweenJoints6and10) {
      letter = "T";
      confidence = 0.98;
      description = "Letra T: Figas com polegar entre o indicador e médio";
    } else if (!isThumbInPalmArea && isThumbExtendedUp && !isThumbCrossingOverToRingFinger) {
      letter = "A";
      confidence = 0.98;
      description = "Letra A: Punho fechado com polegar esticado ao lado do indicador";
    } else if (isThumbCrossingOverToRingFinger) {
      letter = "S";
      confidence = 0.96;
      description = "Letra S: Punho fechado com polegar cruzando por cima dos dedos";
    } else if (isThumbInPalmArea || distance(thumbTip, middleMcp) < palmSize * 0.4) {
      letter = "E";
      confidence = 0.98;
      description = "Letra E: Falanges dobradas com polegar recolhido na palma";
    } else {
      letter = "E";
      confidence = 0.95;
      description = "Letra E: Falanges dobradas sobre a palma";
    }
  }

  // 18. LETRA C: Dedos em arco paralelo
  else if (
    !isFingersPointingDown &&
    !(indexTip.y > indexMcp.y && middleTip.y > middleMcp.y) &&
    !isIndexFoldedInFist &&
    !isMiddleFoldedInFist &&
    !isRingFoldedInFist &&
    !isPinkyFoldedInFist &&
    thumbIndexDist >= 0.25 &&
    thumbIndexDist <= 1.35 &&
    middleWristDist > 0.65 &&
    ringWristDist > 0.6 &&
    pinkyWristDist > 0.55
  ) {
    letter = "C";
    confidence = 0.96;
    description = "Letra C: Quatro dedos e polegar curvados em formato de C";
  }

  // 19. LETRA Y (Hang Loose)
  else if (
    isPinkyExt &&
    isIndexFoldedInFist &&
    isMiddleFoldedInFist &&
    isRingFoldedInFist &&
    !isThumbInPalmArea &&
    thumbPinkyDist > 0.75
  ) {
    letter = "Y";
    confidence = 0.96;
    description = "Letra Y: Polegar e dedo mínimo estendidos para os lados (Hang Loose)";
  }

  // 20. LETRA O: Anel aberto com todas as pontas
  else if (
    thumbIndexDist < 0.38 &&
    thumbMiddleDist < 0.45 &&
    avgWristDist > 0.9 &&
    distance(thumbTip, wrist) > palmSize * 0.7
  ) {
    letter = "O";
    confidence = 0.95;
    description = "Letra O: Pontas dos dedos unidas ao polegar formando um círculo aberto";
  }

  // 21. LETRA Z: Indicador traçando Z
  else if (
    isIndexExt &&
    !isMiddleExt &&
    !isRingExt &&
    !isPinkyExt &&
    (indexTip.z > 0.05 || Math.abs(indexTip.x - indexMcp.x) > palmSize * 0.25)
  ) {
    letter = "Z";
    confidence = 0.95;
    description = "Letra Z: Indicador estendido desenhando Z no ar";
  }

  return {
    letter,
    confidence,
    description,
    isFramed: true,
    landmarksCount: landmarks.length,
    orientation,
  };
}

// Checa enquadramento de duas mãos
export function checkTwoHandsFraming(landmarksList: Landmark[][] | undefined | null): {
  isFramed: boolean;
  message: string;
  progress: number;
  handsCount: number;
} {
  if (!landmarksList || landmarksList.length < 2) {
    const handsDetected = landmarksList?.length || 0;
    return {
      isFramed: false,
      message:
        handsDetected === 1
          ? "Uma mão detectada. Mostre a segunda mão para a câmera"
          : "Posicione ambas as mãos em frente à câmera",
      progress: handsDetected === 1 ? 50 : 0,
      handsCount: handsDetected,
    };
  }

  const hand1 = landmarksList[0];
  const hand2 = landmarksList[1];

  const frame1 = checkHandFraming(hand1);
  const frame2 = checkHandFraming(hand2);

  if (!frame1.isFramed || !frame2.isFramed) {
    return {
      isFramed: false,
      message: "Centralize e ajuste a distância de ambas as mãos",
      progress: 75,
      handsCount: 2,
    };
  }

  return {
    isFramed: true,
    message: "Duas mãos enquadradas perfeitamente!",
    progress: 100,
    handsCount: 2,
  };
}

// Classificador para sinais bimanuais
export function classifyTwoHandSign(landmarksList: Landmark[][] | null): TwoHandSignResult {
  if (!landmarksList || landmarksList.length < 2) {
    return {
      signName: "-",
      confidence: 0,
      description: "Posicione ambas as mãos em frente à câmera",
      isFramed: false,
      handsCount: landmarksList?.length || 0,
    };
  }

  const hand1 = landmarksList[0];
  const hand2 = landmarksList[1];

  const wrist1 = hand1[0];
  const wrist2 = hand2[0];
  const middleMcp1 = hand1[9];
  const middleMcp2 = hand2[9];

  const handsDist = distance(wrist1, wrist2);
  const hand1Open = distance(hand1[0], hand1[12]) > distance(hand1[0], hand1[9]) * 1.3;
  const hand2Open = distance(hand2[0], hand2[12]) > distance(hand2[0], hand2[9]) * 1.3;

  // 1. SINAL "LIVRO"
  if (hand1Open && hand2Open && handsDist < 0.45) {
    return {
      signName: "LIVRO",
      confidence: 0.96,
      description: "Sinal LIVRO: Ambas as mãos abertas com palmas para cima como um livro",
      isFramed: true,
      handsCount: 2,
    };
  }

  // 2. SINAL "ESCOLA"
  const indexTipDist = distance(hand1[8], hand2[8]);
  if (indexTipDist < 0.2 && hand1[8].y < wrist1.y && hand2[8].y < wrist2.y) {
    return {
      signName: "ESCOLA",
      confidence: 0.95,
      description: "Sinal ESCOLA: Pontas das duas mãos unidas formando um telhado",
      isFramed: true,
      handsCount: 2,
    };
  }

  // 3. SINAL "ESTUDAR"
  if (hand1Open && hand2Open && Math.abs(middleMcp1.x - middleMcp2.x) < 0.25) {
    return {
      signName: "ESTUDAR",
      confidence: 0.92,
      description: "Sinal ESTUDAR: Uma mão sobre a outra se movimentando",
      isFramed: true,
      handsCount: 2,
    };
  }

  return {
    signName: "BIMANUAL",
    confidence: 0.85,
    description: "Duas mãos detectadas! Faça um dos sinais educacionais",
    isFramed: true,
    handsCount: 2,
  };
}
