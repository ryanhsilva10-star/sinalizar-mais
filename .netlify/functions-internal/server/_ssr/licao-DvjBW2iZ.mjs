import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as loseLife, O as saveUser, T as regenerateLives, a as Route$5, d as getActiveUser, h as getMaxLives, i as LESSONS_DATA, s as computeNewStreak } from "./router-Bs2xLfcW.mjs";
import { t as luvi_mascot_default } from "./luvi-mascot-oOSQQfKg.mjs";
import { M as BookOpen, O as CircleCheck, S as Layers, T as Eye, c as Sparkles, d as Scan, f as RotateCw, h as Play, j as Camera, k as CircleAlert, n as VideoOff, o as Trophy, p as RefreshCw, x as Lightbulb } from "../_libs/lucide-react.mjs";
import { i as soundFx, n as AlphabetReferenceModal, r as getAlphabetReference, t as ALPHABET_OFFICIAL_REFERENCES } from "./AlphabetReferenceModal-BOLiu9qt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/licao-DvjBW2iZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
Object.entries(ALPHABET_OFFICIAL_REFERENCES).reduce((acc, [key, ref]) => {
	acc[key] = {
		name: ref.name,
		tip: ref.pedagogicalTip,
		orientation: ref.orientationDescription,
		emoji: ref.emoji
	};
	return acc;
}, {});
function distance(p1, p2) {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	const dz = (p1.z || 0) - (p2.z || 0);
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function getWristApertureAngle(wrist, indexTip, thumbTip) {
	const vIndex = {
		x: indexTip.x - wrist.x,
		y: indexTip.y - wrist.y
	};
	const vThumb = {
		x: thumbTip.x - wrist.x,
		y: thumbTip.y - wrist.y
	};
	const dot = vIndex.x * vThumb.x + vIndex.y * vThumb.y;
	const magIndex = Math.sqrt(vIndex.x * vIndex.x + vIndex.y * vIndex.y);
	const magThumb = Math.sqrt(vThumb.x * vThumb.x + vThumb.y * vThumb.y);
	if (magIndex === 0 || magThumb === 0) return 0;
	const cosTheta = Math.max(-1, Math.min(1, dot / (magIndex * magThumb)));
	return Math.acos(cosTheta) * (180 / Math.PI);
}
function isThumbInsidePalmRegion(thumbTip, wrist, indexMcp, middleMcp, pinkyMcp) {
	const topPalmY = Math.min(indexMcp.y, middleMcp.y, pinkyMcp.y);
	const bottomPalmY = wrist.y;
	const minPalmX = Math.min(wrist.x, indexMcp.x, pinkyMcp.x) - .03;
	const maxPalmX = Math.max(wrist.x, indexMcp.x, pinkyMcp.x) + .03;
	const isInsideY = thumbTip.y >= topPalmY - .02 && thumbTip.y <= bottomPalmY + .05;
	const isInsideX = thumbTip.x >= minPalmX && thumbTip.x <= maxPalmX;
	return isInsideY && isInsideX;
}
function checkHandFraming(landmarks) {
	if (!landmarks || landmarks.length < 21) return {
		isFramed: false,
		message: "Posicione sua mão em frente à câmera",
		progress: 0
	};
	const wrist = landmarks[0];
	const indexTip = landmarks[8];
	const pinkyTip = landmarks[20];
	if (!(wrist.x > .05 && wrist.x < .95 && wrist.y > .05 && wrist.y < .95 && indexTip.x > .05 && indexTip.x < .95 && pinkyTip.x > .05 && pinkyTip.x < .95)) return {
		isFramed: false,
		message: "Mantenha a mão centralizada no campo de visão",
		progress: 50
	};
	if (distance(wrist, landmarks[9]) < .08) return {
		isFramed: false,
		message: "Aproxime a mão um pouco mais da câmera",
		progress: 75
	};
	return {
		isFramed: true,
		message: "Mão perfeitamente enquadrada!",
		progress: 100
	};
}
function classifyLibrasSign(landmarks) {
	if (!landmarks || landmarks.length < 21) return {
		letter: "-",
		confidence: 0,
		description: "Nenhuma mão detectada",
		isFramed: false,
		landmarksCount: 0,
		orientation: "UP"
	};
	const wrist = landmarks[0];
	const thumbTip = landmarks[4];
	const thumbIp = landmarks[3];
	landmarks[2];
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
	const palmSize = distance(wrist, middleMcp);
	if (palmSize === 0) return {
		letter: "-",
		confidence: 0,
		description: "Erro de escala da mão",
		isFramed: false,
		landmarksCount: landmarks.length,
		orientation: "UP"
	};
	const deltaX = Math.abs(middleMcp.x - wrist.x);
	const deltaY = middleMcp.y - wrist.y;
	let orientation = "SIDEWAYS";
	if (deltaY < -.06 && deltaY < -deltaX) orientation = "UP";
	else if (deltaY > .06 && deltaY > deltaX) orientation = "DOWN";
	else orientation = "SIDEWAYS";
	const wristApertureAngle = getWristApertureAngle(wrist, indexTip, thumbTip);
	const isFingersPointingDown = indexTip.y > indexMcp.y && middleTip.y > middleMcp.y;
	const isIndexPointingVerticalUp = indexTip.y < indexMcp.y && Math.abs(indexTip.y - indexMcp.y) > Math.abs(indexTip.x - indexMcp.x) * .85;
	const isIndexPointingHorizontalSideways = Math.abs(indexTip.x - indexMcp.x) > Math.abs(indexTip.y - indexMcp.y) * .85;
	const isPinkyExt = distance(wrist, pinkyTip) > distance(wrist, pinkyPip) * 1.12 || distance(pinkyMcp, pinkyTip) > distance(pinkyMcp, pinkyPip) * 1.3;
	const isIndexExt = distance(wrist, indexTip) > distance(wrist, indexPip) * 1.15 || isIndexPointingHorizontalSideways;
	const isMiddleExt = distance(wrist, middleTip) > distance(wrist, middlePip) * 1.15 || Math.abs(middleTip.x - middleMcp.x) > palmSize * .3;
	const isRingExt = distance(wrist, ringTip) > distance(wrist, ringPip) * 1.15;
	const isIndexFoldedInFist = distance(wrist, indexTip) < distance(wrist, indexMcp) * 1.25;
	const isMiddleFoldedInFist = distance(wrist, middleTip) < distance(wrist, middleMcp) * 1.25;
	const isRingFoldedInFist = distance(wrist, ringTip) < distance(wrist, ringMcp) * 1.25;
	const isPinkyFoldedInFist = distance(wrist, pinkyTip) < distance(wrist, pinkyMcp) * 1.25;
	const extendedCount = [
		isIndexExt,
		isMiddleExt,
		isRingExt,
		isPinkyExt
	].filter(Boolean).length;
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
	const isRingFormedWithThumb = thumbToMiddleTipDist < .38 || thumbToMiddleTipDist < .42 && thumbToRingTipDist < .42;
	const isIndexHooked = distance(indexTip, indexDip) < palmSize * .22 || distance(indexTip, indexPip) < palmSize * .32 || indexPip.y < middlePip.y - palmSize * .03 && indexTip.y > indexPip.y - palmSize * .03;
	const isThumbCrossingOverToRingFinger = (distance(thumbTip, ringPip) / palmSize < .38 || distance(thumbTip, ringMcp) / palmSize < .38) && distance(thumbTip, indexPip) / palmSize < .35 && thumbTip.z < indexPip.z;
	const isThumbInPalmArea = isThumbInsidePalmRegion(thumbTip, wrist, indexMcp, middleMcp, pinkyMcp);
	let letter = "?";
	let confidence = .85;
	let description = "Gesto em análise";
	if (isIndexExt && isMiddleExt && isRingExt && isPinkyExt && (orientation === "UP" || indexTip.y < indexMcp.y)) {
		letter = "B";
		confidence = .98;
		description = "Letra B: Quatro dedos estendidos para CIMA e polegar recolhido sobre a palma";
	} else if (distance(wrist, indexTip) > distance(wrist, indexMcp) * 1.3 && !isIndexFoldedInFist && !isMiddleExt && !isRingExt && !isPinkyExt && (orientation === "UP" || indexTip.y < indexMcp.y) && isRingFormedWithThumb) {
		letter = "D";
		confidence = .98;
		description = "Letra D: Indicador estendido para CIMA e pontas dos demais dedos unidas ao polegar";
	} else if (isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt && !isRingFormedWithThumb && (isIndexPointingHorizontalSideways || orientation === "SIDEWAYS") && !isIndexPointingVerticalUp && !isFingersPointingDown && wristApertureAngle < 52) {
		letter = "G";
		confidence = .98;
		description = "Letra G: Mão de lado com indicador apontando na horizontal";
	} else if (!isIndexFoldedInFist && distance(wrist, indexTip) > distance(wrist, indexMcp) * 1.3 && isIndexPointingVerticalUp && isMiddleFoldedInFist && isRingFoldedInFist && isPinkyFoldedInFist && !isRingFormedWithThumb && (wristApertureAngle >= 25 || thumbIndexDist > .28 || distance(thumbTip, indexMcp) > palmSize * .28)) {
		letter = "L";
		confidence = .98;
		description = "Letra L: Indicador para CIMA e polegar aberto em L";
	} else if (indexTip.y < indexMcp.y - palmSize * .08 && middleTip.y < middleMcp.y - palmSize * .08 && !isIndexFoldedInFist && !isMiddleFoldedInFist && !isRingExt && !isPinkyExt && (indexTip.x - middleTip.x) * (indexMcp.x - middleMcp.x) < 0) {
		letter = "R";
		confidence = .98;
		description = "Letra R: Indicador e médio estendidos para CIMA e cruzados";
	} else if (indexTip.y < indexMcp.y && middleTip.y < middleMcp.y && isIndexExt && isMiddleExt && !isIndexFoldedInFist && !isMiddleFoldedInFist && (!isRingExt || isRingFoldedInFist) && (!isPinkyExt || isPinkyFoldedInFist) && !isIndexPointingHorizontalSideways && !isFingersPointingDown) {
		if (indexMiddleDist > .28) {
			letter = "V";
			confidence = .98;
			description = "Letra V: Indicador e médio estendidos AFASTADOS em V";
		} else {
			letter = "U";
			confidence = .98;
			description = "Letra U: Indicador e médio estendidos JUNTOS / PARALELOS";
		}
	} else if (isIndexExt && isMiddleExt && !isIndexFoldedInFist && !isMiddleFoldedInFist && !isRingExt && !isPinkyExt && !isRingFormedWithThumb && !isFingersPointingDown && (orientation === "SIDEWAYS" || Math.abs(indexMcp.x - wrist.x) > .03 || Math.abs(middleMcp.x - wrist.x) > .03 || isIndexPointingHorizontalSideways)) {
		if (indexMiddleDist > .26 || Math.abs(middleTip.x - indexTip.x) > .04 || middleTip.y > indexTip.y + .02) {
			letter = "K";
			confidence = .98;
			description = "Letra K: Mão de lado com indicador e médio AFASTADOS e polegar no meio";
		} else {
			letter = "H";
			confidence = .98;
			description = "Letra H: Mão de lado com indicador e médio JUNTOS na horizontal";
		}
	} else if (isIndexExt && isMiddleExt && isRingExt && !isRingFoldedInFist && !isPinkyExt && indexTip.y > indexPip.y && middleTip.y > middlePip.y && ringTip.y > ringPip.y) {
		letter = "M";
		confidence = .98;
		description = "Letra M: Indicador, médio e anelar apontados para BAIXO";
	} else if (isIndexExt && isMiddleExt && (isRingFoldedInFist || !isRingExt) && !isPinkyExt && indexTip.y > indexMcp.y && middleTip.y > middleMcp.y) {
		letter = "N";
		confidence = .98;
		description = "Letra N: Indicador e médio apontados para BAIXO";
	} else if (indexTip.y < wrist.y && middleTip.y >= wrist.y - palmSize * .1 && !isRingExt && !isPinkyExt && (isRingFoldedInFist || ringWristDist < .75) && (isPinkyFoldedInFist || pinkyWristDist < .75)) {
		letter = "P";
		confidence = .98;
		description = "Letra P: Indicador horizontal e médio inclinado para BAIXO";
	} else if (isIndexExt && isMiddleExt && isRingExt && !isPinkyExt && (orientation === "UP" || indexTip.y < indexMcp.y)) {
		letter = "W";
		confidence = .97;
		description = "Letra W: Indicador, médio e anelar estendidos para CIMA";
	} else if (!isPinkyFoldedInFist && distance(wrist, pinkyTip) > distance(wrist, pinkyMcp) * 1.25 && !isIndexExt && !isMiddleExt && !isRingExt && pinkyTip.y < wrist.y && (isThumbInPalmArea || distance(thumbTip, indexMcp) < palmSize * .4)) {
		letter = "I";
		confidence = .98;
		description = "Letra I: Dedo mínimo estendido para CIMA e polegar recolhido";
	} else if (!isPinkyFoldedInFist && distance(wrist, pinkyTip) > distance(wrist, pinkyMcp) * 1.2 && !isIndexExt && !isMiddleExt && !isRingExt && (pinkyTip.y > pinkyMcp.y - palmSize * .1 || pinkyTip.y >= wrist.y - palmSize * .15)) {
		letter = "J";
		confidence = .98;
		description = "Letra J: Dedo mínimo estendido com movimento descendente curvo";
	} else if (isMiddleExt && isRingExt && isPinkyExt && thumbIndexDist < .35) {
		letter = "F";
		confidence = .96;
		description = "Letra F: Médio, anelar e mínimo para CIMA com indicador e polegar por FORA";
	} else if (isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt && (orientation === "DOWN" || isFingersPointingDown)) {
		letter = "Q";
		confidence = .96;
		description = "Letra Q: Indicador e polegar apontados para BAIXO";
	} else if (isIndexHooked && isMiddleFoldedInFist && isRingFoldedInFist && isPinkyFoldedInFist && !isIndexExt) {
		letter = "X";
		confidence = .98;
		description = "Letra X: Dedo indicador em formato de gancho para CIMA";
	} else if ((extendedCount === 0 || isIndexFoldedInFist && isMiddleFoldedInFist && isRingFoldedInFist) && isPinkyFoldedInFist) {
		const isThumbExtendedUp = thumbTip.y < thumbIp.y || thumbTip.y < indexPip.y + palmSize * .05;
		if ((thumbTip.x - indexPip.x) * (thumbTip.x - middlePip.x) < -1e-4) {
			letter = "T";
			confidence = .98;
			description = "Letra T: Figas com polegar encaixado POR DENTRO entre indicador e médio";
		} else if (!isThumbInPalmArea && isThumbExtendedUp && !isThumbCrossingOverToRingFinger) {
			letter = "A";
			confidence = .98;
			description = "Letra A: Punho fechado com polegar esticado ao lado do indicador";
		} else if (isThumbCrossingOverToRingFinger) {
			letter = "S";
			confidence = .96;
			description = "Letra S: Punho fechado com polegar cruzando por cima dos dedos";
		} else if (isThumbInPalmArea || distance(thumbTip, middleMcp) < palmSize * .4) {
			letter = "E";
			confidence = .98;
			description = "Letra E: Falanges dobradas com polegar recolhido na palma";
		} else {
			letter = "E";
			confidence = .95;
			description = "Letra E: Falanges dobradas sobre a palma";
		}
	} else if (!isFingersPointingDown && !(indexTip.y > indexMcp.y && middleTip.y > middleMcp.y) && !isIndexFoldedInFist && !isMiddleFoldedInFist && !isRingFoldedInFist && !isPinkyFoldedInFist && thumbIndexDist >= .25 && thumbIndexDist <= 1.35 && middleWristDist > .65 && ringWristDist > .6 && pinkyWristDist > .55) {
		letter = "C";
		confidence = .96;
		description = "Letra C: Quatro dedos e polegar curvados em formato de C";
	} else if (isPinkyExt && isIndexFoldedInFist && isMiddleFoldedInFist && isRingFoldedInFist && !isThumbInPalmArea && thumbPinkyDist > .75) {
		letter = "Y";
		confidence = .96;
		description = "Letra Y: Polegar e dedo mínimo estendidos para os lados (Hang Loose)";
	} else if (thumbIndexDist < .38 && thumbMiddleDist < .45 && avgWristDist > .9 && distance(thumbTip, wrist) > palmSize * .7) {
		letter = "O";
		confidence = .95;
		description = "Letra O: Pontas dos dedos unidas ao polegar formando um círculo aberto";
	} else if (isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt && (indexTip.z > .05 || Math.abs(indexTip.x - indexMcp.x) > palmSize * .25)) {
		letter = "Z";
		confidence = .95;
		description = "Letra Z: Indicador estendido desenhando Z no ar";
	}
	return {
		letter,
		confidence,
		description,
		isFramed: true,
		landmarksCount: landmarks.length,
		orientation
	};
}
/**
* Avalia em tempo real a mão do usuário em comparação direta com o modelo oficial da letra alvo.
* Fornece dicas de correção imediatas e pontuação por aspecto (configuração de mão, orientação e estabilidade/movimento).
*/
function evaluateSignAgainstTarget(landmarks, targetLetter, motionBuffer) {
	const targetUpper = targetLetter.toUpperCase();
	const reference = getAlphabetReference(targetUpper);
	if (!landmarks || landmarks.length < 21) return {
		isTargetMatch: false,
		targetLetter: targetUpper,
		detectedLetter: "-",
		overallScore: 0,
		accuracyStars: 1,
		orientationScore: 1,
		stabilityScore: 1,
		motionScore: 1,
		feedback: "Mostre sua mão no campo de visão da câmera para iniciar a avaliação.",
		correctionCues: ["Centralize a mão na câmera", reference.handShapeDescription],
		reference
	};
	const detection = classifyLibrasSign(landmarks);
	const detectedUpper = detection.letter.toUpperCase();
	const isMatch = detectedUpper === targetUpper;
	let motionScore = 3;
	let hasValidMotion = true;
	if (reference.hasMovement && motionBuffer && motionBuffer.length >= 5) {
		const startPos = motionBuffer[0][8];
		const currentPos = landmarks[8];
		const deltaMotion = distance(startPos, currentPos);
		if (reference.movementType === "upward_bounce") hasValidMotion = currentPos.y < startPos.y - .02 || deltaMotion > .03;
		else if (reference.movementType === "curve") {
			const pinkyStart = motionBuffer[0][20];
			hasValidMotion = landmarks[20].y > pinkyStart.y - .02 || deltaMotion > .03;
		} else if (reference.movementType === "pull") hasValidMotion = currentPos.z < startPos.z - .01 || deltaMotion > .025;
		else if (reference.movementType === "zigzag") hasValidMotion = deltaMotion > .04;
		else if (reference.movementType === "rotation") hasValidMotion = deltaMotion > .025;
		motionScore = hasValidMotion ? 3 : 2;
	}
	let feedback = "";
	const correctionCues = [];
	if (isMatch) {
		if (reference.hasMovement && !hasValidMotion) feedback = `Configuração de mão da Letra ${targetUpper} correta! Agora execute o movimento oficial: ${reference.movementInstructions || "movimento do sinal"}.`;
		else feedback = `Excelente! O sinal da Letra ${targetUpper} está idêntico ao modelo oficial de referência! 🎉`;
	} else if (detectedUpper !== "-" && detectedUpper !== "?") {
		feedback = `Você está realizando o sinal da Letra ${detectedUpper}. Para a Letra ${targetUpper}: ${reference.pedagogicalTip}`;
		reference.correctionCues.forEach((c) => correctionCues.push(`${c.rule}: ${c.correction}`));
	} else {
		feedback = `Ajuste sua mão para o modelo da Letra ${targetUpper}: ${reference.pedagogicalTip}`;
		reference.correctionCues.forEach((c) => correctionCues.push(c.correction));
	}
	const accuracyStars = isMatch ? hasValidMotion ? 3 : 2 : 1;
	const orientationScore = detection.orientation === "UP" ? 3 : 2;
	return {
		isTargetMatch: isMatch && hasValidMotion,
		targetLetter: targetUpper,
		detectedLetter: detectedUpper,
		overallScore: isMatch ? hasValidMotion ? 100 : 85 : 40,
		accuracyStars,
		orientationScore,
		stabilityScore: isMatch ? 3 : 1,
		motionScore,
		feedback,
		correctionCues,
		reference
	};
}
var initialLandmarkerState = {
	isInitialized: false,
	isLoadingModel: false,
	isDetecting: false,
	error: null,
	landmarks: null,
	landmarksList: null
};
var LANDMARK_STYLE_MAP = {
	0: {
		color: "#0f172a",
		textColor: "#ffffff"
	},
	1: {
		color: "#fca5a5",
		textColor: "#000000"
	},
	2: {
		color: "#f87171",
		textColor: "#ffffff"
	},
	3: {
		color: "#ef4444",
		textColor: "#ffffff"
	},
	4: {
		color: "#991b1b",
		textColor: "#ffffff"
	},
	5: {
		color: "#86efac",
		textColor: "#000000"
	},
	6: {
		color: "#4ade80",
		textColor: "#000000"
	},
	7: {
		color: "#22c55e",
		textColor: "#ffffff"
	},
	8: {
		color: "#166534",
		textColor: "#ffffff"
	},
	9: {
		color: "#93c5fd",
		textColor: "#000000"
	},
	10: {
		color: "#60a5fa",
		textColor: "#000000"
	},
	11: {
		color: "#3b82f6",
		textColor: "#ffffff"
	},
	12: {
		color: "#1e40af",
		textColor: "#ffffff"
	},
	13: {
		color: "#fef08a",
		textColor: "#000000"
	},
	14: {
		color: "#facc15",
		textColor: "#000000"
	},
	15: {
		color: "#f97316",
		textColor: "#ffffff"
	},
	16: {
		color: "#9a3412",
		textColor: "#ffffff"
	},
	17: {
		color: "#f5d0fe",
		textColor: "#000000"
	},
	18: {
		color: "#e879f9",
		textColor: "#000000"
	},
	19: {
		color: "#c084fc",
		textColor: "#ffffff"
	},
	20: {
		color: "#6b21a8",
		textColor: "#ffffff"
	}
};
function useHandLandmarker(options) {
	const numHands = options?.numHands ?? 1;
	const autoInit = options?.autoInit ?? true;
	const [landmarkerState, setLandmarkerState] = (0, import_react.useState)(initialLandmarkerState);
	const handLandmarkerRef = (0, import_react.useRef)(null);
	const animFrameIdRef = (0, import_react.useRef)(null);
	const lastVideoTimeRef = (0, import_react.useRef)(-1);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !autoInit) return;
		let isMounted = true;
		async function initMediaPipe() {
			setLandmarkerState((prev) => ({
				...prev,
				isLoadingModel: true,
				error: null
			}));
			try {
				const { HandLandmarker, FilesetResolver } = await import(
					/* @vite-ignore */
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm"
);
				if (!isMounted) return;
				const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
				if (!isMounted) return;
				const landmarker = await HandLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
						delegate: "GPU"
					},
					runningMode: "VIDEO",
					numHands
				});
				if (!isMounted) return;
				handLandmarkerRef.current = landmarker;
				setLandmarkerState({
					isInitialized: true,
					isLoadingModel: false,
					isDetecting: false,
					error: null,
					landmarks: null,
					landmarksList: null
				});
			} catch (err) {
				console.error("[MediaPipe] Erro ao carregar o modelo HandLandmarker:", err);
				if (isMounted) {
					const errorMsg = err instanceof Error ? err.message : "Falha ao conectar com o modelo de visão";
					setLandmarkerState((prev) => ({
						...prev,
						isInitialized: false,
						isLoadingModel: false,
						error: `Erro ao inicializar o detector de mãos: ${errorMsg}`
					}));
				}
			}
		}
		initMediaPipe();
		return () => {
			isMounted = false;
			if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
			if (handLandmarkerRef.current) {
				handLandmarkerRef.current.close();
				handLandmarkerRef.current = null;
			}
		};
	}, [numHands, autoInit]);
	const drawLandmarks = (0, import_react.useCallback)((allHands, canvas, video) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		canvas.width = video.videoWidth || 640;
		canvas.height = video.videoHeight || 480;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const CONNECTIONS = [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
			[0, 5],
			[5, 6],
			[6, 7],
			[7, 8],
			[5, 9],
			[9, 10],
			[10, 11],
			[11, 12],
			[9, 13],
			[13, 14],
			[14, 15],
			[15, 16],
			[13, 17],
			[17, 18],
			[18, 19],
			[19, 20],
			[0, 17]
		];
		for (const landmarks of allHands) {
			if (!landmarks || landmarks.length < 21) continue;
			ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
			ctx.lineWidth = 3;
			ctx.lineCap = "round";
			for (const [start, end] of CONNECTIONS) {
				const p1 = landmarks[start];
				const p2 = landmarks[end];
				if (p1 && p2) {
					ctx.beginPath();
					ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
					ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
					ctx.stroke();
				}
			}
			for (let i = 0; i < landmarks.length; i++) {
				const pt = landmarks[i];
				const cx = pt.x * canvas.width;
				const cy = pt.y * canvas.height;
				const style = LANDMARK_STYLE_MAP[i] || {
					color: "#ffffff",
					textColor: "#000000"
				};
				const radius = i === 0 ? 10 : 8.5;
				ctx.beginPath();
				ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
				ctx.fillStyle = style.color;
				ctx.fill();
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = i === 0 ? "#ffffff" : "rgba(0, 0, 0, 0.8)";
				ctx.stroke();
				ctx.fillStyle = style.textColor;
				ctx.font = "bold 9px system-ui, -apple-system, sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(i.toString(), cx, cy + .5);
			}
		}
	}, []);
	return {
		landmarkerState,
		startDetection: (0, import_react.useCallback)((videoElement, canvasElement) => {
			if (!handLandmarkerRef.current) {
				console.warn("[MediaPipe] Modelo ainda não está pronto.");
				return;
			}
			setLandmarkerState((prev) => ({
				...prev,
				isDetecting: true
			}));
			function detectFrame() {
				if (!videoElement || videoElement.paused || videoElement.ended) {
					animFrameIdRef.current = requestAnimationFrame(detectFrame);
					return;
				}
				const currentTime = videoElement.currentTime;
				if (currentTime !== lastVideoTimeRef.current && handLandmarkerRef.current) {
					lastVideoTimeRef.current = currentTime;
					try {
						const results = handLandmarkerRef.current.detectForVideo(videoElement, performance.now());
						if (results.landmarks && results.landmarks.length > 0) {
							const allHands = results.landmarks;
							setLandmarkerState((prev) => ({
								...prev,
								landmarks: allHands[0],
								landmarksList: allHands
							}));
							if (canvasElement) drawLandmarks(allHands, canvasElement, videoElement);
						} else {
							setLandmarkerState((prev) => ({
								...prev,
								landmarks: null,
								landmarksList: null
							}));
							if (canvasElement) {
								const ctx = canvasElement.getContext("2d");
								if (ctx) ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
							}
						}
					} catch (err) {
						console.error("[MediaPipe] Erro durante detecção do frame:", err);
					}
				}
				animFrameIdRef.current = requestAnimationFrame(detectFrame);
			}
			animFrameIdRef.current = requestAnimationFrame(detectFrame);
		}, [drawLandmarks]),
		stopDetection: (0, import_react.useCallback)(() => {
			if (animFrameIdRef.current) {
				cancelAnimationFrame(animFrameIdRef.current);
				animFrameIdRef.current = null;
			}
			setLandmarkerState((prev) => ({
				...prev,
				isDetecting: false,
				landmarks: null,
				landmarksList: null
			}));
		}, [])
	};
}
var LibrasLessonMirror = ({ targetLetter, targetLabel, targetDescription, onComplete, onSkip }) => {
	const [stream, setStream] = (0, import_react.useState)(null);
	const [cameraPermission, setCameraPermission] = (0, import_react.useState)("idle");
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const reference = getAlphabetReference(targetLetter);
	const [activeMediaView, setActiveMediaView] = (0, import_react.useState)("primary");
	const motionHistoryRef = (0, import_react.useRef)([]);
	const [framingStatus, setFramingStatus] = (0, import_react.useState)({
		isFramed: false,
		message: "Aguardando posicionamento da mão...",
		progress: 0
	});
	const [evaluation, setEvaluation] = (0, import_react.useState)(() => evaluateSignAgainstTarget(null, targetLetter));
	const [holdProgress, setHoldProgress] = (0, import_react.useState)(0);
	const [isCompleted, setIsCompleted] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const videoRefMediaRef = (0, import_react.useRef)(null);
	const { landmarkerState, startDetection, stopDetection } = useHandLandmarker({ numHands: 1 });
	const requestCamera = (0, import_react.useCallback)(async () => {
		setCameraError(null);
		try {
			if (stream) stream.getTracks().forEach((track) => track.stop());
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: "user"
				},
				audio: false
			});
			setStream(mediaStream);
			setCameraPermission("granted");
			soundFx.playPop();
		} catch (err) {
			console.error("[LibrasLessonMirror] Erro ao acessar câmera:", err);
			setCameraPermission("denied");
			setCameraError("Não foi possível acessar a câmera. Verifique as permissões no navegador ou use o botão pular.");
		}
	}, [stream]);
	(0, import_react.useEffect)(() => {
		if (videoRef.current && stream) videoRef.current.srcObject = stream;
	}, [stream]);
	(0, import_react.useEffect)(() => {
		if (landmarkerState.isInitialized && videoRef.current && stream) startDetection(videoRef.current, canvasRef.current);
		return () => {
			stopDetection();
		};
	}, [
		landmarkerState.isInitialized,
		stream,
		startDetection,
		stopDetection
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (stream) stream.getTracks().forEach((t) => t.stop());
		};
	}, [stream]);
	(0, import_react.useEffect)(() => {
		if (!landmarkerState.landmarks || landmarkerState.landmarks.length < 21) {
			setFramingStatus({
				isFramed: false,
				message: "Mostre sua mão para a câmera",
				progress: 0
			});
			setEvaluation(evaluateSignAgainstTarget(null, targetLetter));
			setHoldProgress((p) => Math.max(0, p - 12));
			return;
		}
		motionHistoryRef.current.push(landmarkerState.landmarks);
		if (motionHistoryRef.current.length > 12) motionHistoryRef.current.shift();
		const framing = checkHandFraming(landmarkerState.landmarks);
		setFramingStatus(framing);
		const evalResult = evaluateSignAgainstTarget(landmarkerState.landmarks, targetLetter, motionHistoryRef.current);
		setEvaluation(evalResult);
		if (evalResult.isTargetMatch && framing.isFramed && !isCompleted) setHoldProgress((prev) => {
			const next = prev + (reference.hasMovement ? 22 : 18);
			if (next >= 100) {
				setIsCompleted(true);
				soundFx.playChime();
				setTimeout(() => {
					onComplete({
						accuracy: evalResult.accuracyStars,
						orientationScore: evalResult.orientationScore,
						stabilityScore: evalResult.stabilityScore,
						detectedLetter: evalResult.detectedLetter
					});
				}, 700);
				return 100;
			}
			return next;
		});
		else if (!isCompleted) setHoldProgress((prev) => Math.max(0, prev - 6));
	}, [
		landmarkerState.landmarks,
		targetLetter,
		reference.hasMovement,
		isCompleted,
		onComplete
	]);
	if (cameraPermission !== "granted") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-3xl border-2 border-border bg-card/95 p-6 text-center shadow-chunky backdrop-blur-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🎯 Modelo Oficial de Referência · Letra ", reference.letter] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-4 flex flex-col items-center justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden rounded-3xl border-4 border-primary/30 bg-muted shadow-chunky",
						children: reference.mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-60 w-60 sm:h-72 sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: reference.primaryMedia,
								autoPlay: true,
								loop: true,
								muted: true,
								playsInline: true,
								className: "h-full w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3 text-mint fill-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sinal com Movimento" })]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-60 w-60 sm:h-72 sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: activeMediaView === "secondary" && reference.secondaryMedia ? reference.secondaryMedia : reference.primaryMedia,
								alt: `Modelo correto do sinal da letra ${reference.letter}`,
								className: "h-full w-full object-cover"
							}), reference.secondaryMedia && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-2 inset-x-2 flex justify-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActiveMediaView("primary"),
									className: `rounded-full px-3 py-1 text-[10px] font-extrabold transition-all ${activeMediaView === "primary" ? "bg-primary text-primary-foreground shadow-sm" : "bg-black/60 text-white hover:bg-black/80"}`,
									children: "Frente"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActiveMediaView("secondary"),
									className: `rounded-full px-3 py-1 text-[10px] font-extrabold transition-all ${activeMediaView === "secondary" ? "bg-primary text-primary-foreground shadow-sm" : "bg-black/60 text-white hover:bg-black/80"}`,
									children: "Lado"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mt-4 font-display text-2xl font-black",
						children: [
							"Pratique na Câmera: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: targetLabel
							}),
							" (Letra ",
							targetLetter,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 max-w-md text-xs text-muted-foreground",
						children: [
							"A câmera e a IA analisarão seu movimento em tempo real e compararão com o ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "modelo oficial de referência" }),
							" acima."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-3 w-full max-w-md space-y-2 text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-primary/20 bg-primary/5 p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-display text-xs font-extrabold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Como reproduzir o modelo oficial:" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-foreground/90 leading-relaxed font-medium",
							children: reference.pedagogicalTip
						}),
						reference.movementInstructions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs font-bold text-amber-700 dark:text-amber-300",
							children: ["🔄 Movimento: ", reference.movementInstructions]
						})
					]
				})
			}),
			cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2 rounded-2xl bg-destructive/10 p-3 text-xs font-bold text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cameraError })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: requestCamera,
					className: "flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-base font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ligar Câmera & Comparar com Modelo" })]
				}), onSkip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onSkip,
					className: "rounded-full border border-border bg-muted/60 px-6 py-4 font-display text-sm font-extrabold text-muted-foreground hover:bg-muted hover:text-foreground",
					children: "Pular / Sem Câmera"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[11px] text-muted-foreground",
				children: "🔒 Processamento de visão 100% privado e local no seu navegador."
			})
		]
	});
	const isMatch = evaluation.isTargetMatch;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 border border-border shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-rainbow text-2xl shadow-sm",
						children: reference.emoji
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold uppercase tracking-wider text-primary",
						children: "Desafio Prático com IA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-lg font-black text-foreground",
						children: [
							"Reproduza: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: targetLabel
							}),
							" (Letra ",
							targetLetter,
							")"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 rounded-full bg-mint/30 px-3.5 py-1.5 font-display text-xs font-extrabold text-emerald-800 dark:text-emerald-300 animate-pop",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" }), "Sinal Perfeito! 🎉"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${framingStatus.isFramed ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border border-amber-500/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "h-3.5 w-3.5" }), framingStatus.message]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col rounded-3xl border-2 border-primary/30 bg-muted/40 p-4 shadow-chunky",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-black uppercase text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modelo Oficial Correto" })]
							}), reference.hasMovement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-3 w-3 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Movimento" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black border border-border/50",
							children: [
								reference.mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									ref: videoRefMediaRef,
									src: reference.primaryMedia,
									autoPlay: true,
									loop: true,
									muted: true,
									playsInline: true,
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: activeMediaView === "secondary" && reference.secondaryMedia ? reference.secondaryMedia : reference.primaryMedia,
									alt: `Exemplo correto de ${reference.letter}`,
									className: "h-full w-full object-cover"
								}),
								reference.secondaryMedia && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-2 left-2 z-10 flex gap-1 rounded-full bg-black/70 p-1 backdrop-blur-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveMediaView("primary"),
										className: `rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${activeMediaView === "primary" ? "bg-primary text-white" : "text-slate-300 hover:text-white"}`,
										children: "Frente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveMediaView("secondary"),
										className: `rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${activeMediaView === "secondary" ? "bg-primary text-white" : "text-slate-300 hover:text-white"}`,
										children: "Lado"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs",
									children: reference.orientationDescription
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl bg-card p-2.5 text-left text-xs border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground block font-bold mb-0.5",
								children: "Configuração Exata:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px] leading-tight",
								children: reference.handShapeDescription
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col rounded-3xl border-2 border-border bg-card p-4 shadow-chunky",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-black uppercase text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sua Execução na Câmera" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-[11px] font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IA Ativa" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									ref: videoRef,
									autoPlay: true,
									playsInline: true,
									muted: true,
									className: "h-full w-full object-cover transform -scale-x-100"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
									ref: canvasRef,
									className: "pointer-events-none absolute inset-0 h-full w-full object-cover transform -scale-x-100"
								}),
								landmarkerState.isLoadingModel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs font-bold",
										children: "Carregando IA de visão..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-xl bg-black/80 px-2.5 py-1.5 backdrop-blur-md border border-white/20 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-8 w-8 place-items-center rounded-lg font-display text-base font-black ${isMatch ? "bg-mint text-slate-900 animate-pop" : "bg-white/20 text-white"}`,
										children: evaluation.detectedLetter !== "-" ? evaluation.detectedLetter : "…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-left text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[9px] font-bold uppercase text-slate-400",
											children: "Detectado"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold",
											children: isMatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-mint",
												children: [
													"Correto: ",
													evaluation.detectedLetter,
													"!"
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: evaluation.detectedLetter !== "-" ? `Letra ${evaluation.detectedLetter}` : "Aguardando..." })
										})]
									})]
								}),
								isMatch && !isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-2 right-2 z-20 flex items-center gap-2 rounded-xl bg-black/80 px-3 py-1.5 backdrop-blur-md border border-mint/50 animate-pop",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase text-mint",
										children: reference.hasMovement ? "Movimento" : "Segure"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 w-14 overflow-hidden rounded-full bg-white/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-mint transition-all duration-100",
											style: { width: `${holdProgress}%` }
										})
									})]
								}),
								isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-950/85 backdrop-blur-xs text-white animate-pop",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-14 w-14 place-items-center rounded-full bg-mint text-3xl text-slate-900 shadow-glow-teen animate-bounce-soft",
											children: "✨"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mt-2 font-display text-xl font-black",
											children: "Perfeito!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-emerald-200",
											children: "Sinal validado com o modelo oficial!"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-3 rounded-xl p-2.5 text-left text-xs font-bold transition-colors ${isMatch ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30" : "bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/30"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1.5",
								children: [isMatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-emerald-600 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 text-amber-600 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 text-[11px] leading-tight",
									children: evaluation.feedback
								})]
							})
						})
					]
				})]
			}),
			reference.correctionCues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-display text-xs font-extrabold text-foreground mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pontos de Atenção para o Sinal Correto:" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",
					children: reference.correctionCues.map((cue, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-xl bg-muted/60 p-2.5 border border-border/50 text-foreground/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-extrabold text-primary shrink-0",
							children: "✓"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] leading-relaxed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground",
									children: [cue.rule, ":"]
								}),
								" ",
								cue.correction
							]
						})]
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pt-2",
				children: [onSkip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onSkip,
					className: "text-xs font-bold text-muted-foreground hover:text-foreground",
					children: "Pular desafio de câmera"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setIsCompleted(true);
						soundFx.playChime();
						onComplete({
							accuracy: 3,
							orientationScore: 3,
							stabilityScore: 2,
							detectedLetter: targetLetter
						});
					},
					className: "ml-auto flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-card border border-border shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validar Manualmente" })]
				})]
			})
		]
	});
};
var mascot_a_default = "/assets/mascot_a-CBOUd1Im.jpg";
var mascot_b_default = "/assets/mascot_b-CAHGx6bi.jpg";
var mascot_c_default = "/assets/mascot_c-Q9nPCY1k.jpg";
var mascot_d_default = "/assets/mascot_d-Cjjp-zCn.jpg";
var mascot_e_default = "/assets/mascot_e-QbxQWpK4.jpg";
var ANIMAL_MASCOTS = {
	A: {
		letter: "A",
		animalName: "Capivarinha Luvi",
		species: "Capivara",
		emoji: "🦫",
		image: mascot_a_default,
		tone: "bg-sunshine",
		badgeBg: "from-amber-400 to-orange-500",
		pawDescription: "Punho fechado com o polegar reto encostado na lateral do indicador.",
		librasExplanation: "A Capivarinha Luvi fecha a patinha com o polegar ao lado para fazer a Letra A em LIBRAS!",
		cheerMessage: "Incrível! A Capivarinha Luvi adorou ver você fazer a Letra A!"
	},
	B: {
		letter: "B",
		animalName: "Coelhinho Theo",
		species: "Coelho",
		emoji: "🐰",
		image: mascot_b_default,
		tone: "bg-sky",
		badgeBg: "from-sky-400 to-blue-600",
		pawDescription: "Quatro dedos estendidos para cima e polegar dobrado na palma.",
		librasExplanation: "O Coelhinho Theo ergue os 4 dedinhos juntos e dobra o polegar na frente da palma para a Letra B!",
		cheerMessage: "Saltando de alegria! O Coelhinho Theo manda os parabéns pela Letra B!"
	},
	C: {
		letter: "C",
		animalName: "Gatinha Mel",
		species: "Gatinha",
		emoji: "🐱",
		image: mascot_c_default,
		tone: "bg-coral",
		badgeBg: "from-rose-400 to-pink-600",
		pawDescription: "Dedos curvados formando um semicírculo aberto como a letra C.",
		librasExplanation: "A Gatinha Mel curva a patinha formando um arco suave como a Letra C!",
		cheerMessage: "Miau-ravilhoso! A Gatinha Mel comemora seu acerto da Letra C!"
	},
	D: {
		letter: "D",
		animalName: "Dinossauro Dino",
		species: "Dino",
		emoji: "🦖",
		image: mascot_d_default,
		tone: "bg-mint",
		badgeBg: "from-emerald-400 to-teal-600",
		pawDescription: "Apenas o dedo indicador apontando para cima e demais dedos tocando o polegar.",
		librasExplanation: "O Dino aponta o indicador para o alto e fecha os outros dedinhos no polegar para a Letra D!",
		cheerMessage: "Rugido de campeão! O Dino adorou sua Letra D em LIBRAS!"
	},
	E: {
		letter: "E",
		animalName: "Elefantinho Nino",
		species: "Elefante",
		emoji: "🐘",
		image: mascot_e_default,
		tone: "bg-grape",
		badgeBg: "from-purple-400 to-indigo-600",
		pawDescription: "Todos os 4 dedos dobrados para baixo com as pontas repousando no polegar dobrado.",
		librasExplanation: "O Elefantinho Nino dobra as pontinhas dos dedos apoiadas no polegar para a Letra E!",
		cheerMessage: "Tromba de alegria! O Elefantinho Nino celebra sua Letra E perfeita!"
	},
	F: {
		letter: "F",
		animalName: "Foquinha Pipoca",
		species: "Foca",
		emoji: "🦭",
		image: mascot_a_default,
		tone: "bg-sky",
		badgeBg: "from-cyan-400 to-blue-500",
		pawDescription: "Indicador dobrado para baixo com o polegar por FORA dele e outros 3 dedos eretos.",
		librasExplanation: "A Foquinha Pipoca coloca o polegar por FORA do indicador para fazer a Letra F em LIBRAS!",
		cheerMessage: "Palminhas da Foquinha Pipoca! Você acertou a Letra F com maestria!"
	},
	G: {
		letter: "G",
		animalName: "Girafinha Gigi",
		species: "Girafa",
		emoji: "🦒",
		image: mascot_d_default,
		tone: "bg-sunshine",
		badgeBg: "from-yellow-400 to-amber-600",
		pawDescription: "Indicador apontando para cima e polegar estendido ao lado formando uma haste.",
		librasExplanation: "A Girafinha Gigi estica o dedinho para cima como seu pescoço alto para a Letra G!",
		cheerMessage: "Lá do alto a Girafinha Gigi comemora sua Letra G!"
	},
	H: {
		letter: "H",
		animalName: "Hipopótamo Pipo",
		species: "Hipopótamo",
		emoji: "🦛",
		image: mascot_b_default,
		tone: "bg-mint",
		badgeBg: "from-teal-400 to-cyan-600",
		pawDescription: "Indicador e médio estendidos com polegar no meio, girando suavemente o pulso.",
		librasExplanation: "O Hippo Pipo faz o sinal em 'V' com o polegar no meio e dá um giro alegre para a Letra H!",
		cheerMessage: "Splash de festa! O Hippo Pipo adorou seu movimento da Letra H!"
	},
	I: {
		letter: "I",
		animalName: "Iguana Izi",
		species: "Iguana",
		emoji: "🦎",
		image: mascot_c_default,
		tone: "bg-neon",
		badgeBg: "from-lime-400 to-green-600",
		pawDescription: "Mão fechada com apenas o dedo mínimo (mindinho) estendido para cima.",
		librasExplanation: "A Iguana Izi levanta só o dedinho mindinho bem firme para a Letra I!",
		cheerMessage: "Super esperta! A Iguana Izi aprovou sua Letra I de primeira!"
	},
	J: {
		letter: "J",
		animalName: "Jacarezinho Joca",
		species: "Jacaré",
		emoji: "🐊",
		image: mascot_d_default,
		tone: "bg-mint",
		badgeBg: "from-green-500 to-emerald-700",
		pawDescription: "Mão em 'I' (mindinho ereto) desenhando a curva da letra J no ar.",
		librasExplanation: "O Jacarezinho Joca usa o mindinho para desenhar um anzol no ar para a Letra J!",
		cheerMessage: "Croc croc de vitória! O Jacarezinho Joca celebra seu traçado da Letra J!"
	},
	K: {
		letter: "K",
		animalName: "Coala Kiki",
		species: "Coala",
		emoji: "🐨",
		image: mascot_e_default,
		tone: "bg-grape",
		badgeBg: "from-fuchsia-500 to-purple-700",
		pawDescription: "Indicador e médio em 'V' com o polegar entre eles, subindo levemente num impulso.",
		librasExplanation: "O Coala Kiki faz o formato com o dedão no meio e dá um saltinho para cima para a Letra K!",
		cheerMessage: "Abraço de Coala! O Coala Kiki ficou radiante com sua Letra K!"
	},
	L: {
		letter: "L",
		animalName: "Leãozinho Léo",
		species: "Leão",
		emoji: "🦁",
		image: mascot_a_default,
		tone: "bg-coral",
		badgeBg: "from-orange-500 to-amber-600",
		pawDescription: "Indicador para cima e polegar aberto a 90 graus formando um 'L' perfeito.",
		librasExplanation: "O Leãozinho Léo abre o indicador e o polegar formando a Letra L como sua juba!",
		cheerMessage: "Rugido de ouro! O Leãozinho Léo declara que sua Letra L ficou impecável!"
	},
	M: {
		letter: "M",
		animalName: "Macaquinho Mico",
		species: "Macaco",
		emoji: "🐵",
		image: mascot_b_default,
		tone: "bg-sunshine",
		badgeBg: "from-amber-500 to-yellow-600",
		pawDescription: "Três dedos (indicador, médio e anelar) estendidos para BAIXO apoiados no polegar.",
		librasExplanation: "O Macaquinho Mico aponta 3 dedinhos para baixo como galhos da árvore para a Letra M!",
		cheerMessage: "Pulos de alegria! O Macaquinho Mico adora ver sua Letra M!"
	},
	N: {
		letter: "N",
		animalName: "Narval Nino",
		species: "Narval",
		emoji: "🐋",
		image: mascot_c_default,
		tone: "bg-sky",
		badgeBg: "from-sky-500 to-blue-700",
		pawDescription: "Dois dedos (indicador e médio) estendidos para BAIXO sobre o polegar.",
		librasExplanation: "O Narval Nino aponta 2 dedinhos para baixo para a Letra N!",
		cheerMessage: "Mergulho de campeão! O Narval Nino manda saudações pela Letra N!"
	},
	O: {
		letter: "O",
		animalName: "Ovelhinha Olívia",
		species: "Ovelha",
		emoji: "🐑",
		image: mascot_e_default,
		tone: "bg-coral",
		badgeBg: "from-pink-400 to-rose-600",
		pawDescription: "Todos os 4 dedos e o polegar unidos pelas pontas formando um círculo 'O' fechado.",
		librasExplanation: "A Ovelhinha Olívia junta todas as pontinhas dos dedos formando uma bolinha 'O'!",
		cheerMessage: "Mééé de parabéns! A Ovelhinha Olívia aplaude sua Letra O!"
	},
	P: {
		letter: "P",
		animalName: "Pandinha Pan",
		species: "Panda",
		emoji: "🐼",
		image: mascot_a_default,
		tone: "bg-grape",
		badgeBg: "from-indigo-400 to-purple-600",
		pawDescription: "Configuração do 'K' (indicador e médio com polegar no meio) com a mão apontada na horizontal.",
		librasExplanation: "O Pandinha Pan posiciona os dedos na horizontal para a Letra P!",
		cheerMessage: "Fofura total! O Pandinha Pan comemora sua Letra P certinha!"
	},
	Q: {
		letter: "Q",
		animalName: "Quokka Quico",
		species: "Quokka",
		emoji: "🦘",
		image: mascot_d_default,
		tone: "bg-mint",
		badgeBg: "from-emerald-500 to-teal-700",
		pawDescription: "Indicador e polegar estendidos e apontados para BAIXO em formato de pinça.",
		librasExplanation: "O Quokka Quico aponta o indicador e polegar para baixo para a Letra Q!",
		cheerMessage: "O sorriso mais feliz do mundo! O Quokka Quico aplaudiu sua Letra Q!"
	},
	R: {
		letter: "R",
		animalName: "Raposinha Rubi",
		species: "Raposa",
		emoji: "🦊",
		image: mascot_b_default,
		tone: "bg-coral",
		badgeBg: "from-orange-500 to-rose-600",
		pawDescription: "Dedo médio cruzado sobre o indicador estendido (dedos cruzados da sorte).",
		librasExplanation: "A Raposinha Rubi cruza o dedinho médio no indicador como sinal de sorte para a Letra R!",
		cheerMessage: "Astuta e brilhante! A Raposinha Rubi celebra sua Letra R!"
	},
	S: {
		letter: "S",
		animalName: "Sapinho Sapeca",
		species: "Sapo",
		emoji: "🐸",
		image: mascot_c_default,
		tone: "bg-neon",
		badgeBg: "from-lime-500 to-green-700",
		pawDescription: "Punho fechado com o polegar cruzado sobre a FRENTE dos dedos indicador e médio.",
		librasExplanation: "O Sapinho Sapeca fecha o punho e cruza o polegar na frente para a Letra S!",
		cheerMessage: "Pulo alto de comemoração! O Sapinho Sapeca aprovou sua Letra S!"
	},
	T: {
		letter: "T",
		animalName: "Tartaruga Tatá",
		species: "Tartaruga",
		emoji: "🐢",
		image: mascot_d_default,
		tone: "bg-mint",
		badgeBg: "from-teal-500 to-emerald-700",
		pawDescription: "Indicador dobrado com o polegar por DENTRO dele (polegar escondido) e 3 dedos eretos.",
		librasExplanation: "A Tartaruga Tatá esconde o polegar por DENTRO do indicador como em seu casco para a Letra T!",
		cheerMessage: "Passo firme e campeão! A Tartaruga Tatá comemora sua Letra T!"
	},
	U: {
		letter: "U",
		animalName: "Ursinho Uli",
		species: "Urso",
		emoji: "🐻",
		image: mascot_a_default,
		tone: "bg-sunshine",
		badgeBg: "from-amber-600 to-yellow-700",
		pawDescription: "Indicador e médio estendidos e bem UNIDOS para cima.",
		librasExplanation: "O Ursinho Uli estica 2 dedinhos bem coladinhos para cima para a Letra U!",
		cheerMessage: "Abraço de urso carinhoso! O Ursinho Uli adorou sua Letra U!"
	},
	V: {
		letter: "V",
		animalName: "Vaquinha Vivi",
		species: "Vaca",
		emoji: "🐮",
		image: mascot_b_default,
		tone: "bg-coral",
		badgeBg: "from-rose-500 to-pink-700",
		pawDescription: "Indicador e médio estendidos e AFASTADOS formando a letra 'V' da paz.",
		librasExplanation: "A Vaquinha Vivi afasta os dois dedinhos em 'V' como seus chifrinhos para a Letra V!",
		cheerMessage: "Mu-muito bem! A Vaquinha Vivi festeja sua Letra V!"
	},
	W: {
		letter: "W",
		animalName: "Wombat Wally",
		species: "Wombat",
		emoji: "🦡",
		image: mascot_e_default,
		tone: "bg-grape",
		badgeBg: "from-purple-500 to-indigo-700",
		pawDescription: "Três dedos (indicador, médio e anelar) estendidos para CIMA e afastados.",
		librasExplanation: "O Wombat Wally levanta 3 dedinhos abertos para o alto para a Letra W!",
		cheerMessage: "Super divertido! O Wombat Wally manda parabéns pela Letra W!"
	},
	X: {
		letter: "X",
		animalName: "Pássaro Xexéu",
		species: "Pássaro",
		emoji: "🦜",
		image: mascot_c_default,
		tone: "bg-sky",
		badgeBg: "from-cyan-500 to-blue-600",
		pawDescription: "Indicador em gancho puxando suavemente para trás em direção ao corpo.",
		librasExplanation: "O Pássaro Xexéu curva o dedinho como bico e puxa para trás para a Letra X!",
		cheerMessage: "Canto de festa! O Pássaro Xexéu comemora sua Letra X em LIBRAS!"
	},
	Y: {
		letter: "Y",
		animalName: "Yak Yoyo",
		species: "Yak",
		emoji: "🦬",
		image: mascot_a_default,
		tone: "bg-sunshine",
		badgeBg: "from-yellow-500 to-orange-600",
		pawDescription: "Polegar e mínimo estendidos para os lados (Hang Loose) balançando suavemente.",
		librasExplanation: "O Yak Yoyo abre o dedão e o mindinho para os lados para a Letra Y!",
		cheerMessage: "Hang loose campeão! O Yak Yoyo amou sua Letra Y!"
	},
	Z: {
		letter: "Z",
		animalName: "Zebrinha Zazá",
		species: "Zebra",
		emoji: "🦓",
		image: mascot_d_default,
		tone: "bg-grape",
		badgeBg: "from-slate-700 to-slate-900",
		pawDescription: "Indicador estendido desenhando um 'Z' em zigue-zague no ar.",
		librasExplanation: "A Zebrinha Zazá usa o dedinho indicador para desenhar as listras do 'Z' no ar!",
		cheerMessage: "Listras douradas de ouro! A Zebrinha Zazá fecha com chave de ouro sua Letra Z!"
	}
};
function getAnimalMascot(letter) {
	return ANIMAL_MASCOTS[(letter || "A").toUpperCase().trim().charAt(0)] || ANIMAL_MASCOTS["A"];
}
/**
* CURRÍCULO 100% ALFABETO EM LIBRAS:
* Cada lição ensina exatamente 3 letras por vez com os bichinhos mascotes,
* usando as imagens/vídeos oficiais como exemplo de referência!
*/
/** Função utilitária para embaralhar alternativas de resposta */
function shuffleArray(array) {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
function LessonPage() {
	const navigate = useNavigate();
	const nodeId = Route$5.useSearch().nodeId || 1;
	const currentLesson = LESSONS_DATA[nodeId] || LESSONS_DATA[1];
	const colors = currentLesson.colors;
	const [isValidating, setIsValidating] = (0, import_react.useState)(true);
	const [authorizedUser, setAuthorizedUser] = (0, import_react.useState)(null);
	const [lives, setLives] = (0, import_react.useState)(getMaxLives());
	const [step, setStep] = (0, import_react.useState)(0);
	const [mirrorScore, setMirrorScore] = (0, import_react.useState)(null);
	const [isAlphabetModalOpen, setIsAlphabetModalOpen] = (0, import_react.useState)(false);
	const [modalLetter, setModalLetter] = (0, import_react.useState)("A");
	const total = 5;
	(0, import_react.useEffect)(() => {
		setStep(0);
		setMirrorScore(null);
	}, [nodeId]);
	(0, import_react.useEffect)(() => {
		const user = getActiveUser();
		if (!user) {
			toast.error("🔒 Faça login como Aluno para acessar as lições de LIBRAS.");
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (user.role === "professor") {
			toast.info("🔒 Professores não realizam lições diretas de alunos. Redirecionando para o Painel.");
			navigate({
				to: "/onboarding",
				replace: true
			});
			return;
		}
		setAuthorizedUser(user);
		const { lives: regenLives } = regenerateLives(user);
		setLives(regenLives);
		setIsValidating(false);
	}, [navigate]);
	const openAlphabetGuide = (letter) => {
		if (letter) setModalLetter(letter);
		setIsAlphabetModalOpen(true);
		soundFx.playPop();
	};
	const next = () => {
		soundFx.playPop();
		const nextStep = Math.min(step + 1, total);
		setStep(nextStep);
		if (nextStep === total && authorizedUser) {
			const scoreVal = mirrorScore ? Math.round((mirrorScore.accuracy + mirrorScore.orientationScore + mirrorScore.stabilityScore) / 9 * 100) : 90;
			const lessonId = `trail_node_${nodeId}`;
			const existingLessons = authorizedUser.completedLessons ?? [];
			const alreadyDone = existingLessons.some((l) => l.id === lessonId);
			const { streak: newStreak, lastStreakDate: newStreakDate } = computeNewStreak(authorizedUser.streak ?? 0, authorizedUser.lastStreakDate);
			const nextCompletedLessons = alreadyDone ? existingLessons : [...existingLessons, {
				id: lessonId,
				title: currentLesson.title,
				score: scoreVal,
				completedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
			}];
			const nextXp = (authorizedUser.xp ?? 0) + (alreadyDone ? 5 : 25);
			const updated = saveUser({
				...authorizedUser,
				completedLessons: nextCompletedLessons,
				xp: nextXp,
				streak: newStreak,
				lastStreakDate: newStreakDate,
				lives
			});
			setAuthorizedUser(updated);
		}
	};
	const restart = () => {
		setMirrorScore(null);
		setStep(0);
	};
	const handleNextLesson = () => {
		const nextId = nodeId + 1;
		if (nextId <= 24) {
			navigate({
				to: "/licao",
				search: { nodeId: nextId }
			});
			soundFx.playChime();
		}
	};
	if (isValidating || !authorizedUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-sm font-extrabold text-muted-foreground",
				children: "Carregando lição dos mascotes..."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-hero shadow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
				step,
				total,
				title: currentLesson.title,
				nodeId,
				lives,
				onExit: restart,
				onOpenAlphabet: () => openAlphabetGuide(colors[0]?.targetLetter || "A")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-4 py-6 sm:px-7 sm:py-10",
				children: [
					step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenIntro, {
						lesson: currentLesson,
						onNext: next,
						onOpenAlphabet: openAlphabetGuide
					}),
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenTeach, {
						lesson: currentLesson,
						onNext: next,
						onOpenAlphabet: openAlphabetGuide
					}),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenQuiz, {
						target: colors[0],
						colors,
						onNext: next,
						onWrongAnswer: () => {
							if (authorizedUser) {
								const newLives = loseLife(authorizedUser.id);
								setLives(newLives);
							}
						}
					}),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBubble, {
						target: colors[1] || colors[0],
						colors,
						onNext: next,
						onWrongAnswer: () => {
							if (authorizedUser) {
								const newLives = loseLife(authorizedUser.id);
								setLives(newLives);
							}
						}
					}),
					step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenMirror, {
						target: colors[0],
						colors,
						onNext: (score) => {
							setMirrorScore(score);
							next();
						}
					}),
					step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenReward, {
						nodeId,
						score: mirrorScore,
						onRestart: restart,
						onNextLesson: handleNextLesson
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlphabetReferenceModal, {
				isOpen: isAlphabetModalOpen,
				onClose: () => setIsAlphabetModalOpen(false),
				initialLetter: modalLetter
			})
		]
	});
}
function TopBar({ step, total, title, nodeId, lives, onExit, onOpenAlphabet }) {
	const pct = step / total * 100;
	const worldLabel = nodeId >= 13 ? `Mundo 2 (Fase ${nodeId})` : `Mundo 1 (Fase ${nodeId})`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/trilha",
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-border bg-card text-lg font-bold transition-transform hover:scale-105",
					"aria-label": "Sair da Lição",
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-xs font-extrabold mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary truncate max-w-[180px] sm:max-w-none",
							children: [
								worldLabel,
								" · ",
								title
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground shrink-0",
							children: [
								step,
								"/",
								total
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-3 overflow-hidden rounded-full bg-muted shadow-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-gradient-rainbow transition-all duration-500",
							style: { width: `${pct}%` }
						})
					})]
				}),
				onOpenAlphabet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onOpenAlphabet,
					className: "flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20 shadow-xs",
					title: "Abrir Exemplo de Referência do Alfabeto Oficial",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Exemplo A-Z"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-soft shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg",
						children: "❤️"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-extrabold",
						children: lives
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					className: "hidden text-xs font-bold text-muted-foreground hover:text-foreground md:block",
					children: "Reiniciar"
				})
			]
		})
	});
}
function ScreenShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "animate-pop rounded-4xl bg-card p-6 shadow-chunky md:p-10 border border-border/50",
		children
	});
}
function ScreenIntro({ lesson, onNext, onOpenAlphabet }) {
	const worldBadge = lesson.id >= 13 ? `Mundo 2: Trilha dos Bichinhos Aventureiros · Fase ${lesson.id} de 24` : `Mundo 1: Alfabeto dos Bichinhos · Fase ${lesson.id} de 12`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
				children: worldBadge
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-3xl font-extrabold md:text-5xl",
				children: lesson.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground font-bold",
				children: lesson.subtitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto my-5 flex max-w-lg items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-left text-xs text-amber-900 dark:text-amber-200 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-3xl shrink-0",
					children: "🐾"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-extrabold block text-amber-950 dark:text-amber-100 text-sm",
						children: "3 Letras nesta Lição com os Bichinhos!"
					}),
					"Nesta lição você aprenderá ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3 letras do alfabeto em LIBRAS" }),
					". Os bichinhos mostram o sinal nos exercícios e você pode consultar as imagens reais como exemplo de apoio!"
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl",
				children: lesson.colors.map((c) => {
					const mascot = getAnimalMascot(c.targetLetter);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenAlphabet?.(c.targetLetter),
						className: `group cursor-pointer rounded-3xl ${mascot.tone} p-4 text-center shadow-chunky transition-transform hover:scale-105 border-2 border-border/40`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mx-auto h-24 w-24 overflow-hidden rounded-2xl border-2 border-black/20 bg-black/10 shadow-inner",
								children: [mascot.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: mascot.image,
									alt: mascot.animalName,
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-full w-full items-center justify-center text-4xl",
									children: mascot.emoji
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-1 right-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-black text-white",
									children: c.targetLetter
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-sm font-black text-slate-900",
								children: mascot.animalName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] font-extrabold text-slate-800/80",
								children: ["Ensinando: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Letra ", c.targetLetter] })]
							})
						]
					}, c.targetLetter);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onNext,
				className: "rounded-full bg-primary px-10 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▶ Começar Exercícios com os Bichinhos" })
			})
		]
	}) });
}
function ScreenTeach({ lesson, onNext, onOpenAlphabet }) {
	const [i, setI] = (0, import_react.useState)(0);
	const [activeAngleView, setActiveAngleView] = (0, import_react.useState)("primary");
	const colors = lesson.colors;
	const c = colors[i] || colors[0];
	const mascot = getAnimalMascot(c.targetLetter);
	const ref = getAlphabetReference(c.targetLetter);
	const advance = () => {
		setActiveAngleView("primary");
		if (i < colors.length - 1) setI(i + 1);
		else onNext();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-black uppercase tracking-wider text-primary",
					children: "Passo 1: Apresentação da Letra com o Mascote"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground",
					children: [
						"Letra ",
						i + 1,
						" de ",
						colors.length,
						" (",
						c.targetLetter,
						")"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-2 font-display text-2xl font-extrabold sm:text-3xl",
				children: [
					"Como fazer a ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-primary",
						children: ["Letra ", c.targetLetter]
					}),
					" em LIBRAS"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden rounded-3xl bg-muted border-2 border-border p-5 shadow-inner text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-6 flex flex-col items-center justify-center text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl ${mascot.tone} border-4 border-primary/40 shadow-chunky p-2 flex flex-col items-center justify-center`,
						children: [mascot.letter === "A" || mascot.letter === "B" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: mascot.image,
							alt: `${mascot.animalName} fazendo o sinal ${c.targetLetter}`,
							className: "h-full w-full object-cover rounded-2xl"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full w-full flex-col items-center justify-between py-2 bg-card/40 rounded-2xl p-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-4xl animate-bounce-soft",
										children: mascot.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display font-black text-lg text-slate-900",
										children: mascot.animalName
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-black/20 bg-black/10 shadow-sm",
									children: ref.mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										src: ref.primaryMedia,
										autoPlay: true,
										loop: true,
										muted: true,
										playsInline: true,
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: ref.primaryMedia,
										alt: `Sinal da mão da Letra ${c.targetLetter}`,
										className: "h-full w-full object-cover"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-black text-slate-800 uppercase tracking-wider",
									children: "Patinha em LIBRAS ✋"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-3 right-3 rounded-full bg-black/85 px-3 py-1 text-xs font-black text-white shadow-sm border border-white/20",
							children: ["Letra ", c.targetLetter]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1 text-xs font-black shadow-xs border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mascot.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mascot.animalName })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs font-extrabold text-primary",
							children: [
								"\"",
								mascot.librasExplanation,
								"\""
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-6 flex flex-col justify-between space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-3 border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-black uppercase text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-amber-500" }), "Exemplo Visual Oficial de Apoio:"]
								}), ref.secondaryMedia && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveAngleView("primary"),
										className: `rounded-md px-2 py-0.5 text-[9px] font-extrabold ${activeAngleView === "primary" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`,
										children: "Frente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveAngleView("secondary"),
										className: `rounded-md px-2 py-0.5 text-[9px] font-extrabold ${activeAngleView === "secondary" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`,
										children: "Lado"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-black/20 bg-black",
									children: ref.mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										src: ref.primaryMedia,
										autoPlay: true,
										loop: true,
										muted: true,
										playsInline: true,
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: activeAngleView === "secondary" && ref.secondaryMedia ? ref.secondaryMedia : ref.primaryMedia,
										alt: `Exemplo oficial Letra ${c.targetLetter}`,
										className: "h-full w-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground leading-snug",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground block",
										children: ref.orientationDescription
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ref.pedagogicalTip })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-2xl bg-card p-3 border border-border text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-primary block font-black mb-1",
								children: "🐾 Como Fazer com a Mãozinha:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground font-medium leading-relaxed",
								children: c.signTip
							})]
						}),
						ref.movementInstructions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 rounded-2xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block font-bold",
								children: "✨ Movimento no Ar:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ref.movementInstructions })]
						})
					] }), onOpenAlphabet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onOpenAlphabet(c.targetLetter),
						className: "text-left text-xs font-bold text-primary hover:underline flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Ver detalhes da Letra ",
							c.targetLetter,
							" no Guia Oficial"
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap justify-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: advance,
					className: "rounded-full bg-foreground px-10 py-4 font-display text-lg font-extrabold text-background transition-transform hover:-translate-y-1 shadow-chunky active:scale-95",
					children: i < colors.length - 1 ? "Próxima Letra da Lição →" : "Entendi, vamos aos Exercícios! ✓"
				})
			})
		]
	}) });
}
function ScreenQuiz({ target, colors, onNext, onWrongAnswer }) {
	const [choice, setChoice] = (0, import_react.useState)(null);
	const correct = choice === target.targetLetter;
	const targetMascot = getAnimalMascot(target.targetLetter);
	const shuffledColors = (0, import_react.useMemo)(() => shuffleArray(colors), [colors]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
				children: "Passo 2: Desafio Visual de LIBRAS 🐾"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-3 font-display text-2xl sm:text-3xl font-extrabold",
				children: [
					"Qual bichinho está fazendo a ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-xl bg-accent px-3 py-1",
						children: ["Letra ", target.targetLetter]
					}),
					" com a mãozinha?"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground font-bold",
				children: "Observe com atenção a mão de cada bichinho e selecione o sinal correto!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: shuffledColors.map((c) => {
					const isSel = choice === c.targetLetter;
					const isRight = isSel && c.targetLetter === target.targetLetter;
					const isWrong = isSel && c.targetLetter !== target.targetLetter;
					const mascot = getAnimalMascot(c.targetLetter);
					const ref = getAlphabetReference(c.targetLetter);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							if (!choice) {
								setChoice(c.targetLetter);
								if (c.targetLetter === target.targetLetter) soundFx.playChime();
								else {
									soundFx.playPop();
									onWrongAnswer?.();
								}
							}
						},
						className: `group relative flex flex-col items-center justify-center p-4 rounded-3xl border-4 ${mascot.tone} transition-all ${isRight ? "border-mint bg-mint/30 animate-pop scale-105 shadow-chunky ring-4 ring-mint/40" : isWrong ? "border-destructive bg-destructive/10 opacity-75" : "border-transparent hover:border-primary hover:-translate-y-1 shadow-soft"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-black/20 bg-card/70 shadow-sm flex flex-col items-center justify-center p-1",
								children: [mascot.letter === "A" || mascot.letter === "B" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: mascot.image,
									alt: mascot.animalName,
									className: "h-full w-full object-cover rounded-xl"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-full w-full flex-col items-center justify-between py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl animate-bounce-soft",
										children: mascot.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative h-14 w-14 overflow-hidden rounded-xl border border-black/20 bg-black/5",
										children: ref.mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
											src: ref.primaryMedia,
											autoPlay: true,
											loop: true,
											muted: true,
											playsInline: true,
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: ref.primaryMedia,
											alt: "Sinal da mão",
											className: "h-full w-full object-cover"
										})
									})]
								}), choice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `absolute top-1 right-1 rounded-md px-1.5 py-0.5 text-xs font-black text-white shadow-sm ${c.targetLetter === target.targetLetter ? "bg-mint text-slate-950" : "bg-black/80"}`,
									children: c.targetLetter
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 font-display text-base font-black text-slate-900",
								children: mascot.animalName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 text-[11px] font-extrabold text-slate-800/80",
								children: choice ? `Fez a Letra ${c.targetLetter}` : "Observe o sinal da mão ✋"
							})
						]
					}, c.targetLetter);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 min-h-[70px]",
				children: [correct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pop rounded-2xl bg-mint/30 p-4 border border-mint/40 text-emerald-950 dark:text-emerald-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-extrabold",
						children: "Excelente! 🎉"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold",
						children: [
							targetMascot.cheerMessage,
							" (",
							target.signTip,
							")"
						]
					})]
				}), choice && !correct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pop rounded-2xl bg-destructive/10 p-4 border border-destructive/20 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-extrabold",
						children: "Quase lá! 👀"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold",
						children: [
							"O sinal que você escolheu foi a ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Letra ", choice] }),
							". A ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Letra ", target.targetLetter] }),
							" é feita pelo(a) ",
							targetMascot.animalName,
							" (",
							target.signTip,
							")!"
						]
					})]
				})]
			}),
			choice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onNext,
				className: "rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105",
				children: "Continuar para o Jogo das Bolhas 🫧 →"
			})
		]
	}) });
}
function ScreenBubble({ target, colors, onNext, onWrongAnswer }) {
	const [popped, setPopped] = (0, import_react.useState)(null);
	const targetMascot = getAnimalMascot(target.targetLetter);
	const shuffledColors = (0, import_react.useMemo)(() => shuffleArray(colors), [colors]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
				children: "Passo 3: Jogo das Bolhas dos Mascotes 🫧"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-3 font-display text-2xl sm:text-3xl font-extrabold",
				children: [
					"Estoure a bolha com a mãozinha da ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-xl bg-accent px-3 py-1",
						children: ["Letra ", target.targetLetter]
					}),
					"!"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground font-bold",
				children: "Observe a mão de cada bichinho nas bolhas flutuantes!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mt-8 grid h-76 place-items-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky/30 to-mint/20 border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end justify-around gap-4 sm:gap-6 drop-shadow-xl/25 px-4",
					children: shuffledColors.map((c, i) => {
						const isPopped = popped === c.targetLetter;
						const isRight = isPopped && c.targetLetter === target.targetLetter;
						const mascot = getAnimalMascot(c.targetLetter);
						const ref = getAlphabetReference(c.targetLetter);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								if (!popped) {
									setPopped(c.targetLetter);
									if (c.targetLetter === target.targetLetter) soundFx.playChime();
									else {
										soundFx.playPop();
										onWrongAnswer?.();
									}
								}
							},
							disabled: !!popped,
							style: { animationDelay: `${i * .4}s` },
							className: `animate-float rounded-3xl ${mascot.tone} p-3 shadow-chunky transition-all ${isPopped ? isRight ? "scale-125 opacity-30 ring-4 ring-mint" : "scale-75 opacity-40" : "hover:scale-110"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-2xl border border-black/20 bg-card/70 p-1 flex flex-col items-center justify-center",
									children: [mascot.letter === "A" || mascot.letter === "B" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: mascot.image,
										alt: mascot.animalName,
										className: "h-full w-full object-cover rounded-xl"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-full w-full flex-col items-center justify-between py-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl animate-bounce-soft",
											children: mascot.emoji
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative h-12 w-12 overflow-hidden rounded-lg border border-black/20 bg-black/5",
											children: ref.mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
												src: ref.primaryMedia,
												autoPlay: true,
												loop: true,
												muted: true,
												playsInline: true,
												className: "h-full w-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: ref.primaryMedia,
												alt: "Mãozinha",
												className: "h-full w-full object-cover"
											})
										})]
									}), popped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-1 right-1 rounded-md bg-black/80 px-1.5 py-0.2 text-[10px] font-black text-white shadow-sm",
										children: c.targetLetter
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 font-display text-xs font-black text-slate-900",
									children: mascot.animalName
								})]
							})
						}, c.targetLetter);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 min-h-[60px]",
				children: [popped && popped === target.targetLetter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pop font-display text-2xl font-extrabold text-mint",
					children: [
						"POW! Bolha com a Letra ",
						target.targetLetter,
						" estourada com sucesso! 🎯"
					]
				}), popped && popped !== target.targetLetter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pop text-lg font-bold text-destructive",
					children: [
						"Ops! Essa bolha tinha o sinal da Letra ",
						popped,
						". A bolha da Letra ",
						target.targetLetter,
						" era do(a) ",
						targetMascot.animalName,
						"!"
					]
				})]
			}),
			popped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onNext,
				className: "rounded-full bg-primary px-12 py-5 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105",
				children: "Próximo desafio: Espelho com IA 🪞 →"
			})
		]
	}) });
}
function ScreenMirror({ target, colors, onNext }) {
	const [selectedColor, setSelectedColor] = (0, import_react.useState)(target);
	const mascot = getAnimalMascot(selectedColor.targetLetter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-extrabold uppercase tracking-[0.2em] text-primary",
				children: "Passo 4: 🪞 Desafio do Espelho com IA & Mascote"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-3 font-display text-2xl sm:text-3xl font-extrabold",
				children: [
					"Faça a ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-primary",
						children: ["Letra ", selectedColor.targetLetter]
					}),
					" na Câmera!"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground font-bold",
				children: [mascot.animalName, " está pronto para torcer por você na câmera!"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-5 flex flex-wrap justify-center gap-2",
				children: colors.map((c) => {
					const m = getAnimalMascot(c.targetLetter);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setSelectedColor(c);
							soundFx.playPop();
						},
						className: `flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${selectedColor.targetLetter === c.targetLetter ? "bg-primary text-primary-foreground shadow-sm scale-105" : "bg-muted text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							m.animalName,
							" (Letra ",
							c.targetLetter,
							")"
						] })]
					}, c.targetLetter);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibrasLessonMirror, {
				targetLetter: selectedColor.targetLetter,
				targetLabel: `Letra ${selectedColor.targetLetter}`,
				targetDescription: selectedColor.signTip,
				onComplete: onNext,
				onSkip: () => {
					onNext({
						accuracy: 3,
						orientationScore: 3,
						stabilityScore: 2,
						detectedLetter: selectedColor.targetLetter
					});
				}
			})
		]
	}) });
}
function ScreenReward({ nodeId, score, onRestart, onNextLesson }) {
	const nextNodeId = nodeId + 1;
	const hasNextLesson = nextNodeId <= 24;
	const nextLessonData = LESSONS_DATA[nextNodeId];
	const isWorld2 = nodeId >= 13;
	const currentLessonData = LESSONS_DATA[nodeId] || LESSONS_DATA[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: luvi_mascot_default,
					alt: "Luvi e bichinhos celebrando",
					width: 1024,
					height: 1024,
					className: "mx-auto w-52 animate-bounce-soft drop-shadow-xl/25"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-rainbow opacity-30 blur-3xl" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl sm:text-4xl font-extrabold",
				children: isWorld2 ? `Fase ${nodeId} do Mundo 2 Concluída! 🎉` : `Fase ${nodeId} Concluída! 🎉`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-muted-foreground font-bold",
				children: [
					"Parabéns! Você aprendeu e validou ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: currentLessonData.title }),
					" em LIBRAS com os mascotes!"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto my-5 flex justify-center gap-3",
				children: currentLessonData.colors.map((c) => {
					const m = getAnimalMascot(c.targetLetter);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-2 rounded-2xl ${m.tone} px-3.5 py-1.5 shadow-sm border border-black/10`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: m.emoji
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-xs font-black text-slate-900",
							children: [
								"Letra ",
								c.targetLetter,
								" ✓"
							]
						})]
					}, c.targetLetter);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-4 grid max-w-md grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card p-3 shadow-soft border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-extrabold uppercase text-muted-foreground",
							children: "Config. Mão"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-lg",
							children: "⭐".repeat(score?.accuracy || 3)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card p-3 shadow-soft border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-extrabold uppercase text-muted-foreground",
							children: "Orientação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-lg",
							children: "⭐".repeat(score?.orientationScore || 3)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card p-3 shadow-soft border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-extrabold uppercase text-muted-foreground",
							children: "Estabilidade"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-lg",
							children: "⭐".repeat(score?.stabilityScore || 3)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-4 grid max-w-md grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RewardCard, {
						icon: "⭐",
						label: "+25 XP",
						tone: "bg-sunshine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RewardCard, {
						icon: "🌟",
						label: "+3 Estrelas",
						tone: "bg-mint"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RewardCard, {
						icon: "🔥",
						label: "Streak +1",
						tone: "bg-coral text-white"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col items-center gap-3",
				children: [hasNextLesson ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onNextLesson,
					className: "w-full max-w-md rounded-full bg-primary px-8 py-5 font-display text-lg sm:text-xl font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-bounce-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["▶ Próxima Fase: ", nextLessonData?.title || `Fase ${nextNodeId}`] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl",
						children: "→"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-md rounded-2xl bg-mint/30 border border-mint p-4 text-emerald-900 dark:text-emerald-200 font-display font-black text-center shadow-soft",
					children: "🏆 Parabéns! Você concluiu todas as 24 lições do Alfabeto em LIBRAS com os Mascotes!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-3 w-full max-w-md mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onRestart,
						className: "flex-1 rounded-full border-2 border-foreground/20 bg-card px-6 py-4 font-display font-extrabold shadow-soft hover:bg-muted",
						children: "🔄 Repetir lição"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/trilha",
						className: "flex-1 rounded-full border-2 border-primary/40 bg-card px-6 py-4 font-display font-extrabold text-primary text-center shadow-soft hover:bg-primary/10",
						children: "🗺️ Ver Trilha"
					})]
				})]
			})
		]
	}) });
}
function RewardCard({ icon, label, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `animate-pop rounded-2xl ${tone} p-4 shadow-soft`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-3xl",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-sm font-extrabold",
			children: label
		})]
	});
}
//#endregion
export { LessonPage as component };
