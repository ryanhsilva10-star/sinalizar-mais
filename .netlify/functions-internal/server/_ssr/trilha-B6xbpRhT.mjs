import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as saveUser, S as logoutUser, T as regenerateLives, d as getActiveUser, n as Route$2, w as onUserChange, x as loginUser } from "./router-Bs2xLfcW.mjs";
import { t as luvi_mascot_default } from "./luvi-mascot-oOSQQfKg.mjs";
import { M as BookOpen } from "../_libs/lucide-react.mjs";
import { i as soundFx, n as AlphabetReferenceModal } from "./AlphabetReferenceModal-BOLiu9qt.mjs";
import { n as TurmaClaNavbarButton, t as JoinClassroomFab } from "./TurmaClaNavbarButton-BI1qPLkQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trilha-B6xbpRhT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var trail_adventure_bg_default = "/assets/trail-adventure-bg-BqYnpcDY.jpg";
var map_character_default = "/assets/map-character-JWShx8bL.jpg";
var MAP_HINTS = [
	"Olá explorador! Clique em uma lição para aprender novos sinais em LIBRAS! 👋",
	"Você está muito perto do Chefe da Ilha das Cores! 🌈",
	"Dica do Mapa: pratique em frente ao espelho com o Desafio de IA! 🪞",
	"Sabia que cada sinal que você aprende fortalece sua ofensiva de XP? ⭐",
	"Cruze a ponte mágica e siga o rio para chegar ao Castelo do Saber! 🏰"
];
function ParallaxTrailMap({ nodes, selectedNode, onSelectNode, timeOfDay = "day" }) {
	const containerRef = (0, import_react.useRef)(null);
	const [mousePos, setMousePos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [targetPos, setTargetPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isHovering, setIsHovering] = (0, import_react.useState)(false);
	const [hintIndex, setHintIndex] = (0, import_react.useState)(0);
	const [mascotBubbleOpen, setMascotBubbleOpen] = (0, import_react.useState)(true);
	const [mascotJumping, setMascotJumping] = (0, import_react.useState)(false);
	const [activeRipples, setActiveRipples] = (0, import_react.useState)([]);
	const [castleShimmer, setCastleShimmer] = (0, import_react.useState)(false);
	const [bridgeBouncing, setBridgeBouncing] = (0, import_react.useState)(false);
	const [parallaxIntensity, setParallaxIntensity] = (0, import_react.useState)("normal");
	(0, import_react.useEffect)(() => {
		if (parallaxIntensity === "off") {
			setMousePos({
				x: 0,
				y: 0
			});
			return;
		}
		let animationFrameId;
		const lerp = () => {
			setMousePos((prev) => ({
				x: prev.x + (targetPos.x - prev.x) * .08,
				y: prev.y + (targetPos.y - prev.y) * .08
			}));
			animationFrameId = requestAnimationFrame(lerp);
		};
		animationFrameId = requestAnimationFrame(lerp);
		return () => cancelAnimationFrame(animationFrameId);
	}, [targetPos, parallaxIntensity]);
	const handlePointerMove = (0, import_react.useCallback)((e) => {
		if (parallaxIntensity === "off") return;
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width - .5) * 2;
		const y = ((e.clientY - rect.top) / rect.height - .5) * 2;
		const mult = parallaxIntensity === "high" ? 1.5 : 1;
		setTargetPos({
			x: x * mult,
			y: y * mult
		});
	}, [parallaxIntensity]);
	const handlePointerLeave = (0, import_react.useCallback)(() => {
		setIsHovering(false);
		setTargetPos({
			x: 0,
			y: 0
		});
	}, []);
	const handleMascotClick = () => {
		soundFx.playWobble();
		setMascotJumping(true);
		setHintIndex((prev) => (prev + 1) % MAP_HINTS.length);
		setMascotBubbleOpen(true);
		setTimeout(() => setMascotJumping(false), 600);
	};
	const handleRiverClick = (e) => {
		soundFx.playSplash();
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width * 100;
		const y = (e.clientY - rect.top) / rect.height * 100;
		const newRipple = {
			id: Date.now() + Math.random(),
			x,
			y
		};
		setActiveRipples((prev) => [...prev.slice(-4), newRipple]);
		setTimeout(() => {
			setActiveRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
		}, 1200);
	};
	const handleCastleClick = () => {
		soundFx.playChime();
		setCastleShimmer(true);
		setTimeout(() => setCastleShimmer(false), 1500);
	};
	const handleBridgeClick = () => {
		soundFx.playPop();
		setBridgeBouncing(true);
		setTimeout(() => setBridgeBouncing(false), 500);
	};
	const pxSkyX = mousePos.x * 6;
	const pxSkyY = mousePos.y * 4;
	const pxBgX = mousePos.x * 12;
	const pxBgY = mousePos.y * 8;
	const pxElementsX = mousePos.x * 18;
	const pxElementsY = mousePos.y * 12;
	const pxForegroundX = mousePos.x * 24;
	const pxForegroundY = mousePos.y * 16;
	(0, import_react.useMemo)(() => {
		return nodes.find((n) => n.state === "current") || nodes[0];
	}, [nodes]);
	const pathD = (0, import_react.useMemo)(() => {
		if (nodes.length === 0) return "";
		let d = `M ${nodes[0].x} ${nodes[0].y}`;
		for (let i = 1; i < nodes.length; i++) {
			const prev = nodes[i - 1];
			const curr = nodes[i];
			const cx1 = (prev.x + curr.x) / 2;
			const cy1 = prev.y;
			const cx2 = (prev.x + curr.x) / 2;
			const cy2 = curr.y;
			d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
		}
		return d;
	}, [nodes]);
	const atmosphereOverlay = (0, import_react.useMemo)(() => {
		switch (timeOfDay) {
			case "sunset": return "bg-gradient-to-t from-amber-600/25 via-purple-600/20 to-orange-500/30 mix-blend-color-burn";
			case "night": return "bg-gradient-to-b from-indigo-950/70 via-blue-950/50 to-slate-900/60 mix-blend-multiply";
			default: return "bg-transparent";
		}
	}, [timeOfDay]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full overflow-hidden rounded-3xl border-4 border-amber-300/80 bg-sky-200 shadow-2xl transition-all duration-700",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-4 top-4 z-30 flex items-center gap-2 rounded-2xl bg-card/90 px-3 py-1.5 shadow-md backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden text-xs font-extrabold text-muted-foreground sm:inline",
					children: "Modo 3D:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setParallaxIntensity(parallaxIntensity === "normal" ? "high" : parallaxIntensity === "high" ? "off" : "normal");
						soundFx.playPop();
					},
					className: "flex items-center gap-1 rounded-xl bg-muted px-2.5 py-1 text-xs font-extrabold text-foreground transition-all hover:scale-105",
					title: "Alternar intensidade do efeito Parallax 3D",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🧭" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parallaxIntensity === "high" ? "Super Parallax" : parallaxIntensity === "normal" ? "Parallax Ativo" : "Estático" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: containerRef,
				onPointerMove: handlePointerMove,
				onPointerEnter: () => setIsHovering(true),
				onPointerLeave: handlePointerLeave,
				className: "relative aspect-[16/9] min-h-[480px] w-full cursor-crosshair select-none overflow-hidden sm:min-h-[620px] md:min-h-[720px]",
				style: { perspective: "1200px" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-[-5%] transition-transform duration-100 ease-out",
						style: { transform: `translate3d(${-pxSkyX}px, ${-pxSkyY}px, 0) scale(1.08)` },
						children: [
							timeOfDay === "night" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-[28%] top-[12%] h-16 w-16 animate-pulse rounded-full bg-amber-100 shadow-[0_0_50px_rgba(254,240,138,0.8)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-1 right-2 text-2xl",
									children: "✨"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute right-[28%] top-[12%] h-20 w-20 rounded-full ${timeOfDay === "sunset" ? "bg-gradient-to-tr from-orange-500 to-amber-300 shadow-[0_0_60px_rgba(249,115,22,0.9)]" : "bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_70px_rgba(253,224,71,0.9)]"} animate-bounce-soft` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-[8%] top-[16%] animate-[float_8s_ease-in-out_infinite] opacity-90",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSvg, {
									width: 110,
									height: 60,
									opacity: .95
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-[38%] top-[8%] animate-[float_11s_ease-in-out_infinite_1s] opacity-80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSvg, {
									width: 140,
									height: 75,
									opacity: .9
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-[8%] top-[18%] animate-[float_9s_ease-in-out_infinite_2s] opacity-95",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSvg, {
									width: 120,
									height: 65,
									opacity: .95
								})
							}),
							timeOfDay === "night" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute left-[15%] top-[10%] animate-ping text-yellow-200",
										children: "✦"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute left-[25%] top-[25%] animate-pulse text-yellow-100",
										children: "✧"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute left-[50%] top-[12%] animate-pulse text-yellow-300",
										children: "★"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-[20%] top-[8%] animate-ping text-yellow-200",
										children: "✦"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-[40%] top-[22%] animate-pulse text-amber-200",
										children: "✧"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-[-4%] transition-transform duration-75 ease-out",
						style: {
							transform: `translate3d(${-pxBgX}px, ${-pxBgY}px, 0) scale(1.06) rotateX(${-mousePos.y * 2}deg) rotateY(${mousePos.x * 2.5}deg)`,
							transformOrigin: "center center"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: trail_adventure_bg_default,
								alt: "Mapa de aventura da Trilha de LIBRAS",
								className: "h-full w-full object-cover object-center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: handleCastleClick,
								className: `absolute right-[7%] top-[8%] h-[28%] w-[24%] cursor-pointer rounded-3xl transition-transform duration-300 hover:scale-105 ${castleShimmer ? "animate-wiggle" : ""}`,
								title: "Castelo do Saber! Clique para ver a magia!",
								children: castleShimmer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 flex items-center justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "animate-ping text-5xl",
										children: "✨"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -top-4 text-3xl animate-bounce",
										children: "🏰🌟"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: handleBridgeClick,
								className: `absolute bottom-[16%] left-[8%] h-[20%] w-[32%] cursor-pointer rounded-2xl transition-transform ${bridgeBouncing ? "-translate-y-2 scale-105" : "hover:brightness-110"}`,
								title: "Ponte dos Primeiros Sinais! Clique para testar a madeira.",
								children: bridgeBouncing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 font-display text-xs font-black text-white shadow-md animate-pop",
									children: "TOC TOC! 🪵"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: handleRiverClick,
								className: "absolute bottom-[2%] left-[42%] top-[38%] w-[48%] cursor-pointer",
								title: "Rio dos Sinais! Clique na água para criar ondulações.",
								children: activeRipples.map((ripple) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-4 border-cyan-200 bg-cyan-400/30",
									style: {
										left: `${ripple.x}%`,
										top: `${ripple.y}%`,
										width: "70px",
										height: "40px"
									}
								}, ripple.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pointer-events-none absolute inset-0 transition-all duration-700 ${atmosphereOverlay}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-[6%] top-[18%] z-20 transition-transform duration-100 ease-out",
						style: { transform: `translate3d(${-pxElementsX * .9}px, ${-pxElementsY * .9}px, 0)` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group",
							children: [mascotBubbleOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-pop absolute -top-20 left-12 z-30 w-56 rounded-2xl border-2 border-amber-400 bg-amber-50 p-3 shadow-chunky sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-body text-xs font-bold leading-snug text-amber-950 sm:text-sm",
										children: MAP_HINTS[hintIndex]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => {
											e.stopPropagation();
											setMascotBubbleOpen(false);
										},
										className: "text-xs text-amber-600 hover:text-amber-900",
										children: "✕"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-2.5 left-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-amber-400 bg-amber-50" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleMascotClick,
								className: `relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-amber-300 bg-amber-100 shadow-chunky transition-transform hover:scale-110 active:scale-95 sm:h-28 sm:w-28 ${mascotJumping ? "animate-bounce" : "animate-bounce-soft"}`,
								title: "Eu sou o Mapa! Clique em mim para ouvir dicas!",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: map_character_default,
									alt: "O Mapa — Guia interativo da trilha",
									className: "h-full w-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-0 inset-x-0 bg-amber-500/90 py-0.5 text-center font-display text-[10px] font-extrabold text-white",
									children: "O MAPA 🗺️"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 z-10 transition-transform duration-100 ease-out",
						style: { transform: `translate3d(${-pxElementsX}px, ${-pxElementsY}px, 0)` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-full w-full",
							viewBox: "0 0 100 100",
							preserveAspectRatio: "none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: pathD,
								fill: "none",
								stroke: "rgba(0, 0, 0, 0.25)",
								strokeWidth: "3.2",
								strokeLinecap: "round",
								transform: "translate(0.3, 0.6)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: pathD,
								fill: "none",
								stroke: "#fef08a",
								strokeWidth: "2.5",
								strokeDasharray: "2.5,2.5",
								strokeLinecap: "round",
								className: "animate-[dash_20s_linear_infinite]"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 z-20 transition-transform duration-100 ease-out",
						style: { transform: `translate3d(${-pxElementsX}px, ${-pxElementsY}px, 0)` },
						children: nodes.map((node, index) => {
							const isSelected = selectedNode?.id === node.id;
							const isCurrent = node.state === "current";
							const isDone = node.state === "done";
							const isLocked = node.state === "locked";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
								style: {
									left: `${node.x}%`,
									top: `${node.y}%`
								},
								children: [isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "whitespace-nowrap rounded-full bg-primary px-3 py-1 font-display text-[11px] font-extrabold text-primary-foreground shadow-chunky animate-bounce-soft",
										children: "VOCÊ ESTÁ AQUI 🎯"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/luvi-mascot-DnCu-Z-y.png",
										alt: "Luvi",
										className: "w-12 -mt-1 animate-[wiggle_1.8s_ease-in-out_infinite]"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											if (!isLocked) {
												soundFx.playPop();
												onSelectNode(node);
											}
										},
										disabled: isLocked,
										className: `relative grid h-14 w-14 place-items-center rounded-full text-2xl font-black transition-all sm:h-16 sm:w-16 ${isDone ? "bg-mint shadow-chunky hover:-translate-y-1 hover:scale-110 active:scale-95" : isCurrent ? "bg-gradient-rainbow shadow-chunky hover:-translate-y-1 hover:scale-110 ring-4 ring-amber-300 animate-pulse active:scale-95" : "cursor-not-allowed bg-slate-300/80 text-slate-500 opacity-70 shadow-sm"} ${isSelected ? "ring-4 ring-primary scale-110" : ""}`,
										"aria-label": `${node.title} — ${node.state}`,
										children: [
											isLocked ? "🔒" : node.icon,
											isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-black text-emerald-600 shadow-soft",
												children: "✓"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute -top-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-card font-display text-[10px] font-extrabold text-foreground shadow-soft",
												children: node.id
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-44 rounded-2xl bg-card/95 p-2.5 text-center shadow-chunky backdrop-blur-sm group-hover:block z-30 animate-pop",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-xs font-black text-foreground",
												children: node.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] font-bold text-muted-foreground",
												children: node.islandName
											}),
											isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 text-xs",
												children: ["⭐".repeat(node.stars), "☆".repeat(3 - node.stars)]
											}),
											isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-black text-primary",
												children: "Próxima Lição"
											})
										]
									})]
								})]
							}, node.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-0 z-30 transition-transform duration-100 ease-out",
						style: { transform: `translate3d(${-pxForegroundX}px, ${-pxForegroundY}px, 0)` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-[20%] top-[45%] animate-[float_4s_ease-in-out_infinite] text-xl",
								children: "🦋"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-[22%] top-[60%] animate-[float_5s_ease-in-out_infinite_1.5s] text-2xl",
								children: "🦋"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-[3%] bottom-[6%] text-2xl animate-bounce-soft",
								children: "🌺"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-[4%] bottom-[8%] text-2xl animate-[wiggle_2s_ease-in-out_infinite]",
								children: "🌴"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-300/60 bg-card/90 px-6 py-3 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl",
						children: "🗺️"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-sm font-extrabold",
						children: "Trilha Gamificada de LIBRAS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Mova o cursor para explorar em 3D · Clique no Mapa e no Rio para interagir!"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 text-xs font-extrabold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-4 w-4 place-items-center rounded-full bg-mint text-[10px]",
								children: "✓"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Concluídas" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-amber-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[10px]",
								children: "⭐"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Atual" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "🔒"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bloqueadas" })]
						})
					]
				})]
			})
		]
	});
}
function CloudSvg({ width = 120, height = 60, opacity = .9 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width,
		height,
		viewBox: "0 0 120 60",
		fill: "white",
		style: {
			opacity,
			filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M25 45 C15 45 8 38 8 28 C8 19 16 13 24 13 C26 7 34 2 45 2 C58 2 68 9 70 17 C75 14 84 14 90 19 C98 24 98 33 94 38 C104 39 110 46 110 52 C110 58 104 60 95 60 L25 60 C15 60 10 54 10 48 Z" })
	});
}
var TRAIL_NODES_BASE_WORLD1 = [
	{
		id: 1,
		islandId: 1,
		islandName: "Ilha das Primeiras Letras",
		title: "Letras A, B, C",
		icon: "🦫",
		kind: "licao",
		x: 10,
		y: 88
	},
	{
		id: 2,
		islandId: 1,
		islandName: "Ilha das Primeiras Letras",
		title: "Letras D, E, F",
		icon: "🦖",
		kind: "licao",
		x: 22,
		y: 76
	},
	{
		id: 3,
		islandId: 1,
		islandName: "Ilha das Primeiras Letras",
		title: "Revisão: A, B, C",
		icon: "⚡",
		kind: "revisao",
		x: 34,
		y: 64
	},
	{
		id: 4,
		islandId: 1,
		islandName: "Ilha das Primeiras Letras",
		title: "Chefe: D, E, F",
		icon: "🏆",
		kind: "chefe",
		x: 40,
		y: 54
	},
	{
		id: 5,
		islandId: 2,
		islandName: "Ilha dos Bichinhos do Meio",
		title: "Letras G, H, I",
		icon: "🦒",
		kind: "licao",
		x: 48,
		y: 48
	},
	{
		id: 6,
		islandId: 2,
		islandName: "Ilha dos Bichinhos do Meio",
		title: "Letras J, K, L",
		icon: "🦁",
		kind: "licao",
		x: 57,
		y: 52
	},
	{
		id: 7,
		islandId: 2,
		islandName: "Ilha dos Bichinhos do Meio",
		title: "Espelho IA: G, H, I",
		icon: "🪞",
		kind: "espelho",
		x: 67,
		y: 54
	},
	{
		id: 8,
		islandId: 2,
		islandName: "Ilha dos Bichinhos do Meio",
		title: "Chefe: J, K, L",
		icon: "👑",
		kind: "chefe",
		x: 76,
		y: 45
	},
	{
		id: 9,
		islandId: 3,
		islandName: "Ilha das Letras do Castelo",
		title: "Letras M, N, O",
		icon: "🐵",
		kind: "licao",
		x: 70,
		y: 35
	},
	{
		id: 10,
		islandId: 3,
		islandName: "Ilha das Letras do Castelo",
		title: "Letras P, Q, R",
		icon: "🐼",
		kind: "licao",
		x: 62,
		y: 25
	},
	{
		id: 11,
		islandId: 3,
		islandName: "Ilha das Letras do Castelo",
		title: "Revisão: M, N, O",
		icon: "⚡",
		kind: "revisao",
		x: 68,
		y: 18
	},
	{
		id: 12,
		islandId: 3,
		islandName: "Ilha das Letras do Castelo",
		title: "Chefe Mundo 1: P, Q, R",
		icon: "🏰",
		kind: "chefe",
		x: 80,
		y: 13
	}
];
var TRAIL_NODES_BASE_WORLD2 = [
	{
		id: 13,
		islandId: 4,
		islandName: "Ilha dos Bichos Aventureiros",
		title: "Letras S, T, U",
		icon: "🐸",
		kind: "licao",
		x: 12,
		y: 84
	},
	{
		id: 14,
		islandId: 4,
		islandName: "Ilha dos Bichos Aventureiros",
		title: "Letras V, W, X",
		icon: "🐮",
		kind: "licao",
		x: 25,
		y: 72
	},
	{
		id: 15,
		islandId: 4,
		islandName: "Ilha dos Bichos Aventureiros",
		title: "Revisão: S, T, U",
		icon: "⚡",
		kind: "revisao",
		x: 38,
		y: 60
	},
	{
		id: 16,
		islandId: 4,
		islandName: "Ilha dos Bichos Aventureiros",
		title: "Chefe: V, W, X",
		icon: "🏠",
		kind: "chefe",
		x: 44,
		y: 50
	},
	{
		id: 17,
		islandId: 5,
		islandName: "Ilha dos Sinais Dinâmicos",
		title: "Letras Y, Z, A",
		icon: "🦬",
		kind: "licao",
		x: 54,
		y: 46
	},
	{
		id: 18,
		islandId: 5,
		islandName: "Ilha dos Sinais Dinâmicos",
		title: "Dinâmicos: H, J, Z",
		icon: "🔄",
		kind: "licao",
		x: 64,
		y: 52
	},
	{
		id: 19,
		islandId: 5,
		islandName: "Ilha dos Sinais Dinâmicos",
		title: "Espelho IA: F, T, S",
		icon: "🪞",
		kind: "espelho",
		x: 74,
		y: 46
	},
	{
		id: 20,
		islandId: 5,
		islandName: "Ilha dos Sinais Dinâmicos",
		title: "Chefe: K, P, D",
		icon: "🕊️",
		kind: "chefe",
		x: 80,
		y: 36
	},
	{
		id: 21,
		islandId: 6,
		islandName: "O Portão Real do Trono A-Z",
		title: "Dedos Unidos: R, U, V",
		icon: "✌️",
		kind: "licao",
		x: 70,
		y: 26
	},
	{
		id: 22,
		islandId: 6,
		islandName: "O Portão Real do Trono A-Z",
		title: "Dedos p/ Baixo: M, N, W",
		icon: "👇",
		kind: "licao",
		x: 60,
		y: 18
	},
	{
		id: 23,
		islandId: 6,
		islandName: "O Portão Real do Trono A-Z",
		title: "Super Revisão: A, L, Y",
		icon: "⚡",
		kind: "revisao",
		x: 68,
		y: 12
	},
	{
		id: 24,
		islandId: 6,
		islandName: "O Portão Real do Trono A-Z",
		title: "Grande Trono: X, Y, Z",
		icon: "👑",
		kind: "chefe",
		x: 82,
		y: 8
	}
];
var ISLANDS_WORLD1 = [
	{
		id: 1,
		name: "Ilha das Primeiras Letras",
		subtitle: "Aprenda A, B, C e D, E, F com os mascotes",
		tone: "bg-sky",
		nodes: []
	},
	{
		id: 2,
		name: "Ilha dos Bichinhos do Meio",
		subtitle: "Aprenda G, H, I e J, K, L em LIBRAS",
		tone: "bg-grape",
		nodes: []
	},
	{
		id: 3,
		name: "Ilha das Letras do Castelo",
		subtitle: "Aprenda M, N, O e P, Q, R com a turma",
		tone: "bg-neon",
		nodes: []
	}
];
var ISLANDS_WORLD2 = [
	{
		id: 4,
		name: "Ilha dos Bichos Aventureiros",
		subtitle: "Aprenda S, T, U e V, W, X em LIBRAS",
		tone: "bg-coral",
		nodes: []
	},
	{
		id: 5,
		name: "Ilha dos Sinais Dinâmicos",
		subtitle: "Letras Y, Z, Movimentos e Desafios de Polegar",
		tone: "bg-sunshine",
		nodes: []
	},
	{
		id: 6,
		name: "O Portão Real do Trono A-Z",
		subtitle: "Domínio completo do alfabeto manual em LIBRAS",
		tone: "bg-sky",
		nodes: []
	}
];
/** Calcula o estado dinâmico dos nós com base nas lições concluídas do usuário e no mundo ativo. */
function computeNodes(completedLessons, world, isTeacher = false) {
	const completedIds = new Set(completedLessons.map((l) => l.id));
	const baseNodes = world === 1 ? TRAIL_NODES_BASE_WORLD1 : TRAIL_NODES_BASE_WORLD2;
	const isWorld1Completed = completedIds.has("trail_node_12") || completedIds.has("les_12");
	let foundCurrent = false;
	return baseNodes.map((base) => {
		const lessonId = `trail_node_${base.id}`;
		const legacyId = `les_${base.id}`;
		if (completedIds.has(lessonId) || completedIds.has(legacyId)) {
			const lesson = completedLessons.find((l) => l.id === lessonId || l.id === legacyId);
			const stars = lesson ? lesson.score >= 90 ? 3 : lesson.score >= 60 ? 2 : 1 : 1;
			return {
				...base,
				state: "done",
				stars
			};
		}
		if (isTeacher) return {
			...base,
			state: "current",
			stars: 0
		};
		if (world === 2 && !isWorld1Completed) return {
			...base,
			state: "locked",
			stars: 0
		};
		if (!foundCurrent) {
			foundCurrent = true;
			return {
				...base,
				state: "current",
				stars: 0
			};
		}
		return {
			...base,
			state: "locked",
			stars: 0
		};
	});
}
function buildIslands(nodes, world) {
	return (world === 1 ? ISLANDS_WORLD1 : ISLANDS_WORLD2).map((island) => ({
		...island,
		nodes: nodes.filter((n) => n.islandId === island.id)
	}));
}
var KIND_LABEL = {
	licao: "Micro-lição · 3 min",
	revisao: "Revisão espaçada",
	espelho: "Câmera + IA",
	chefe: "Chefe da ilha"
};
function TrailPage() {
	const navigate = useNavigate();
	const search = Route$2.useSearch();
	const [isValidating, setIsValidating] = (0, import_react.useState)(true);
	const [authorizedUser, setAuthorizedUser] = (0, import_react.useState)(null);
	const [activeWorld, setActiveWorld] = (0, import_react.useState)(1);
	const [isWorld2Unlocked, setIsWorld2Unlocked] = (0, import_react.useState)(false);
	const [showLockModal, setShowLockModal] = (0, import_react.useState)(false);
	const [trailNodes, setTrailNodes] = (0, import_react.useState)([]);
	const [islands, setIslands] = (0, import_react.useState)(ISLANDS_WORLD1);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("map");
	const [timeOfDay, setTimeOfDay] = (0, import_react.useState)("day");
	const [isMuted, setIsMuted] = (0, import_react.useState)(soundFx.getMuted());
	const [isAlphabetModalOpen, setIsAlphabetModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let user = getActiveUser();
		if (!user) {
			user = loginUser("luizinho@sinalizamais.com", "123");
			if (user) toast.info("👋 Bem-vindo(a) à sua primeira trilha de LIBRAS!");
			else {
				toast.error("🔒 Faça login como Aluno para acessar as trilhas de LIBRAS.");
				navigate({
					to: "/login",
					replace: true
				});
				return;
			}
		}
		if (user) {
			const { lives: regLives, lastLiveLostAt: regLast } = regenerateLives(user);
			if (regLives !== user.lives) user = saveUser({
				...user,
				lives: regLives,
				lastLiveLostAt: regLast
			});
		}
		const isTeacher = user.role === "professor";
		const lessons = user.completedLessons ?? [];
		const completedSet = new Set(lessons.map((l) => l.id));
		const unlocked2 = isTeacher || completedSet.has("trail_node_12") || completedSet.has("les_12");
		setIsWorld2Unlocked(unlocked2);
		const targetWorld = search.world || (unlocked2 ? 2 : 1);
		setActiveWorld(targetWorld);
		const computed = computeNodes(lessons, targetWorld, isTeacher);
		setTrailNodes(computed);
		setIslands(buildIslands(computed, targetWorld));
		setAuthorizedUser(user);
		setIsValidating(false);
		const unsub = onUserChange(() => {
			const refreshed = getActiveUser();
			if (refreshed) setAuthorizedUser(refreshed);
		});
		return () => {
			unsub();
		};
	}, [navigate, search.world]);
	const handleSelectWorld = (worldNum) => {
		soundFx.playPop();
		if (worldNum === 2 && !isWorld2Unlocked) {
			setShowLockModal(true);
			return;
		}
		setActiveWorld(worldNum);
		if (authorizedUser) {
			const isTeacher = authorizedUser.role === "professor";
			const computed = computeNodes(authorizedUser.completedLessons ?? [], worldNum, isTeacher);
			setTrailNodes(computed);
			setIslands(buildIslands(computed, worldNum));
		}
	};
	const handleToggleMute = () => {
		const nextMuted = soundFx.toggleMute();
		setIsMuted(nextMuted);
		if (!nextMuted) soundFx.playPop();
	};
	const handleSelectNode = (node) => {
		setSelected(node);
	};
	if (isValidating || !authorizedUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-sm font-extrabold text-muted-foreground",
				children: "Verificando permissões de acesso à trilha..."
			})]
		})
	});
	const completedCount = trailNodes.filter((n) => n.state === "done").length;
	const progressPercent = Math.round(completedCount / trailNodes.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-hero pb-24 text-foreground selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailHeader, {
				user: authorizedUser,
				timeOfDay,
				setTimeOfDay,
				isMuted,
				onToggleMute: handleToggleMute,
				viewMode,
				onToggleView: setViewMode,
				onOpenAlphabet: () => setIsAlphabetModalOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-6 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleSelectWorld(1),
							className: `w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-display text-sm font-black transition-all ${activeWorld === 1 ? "bg-primary text-primary-foreground shadow-chunky scale-105" : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground shadow-soft"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐾" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mundo 1: Alfabeto dos Bichinhos (A-R)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleSelectWorld(2),
							className: `w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-display text-sm font-black transition-all ${activeWorld === 2 ? "bg-gradient-rainbow text-white shadow-chunky scale-105" : isWorld2Unlocked ? "bg-card text-foreground hover:bg-muted shadow-soft" : "bg-muted/80 text-muted-foreground cursor-pointer shadow-soft opacity-80"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👑" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mundo 2: O Trono do Alfabeto (S-Z)" }),
								!isWorld2Unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-xs",
									children: "🔒"
								}),
								isWorld2Unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-xs",
									children: "✨"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-6 flex flex-col items-center gap-4 rounded-4xl bg-card p-6 shadow-soft sm:flex-row sm:gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: luvi_mascot_default,
							alt: "Luvi, mascote do sinaliza mais, acenando",
							width: 1024,
							height: 1024,
							className: "w-20 shrink-0 animate-bounce-soft sm:w-24"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 text-center sm:text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-center gap-2 sm:justify-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl font-black text-foreground",
										children: activeWorld === 1 ? "Mundo 1: Alfabeto dos Bichinhos" : "Mundo 2: O Grande Trono do Alfabeto"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-amber-100 px-3 py-0.5 font-display text-xs font-black text-amber-800",
										children: [
											"Ilha ",
											islands.findIndex((isl) => isl.nodes.some((n) => n.state === "current")) + 1,
											" de ",
											islands.length
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: activeWorld === 1 ? completedCount === 0 ? "Bem-vindo(a)! Aprenda o alfabeto em LIBRAS, 3 letras por lição com os bichinhos! 🐾" : `Você completou ${completedCount} de ${trailNodes.length} lições do Mundo 1. Continue avançando! 🌟` : isWorld2Unlocked ? `Bem-vindo ao Trono Real! Você completou ${completedCount} de ${trailNodes.length} lições do Mundo 2! 👑` : "Conclua a Fase 12 na Ilha das Letras do Castelo para abrir os portões do Mundo 2! 🔒"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-3.5 flex-1 overflow-hidden rounded-full bg-muted shadow-inner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-gradient-rainbow transition-all duration-700",
											style: { width: `${progressPercent}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-xs font-black text-muted-foreground",
										children: [progressPercent, "% concluído"]
									})]
								})
							]
						})]
					}),
					viewMode === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-10 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-black",
									children: "Mapa de Aventura Interativo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: activeWorld === 1 ? "Explore o relevo das ilhas e clique nos nós para aprender LIBRAS" : "Explore o pátio real e os salões do Castelo da Família & Expressões"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 rounded-2xl bg-card p-1 shadow-soft",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setTimeOfDay("day");
												soundFx.playPop();
											},
											className: `rounded-xl px-2.5 py-1 text-xs font-black transition-all ${timeOfDay === "day" ? "bg-amber-400 text-amber-950 shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
											title: "Dia Ensolarado",
											children: "☀️ Dia"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setTimeOfDay("sunset");
												soundFx.playPop();
											},
											className: `rounded-xl px-2.5 py-1 text-xs font-black transition-all ${timeOfDay === "sunset" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
											title: "Pôr do Sol",
											children: "🌅 Ocaso"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setTimeOfDay("night");
												soundFx.playPop();
											},
											className: `rounded-xl px-2.5 py-1 text-xs font-black transition-all ${timeOfDay === "night" ? "bg-indigo-900 text-indigo-100 shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
											title: "Noite Estrelada",
											children: "🌙 Noite"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParallaxTrailMap, {
								nodes: trailNodes,
								selectedNode: selected,
								onSelectNode: handleSelectNode,
								timeOfDay
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
								children: islands.map((island) => {
									const doneCount = island.nodes.filter((n) => n.state === "done").length;
									const isCurrent = island.nodes.some((n) => n.state === "current");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `rounded-3xl border-2 p-4 transition-all ${isCurrent ? "border-emerald-300 bg-card/60 shadow-soft" : doneCount === island.nodes.length ? "border-emerald-400  bg-card/60 shadow-soft" : "border-emerald-200 bg-card/60 shadow-soft"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `grid h-10 w-10 place-items-center rounded-2xl ${island.tone} font-display text-lg font-black shadow-sm`,
												children: island.id
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-sm font-black",
												children: island.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													doneCount,
													"/",
													island.nodes.length,
													" lições completas"
												]
											})] })]
										})
									}, island.id);
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-14",
						children: islands.map((island, ii) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IslandBlock, {
							island,
							index: ii,
							onSelect: handleSelectNode
						}, island.name))
					}),
					activeWorld === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleSelectWorld(2),
						className: `mt-12 cursor-pointer rounded-4xl border-4 p-8 text-center backdrop-blur-sm shadow-lg transition-transform hover:scale-[1.01] ${isWorld2Unlocked ? "border-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/20" : "border-dashed border-border bg-card/40"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-4xl animate-bounce-soft",
								children: isWorld2Unlocked ? "🏰✨" : "🏰🔒"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-xl font-extrabold",
								children: "Mundo 2: O Castelo da Família e Expressões"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto",
								children: isWorld2Unlocked ? "Parabéns! O Portão do Castelo está aberto! Clique para explorar o Mundo 2!" : "Termine a jornada na Ilha dos Bichos (Fase 12) para cruzar o portão do castelo e desbloquear novas aventuras!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `mt-4 rounded-full px-6 py-2.5 font-display text-xs font-black shadow-soft ${isWorld2Unlocked ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-primary text-primary-foreground hover:opacity-90"}`,
								children: isWorld2Unlocked ? "Entrar no Castelo 🏰" : "Ver Portão do Castelo 🔒"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleSelectWorld(1),
						className: "mt-12 cursor-pointer rounded-4xl border-2 border-sky-300 bg-sky-500/10 p-6 text-center shadow-lg transition-transform hover:scale-[1.01]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl",
								children: "🌊"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-lg font-extrabold text-sky-900 dark:text-sky-200",
								children: "Voltar ao Mundo 1: Cores & Bichos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-sky-700 dark:text-sky-300",
								children: "Revise lições de saudações, cores e animais a qualquer momento!"
							})
						]
					})
				]
			}),
			showLockModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pop relative w-full max-w-md rounded-4xl bg-card p-8 shadow-chunky text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-4xl shadow-chunky",
							children: "🏰🔒"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-2xl font-black text-foreground",
							children: "Portão do Castelo Trancado!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground leading-relaxed",
							children: [
								"Para cruzar o portão do castelo e explorar o ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mundo 2: O Castelo da Família e Expressões" }),
								", você precisa vencer o desafio final da Ilha dos Bichos no Mundo 1!"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setShowLockModal(false);
									handleSelectWorld(1);
								},
								className: "rounded-full bg-primary px-6 py-3 font-display text-sm font-black text-primary-foreground shadow-chunky transition-transform hover:scale-105",
								children: "Ir para a Fase 12 (Chefe da Ilha dos Bichos)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowLockModal(false),
								className: "text-xs font-bold text-muted-foreground hover:text-foreground",
								children: "Entendi, continuar no Mundo 1"
							})]
						})
					]
				})
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeSheet, {
				node: selected,
				onClose: () => setSelected(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlphabetReferenceModal, {
				isOpen: isAlphabetModalOpen,
				onClose: () => setIsAlphabetModalOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinClassroomFab, {})
		]
	});
}
function TrailHeader({ user, timeOfDay, setTimeOfDay, isMuted, onToggleMute, viewMode, onToggleView, onOpenAlphabet }) {
	const streakVal = user?.streak ?? 1;
	const xpVal = user?.xp ?? 0;
	const livesVal = user?.lives ?? 5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					"aria-label": "sinaliza mais, início",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-rainbow font-display text-lg font-extrabold text-primary-foreground shadow-sm",
						children: "S"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden font-display text-lg font-extrabold sm:block",
						children: "sinaliza mais"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center rounded-2xl bg-muted p-1 text-xs font-black",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							onToggleView("map");
							soundFx.playPop();
						},
						className: `flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${viewMode === "map" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🗺️" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mapa 3D" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							onToggleView("list");
							soundFx.playPop();
						},
						className: `flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${viewMode === "list" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📋" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lista" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						onOpenAlphabet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onOpenAlphabet,
							className: "flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20 shadow-xs",
							title: "Abrir Guia Oficial de Alfabeto em LIBRAS (A-Z)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Guia A-Z"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onToggleMute,
							className: "grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft transition-transform hover:scale-105",
							title: isMuted ? "Ativar som" : "Desativar som",
							"aria-label": isMuted ? "Ativar som" : "Desativar som",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base",
								children: isMuted ? "🔇" : "🔊"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: "🔥",
							value: `${streakVal}`,
							label: `${streakVal} dias de ofensiva`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: "⭐",
							value: `${xpVal}`,
							label: `${xpVal} XP total`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: "❤️",
							value: `${livesVal}`,
							label: `${livesVal} vidas restantes`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailUserAuthControls, {})
					]
				})
			]
		})
	});
}
function TrailUserAuthControls() {
	const [currentUser, setCurrentUser] = (0, import_react.useState)(() => getActiveUser());
	const handleLogout = () => {
		logoutUser();
		setCurrentUser(null);
		toast.info("Sessão encerrada.");
	};
	if (!currentUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground shadow-soft",
		children: "🔑 Entrar"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurmaClaNavbarButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: currentUser.role === "professor" ? "/onboarding" : "/student/profile",
				className: "flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-extrabold hover:bg-muted",
				title: "Meu Perfil / Painel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentUser.avatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden md:inline",
					children: currentUser.name.split(" ")[0]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleLogout,
				className: "rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-extrabold text-red-600 hover:bg-red-500/20 dark:text-red-400",
				title: "Sair / Log-off",
				children: "🚪 Sair"
			})
		]
	});
}
function Stat({ icon, value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-soft",
		title: label,
		"aria-label": `${value} ${label}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-base",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-sm font-extrabold",
			children: value
		})]
	});
}
function IslandBlock({ island, index, onSelect }) {
	const locked = island.nodes.every((n) => n.state === "locked");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": island.name,
		className: "rounded-3xl bg-card/60 p-6 shadow-soft backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `grid h-12 w-12 place-items-center rounded-2xl ${island.tone} font-display text-xl font-extrabold shadow-chunky`,
					children: index + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-extrabold",
					children: island.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
					children: island.subtitle
				})] }),
				locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto text-2xl",
					"aria-hidden": true,
					children: "🔒"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "relative space-y-8",
			children: island.nodes.map((n, i) => {
				const offset = [
					"ml-0",
					"ml-16",
					"ml-28",
					"ml-16"
				][i % 4];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center gap-4 ${offset}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailButton, {
						node: n,
						onSelect
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: n.state === "locked" ? "opacity-40" : "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-base font-extrabold",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
								children: KIND_LABEL[n.kind]
							}),
							n.state === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								"aria-label": `${n.stars} de 3 estrelas`,
								children: ["⭐".repeat(n.stars), "☆".repeat(3 - n.stars)]
							})
						]
					})]
				}, n.id);
			})
		})]
	});
}
function TrailButton({ node, onSelect }) {
	const base = "relative grid h-20 w-20 shrink-0 place-items-center rounded-full text-3xl transition-transform";
	if (node.state === "locked") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		disabled: true,
		"aria-label": `${node.title} — bloqueado`,
		className: `${base} cursor-not-allowed bg-muted opacity-60`,
		children: "🔒"
	});
	if (node.state === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => {
			soundFx.playPop();
			onSelect(node);
		},
		"aria-label": `${node.title} — concluído`,
		className: `${base} bg-mint shadow-chunky hover:-translate-y-1`,
		children: [node.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-card text-sm font-black text-emerald-600 shadow-soft",
			children: "✓"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 font-display text-xs font-extrabold text-primary-foreground shadow-chunky animate-bounce-soft",
			children: "COMEÇAR"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => {
				soundFx.playPop();
				onSelect(node);
			},
			"aria-label": `${node.title} — próxima lição`,
			className: `${base} bg-gradient-rainbow shadow-chunky hover:-translate-y-1`,
			children: node.icon
		})]
	});
}
function NodeSheet({ node, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "absolute inset-0 cursor-default",
			"aria-label": "Fechar",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-pop relative w-full max-w-md rounded-t-4xl bg-card p-8 shadow-chunky sm:rounded-4xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-rainbow text-4xl shadow-chunky",
						children: node.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xs font-black uppercase tracking-wider text-primary",
						children: [
							node.islandName,
							" · Fase ",
							node.id
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl font-extrabold",
						children: node.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: KIND_LABEL[node.kind]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reward, {
								icon: "⭐",
								label: "+10 XP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reward, {
								icon: "🌟",
								label: "3 estrelas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reward, {
								icon: "🎬",
								label: "5 telas"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/licao",
							search: { nodeId: node.id },
							onClick: () => soundFx.playChime(),
							className: "rounded-full bg-primary px-8 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-chunky transition-transform hover:scale-105 active:scale-95 text-center",
							children: node.state === "done" ? "Refazer lição" : "Começar lição"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "text-sm font-bold text-muted-foreground hover:text-foreground",
							children: "Agora não"
						})]
					})
				]
			})
		})]
	});
}
function Reward({ icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-muted p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xl",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs font-extrabold",
			children: label
		})]
	});
}
//#endregion
export { TrailPage as component };
