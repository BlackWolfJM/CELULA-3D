import type { CSSProperties, ReactElement } from 'react'

// Inline SVG scientific diagrams per organelle
const diagrams: Record<string, ReactElement> = {
    Nucleus: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <radialGradient id="nucGrad" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#6A5ACD" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#2A1A5E" stopOpacity="0.5" />
                </radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {/* Outer envelope */}
            <ellipse cx="100" cy="70" rx="75" ry="55" fill="none" stroke="#6A5ACD" strokeWidth="4" filter="url(#glow)" opacity="0.8" />
            <ellipse cx="100" cy="70" rx="69" ry="49" fill="url(#nucGrad)" />
            {/* Nucleolus */}
            <circle cx="100" cy="70" r="22" fill="#8A2BE2" opacity="0.85" filter="url(#glow)" />
            <circle cx="100" cy="70" r="15" fill="#9B3CF0" opacity="0.9" />
            {/* Nuclear pores */}
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                const x = 100 + 75 * Math.cos(rad)
                const y = 70 + 55 * Math.sin(rad)
                return <circle key={i} cx={x} cy={y} r="4" fill="#B19CD9" stroke="#6A5ACD" strokeWidth="1.5" />
            })}
            {/* Label */}
            <text x="100" y="135" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">NUCLEAR ENVELOPE — NUCLEOLUS — PORES</text>
        </svg>
    ),

    Mitochondria: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <radialGradient id="mitoGrad" cx="40%" cy="40%">
                    <stop offset="0%" stopColor="#FF8C42" />
                    <stop offset="100%" stopColor="#8B1A00" />
                </radialGradient>
                <filter id="mglow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {/* Outer membrane */}
            <ellipse cx="100" cy="70" rx="80" ry="44" fill="url(#mitoGrad)" opacity="0.9" filter="url(#mglow)" />
            {/* Inner membrane (cristae) */}
            <ellipse cx="100" cy="70" rx="73" ry="37" fill="none" stroke="#FF6B35" strokeWidth="2" />
            {/* Cristae folds */}
            {[30, 50, 70, 90, 110, 130, 150, 170].map((x, i) => (
                <path key={i} d={`M ${x} 38 Q ${x + (i % 2 === 0 ? 10 : -10)} ${70} ${x} 102`} fill="none" stroke="#FF8C42" strokeWidth="2.5" opacity="0.7" />
            ))}
            {/* Matrix center */}
            <ellipse cx="100" cy="70" rx="30" ry="16" fill="rgba(255,180,100,0.15)" />
            {/* ATP dots */}
            {[[80, 68], [100, 64], [120, 68], [90, 74], [110, 74]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3" fill="#FFCC44" opacity="0.9" />
            ))}
            <text x="100" y="130" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">OUTER & INNER MEMBRANE — CRISTAE — MATRIX</text>
        </svg>
    ),

    Golgi: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <filter id="gglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {/* Stacked cisternae */}
            {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                    <path d={`M ${35 + i * 4} ${38 + i * 14} Q 100 ${30 + i * 14} ${165 - i * 4} ${38 + i * 14} Q 100 ${46 + i * 14} ${35 + i * 4} ${38 + i * 14}`}
                        fill="none" stroke="#F4C430" strokeWidth={3 - i * 0.3} opacity={1 - i * 0.1} filter="url(#gglow)" />
                </g>
            ))}
            {/* Vesicles left (cis) */}
            {[[22, 38], [18, 52], [20, 66]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="7" fill="#F4C430" opacity="0.6" />
            ))}
            {/* Vesicles right (trans) */}
            {[[178, 82], [182, 96], [175, 108]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="8" fill="#E6A500" opacity="0.75" />
            ))}
            <text x="30" y="42" fill="rgba(244,196,48,0.5)" fontSize="8" fontFamily="monospace">CIS</text>
            <text x="155" y="112" fill="rgba(244,196,48,0.5)" fontSize="8" fontFamily="monospace">TRANS</text>
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">CISTERNAS — CARA CIS — CARA TRANS</text>
        </svg>
    ),

    'Rough ER': (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <filter id="erglow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {/* Membrane folds */}
            {[0, 1, 2, 3].map(i => (
                <path key={i} d={`M 20 ${30 + i * 26} Q 100 ${22 + i * 26} 180 ${30 + i * 26} Q 100 ${38 + i * 26} 20 ${30 + i * 26}`}
                    fill="none" stroke="#2E8B57" strokeWidth="2.5" opacity={0.9 - i * 0.1} filter="url(#erglow)" />
            ))}
            {/* Ribosomes */}
            {[...Array(32)].map((_, i) => {
                const row = Math.floor(i / 8)
                const col = i % 8
                return <circle key={i} cx={30 + col * 22} cy={24 + row * 26} r="3.5" fill="#5CE1E6" opacity="0.9" />
            })}
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">MEMBRANAS — RIBOSOMAS (PUNTOS)</text>
        </svg>
    ),

    'Smooth ER': (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs><filter id="slglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            {/* Tubular network */}
            <path d="M 20 70 C 50 20, 90 120, 130 60 S 180 90 190 50" fill="none" stroke="#3CB371" strokeWidth="8" strokeLinecap="round" opacity="0.8" filter="url(#slglow)" />
            <path d="M 10 90 C 40 130, 80 30, 120 80 S 170 50, 190 80" fill="none" stroke="#3CB371" strokeWidth="8" strokeLinecap="round" opacity="0.6" filter="url(#slglow)" />
            <path d="M 30 40 C 60 80, 100 40, 140 100" fill="none" stroke="#2E8B57" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">TUBOS — RED MEMBRANOSA — SIN RIBOSOMAS</text>
        </svg>
    ),

    Lysosome: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <radialGradient id="lysoGrad" cx="40%" cy="40%">
                    <stop offset="0%" stopColor="#CC2200" />
                    <stop offset="100%" stopColor="#4A0000" />
                </radialGradient>
                <filter id="lglow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {/* Main lysosome body */}
            <circle cx="100" cy="68" r="52" fill="url(#lysoGrad)" filter="url(#lglow)" />
            <circle cx="100" cy="68" r="47" fill="none" stroke="#FF4444" strokeWidth="2" />
            {/* Enzyme granules */}
            {[[80, 58], [100, 50], [120, 58], [70, 72], [90, 80], [110, 75], [130, 68], [85, 65], [115, 62]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill="rgba(255,100,100,0.7)" />
            ))}
            {/* Acid pH label */}
            <text x="100" y="72" textAnchor="middle" fill="rgba(255,200,200,0.6)" fontSize="11" fontFamily="monospace" fontWeight="bold">pH 5</text>
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">MEMBRANA — MEDIO ÁCIDO — ENZIMAS</text>
        </svg>
    ),

    Peroxisome: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <radialGradient id="perGrad" cx="40%" cy="40%">
                    <stop offset="0%" stopColor="#9ACD32" />
                    <stop offset="100%" stopColor="#3B6000" />
                </radialGradient>
                <filter id="pglow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <circle cx="100" cy="68" r="50" fill="url(#perGrad)" filter="url(#pglow)" opacity="0.9" />
            <circle cx="100" cy="68" r="44" fill="none" stroke="#ADFF2F" strokeWidth="1.5" />
            {/* Crystalline catalase core */}
            <rect x="80" y="50" width="40" height="36" rx="4" fill="rgba(200,255,100,0.25)" stroke="#9ACD32" strokeWidth="1.5" />
            <line x1="80" y1="62" x2="120" y2="62" stroke="#9ACD32" strokeWidth="1" opacity="0.5" />
            <line x1="80" y1="74" x2="120" y2="74" stroke="#9ACD32" strokeWidth="1" opacity="0.5" />
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">CATALASA — MEMBRANA — H₂O₂→H₂O</text>
        </svg>
    ),

    Centrosome: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs><filter id="cglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            {/* Pericentriolar glow */}
            <circle cx="100" cy="70" r="40" fill="rgba(180,180,200,0.08)" />
            {/* Centriole 1 (vertical) */}
            <rect x="88" y="45" width="14" height="36" rx="5" fill="none" stroke="#B0C4DE" strokeWidth="2.5" filter="url(#cglow)" />
            {[50, 57, 64, 71, 75].map((y, i) => <line key={i} x1="88" y1={y} x2="102" y2={y} stroke="#B0C4DE" strokeWidth="1" opacity="0.5" />)}
            {/* Centriole 2 (horizontal, perpendicular) */}
            <rect x="105" y="60" width="36" height="14" rx="5" fill="none" stroke="#A0B4CE" strokeWidth="2" filter="url(#cglow)" opacity="0.8" />
            {[110, 118, 126, 136, 141].map((x, i) => <line key={i} x1={x} y1="60" x2={x} y2="74" stroke="#A0B4CE" strokeWidth="1" opacity="0.5" />)}
            {/* Microtubules emanating */}
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => {
                const rad = deg * Math.PI / 180
                return <line key={i} x1="100" y1="70" x2={100 + 55 * Math.cos(rad)} y2={70 + 55 * Math.sin(rad)} stroke="#708090" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
            })}
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">CENTRÍOLOS — MATERIAL PERICENTRIOLAR</text>
        </svg>
    ),

    Membrane: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs><filter id="memglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            {/* Bilayer - top */}
            <line x1="10" y1="55" x2="190" y2="55" stroke="#6EC1E4" strokeWidth="14" opacity="0.15" />
            <line x1="10" y1="55" x2="190" y2="55" stroke="#6EC1E4" strokeWidth="2" filter="url(#memglow)" />
            {/* Phospholipids heads top */}
            {[...Array(16)].map((_, i) => <circle key={i} cx={12 + i * 12} cy="50" r="4.5" fill="#6EC1E4" opacity="0.85" />)}
            {/* Tails top */}
            {[...Array(16)].map((_, i) => <line key={i} x1={12 + i * 12} y1="55" x2={12 + i * 12} y2="70" stroke="#6EC1E4" strokeWidth="1.5" opacity="0.5" />)}
            {/* Tails bottom */}
            {[...Array(16)].map((_, i) => <line key={i} x1={12 + i * 12} y1="72" x2={12 + i * 12} y2="86" stroke="#6EC1E4" strokeWidth="1.5" opacity="0.5" />)}
            {/* Phospholipids heads bottom */}
            {[...Array(16)].map((_, i) => <circle key={i} cx={12 + i * 12} cy="91" r="4.5" fill="#6EC1E4" opacity="0.85" />)}
            {/* Protein channel */}
            <rect x="88" y="46" width="22" height="50" rx="6" fill="rgba(0,255,209,0.2)" stroke="#00FFD1" strokeWidth="1.5" />
            <text x="99" y="75" textAnchor="middle" fill="#00FFD1" fontSize="8" fontFamily="monospace">CH</text>
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">BICAPA FOSFOLIPÍDICA — PROTEÍNA CANAL</text>
        </svg>
    ),

    Cytoplasm: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            {/* Background */}
            <rect width="200" height="120" fill="rgba(207,239,255,0.04)" rx="8" />
            {/* Brownian particles */}
            {[[30, 40], [70, 30], [130, 45], [160, 35], [50, 70], [100, 65], [150, 75], [80, 90], [120, 80], [40, 100], [170, 95]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="rgba(207,239,255,0.4)" />
            ))}
            {/* Motion lines */}
            <line x1="30" y1="40" x2="50" y2="60" stroke="rgba(207,239,255,0.15)" strokeWidth="1" strokeDasharray="2,3" />
            <line x1="100" y1="65" x2="80" y2="45" stroke="rgba(207,239,255,0.15)" strokeWidth="1" strokeDasharray="2,3" />
            <line x1="150" y1="75" x2="130" y2="90" stroke="rgba(207,239,255,0.15)" strokeWidth="1" strokeDasharray="2,3" />
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">CITOSOL — MOVIMIENTO BROWNIANO</text>
        </svg>
    ),

    Cytoskeleton: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs><filter id="skglow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            {/* Microtubules (thick blue) */}
            <line x1="20" y1="20" x2="180" y2="120" stroke="#0044FF" strokeWidth="4" opacity="0.7" filter="url(#skglow)" />
            <line x1="20" y1="120" x2="180" y2="20" stroke="#0033CC" strokeWidth="4" opacity="0.6" filter="url(#skglow)" />
            {/* Actin filaments (thin red) */}
            <path d="M 10 70 C 60 50, 90 90, 140 60 S 185 70 190 55" fill="none" stroke="#DC143C" strokeWidth="2" opacity="0.7" />
            <path d="M 10 90 C 50 110, 80 70, 130 90 S 175 80, 190 95" fill="none" stroke="#CC0033" strokeWidth="2" opacity="0.6" />
            {/* Intermediate filaments */}
            <path d="M 20 50 L 100 120 L 180 50" fill="none" stroke="#8B8B00" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
            {/* Legend */}
            <line x1="15" y1="128" x2="30" y2="128" stroke="#0044FF" strokeWidth="3" />
            <text x="34" y="131" fill="rgba(100,150,255,0.8)" fontSize="7" fontFamily="monospace">MICROTÚBULOS</text>
            <line x1="100" y1="128" x2="115" y2="128" stroke="#DC143C" strokeWidth="2" />
            <text x="119" y="131" fill="rgba(255,100,120,0.8)" fontSize="7" fontFamily="monospace">ACTINA</text>
        </svg>
    ),

    default: (
        <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ display: 'block' }}>
            <defs><radialGradient id="defGrad" cx="50%" cy="50%"><stop offset="0%" stopColor="#00FFD1" stopOpacity="0.3" /><stop offset="100%" stopColor="#00FFD1" stopOpacity="0" /></radialGradient></defs>
            <circle cx="100" cy="68" r="55" fill="url(#defGrad)" />
            <circle cx="100" cy="68" r="40" fill="none" stroke="#00FFD1" strokeWidth="1.5" opacity="0.4" strokeDasharray="4,3" />
            <circle cx="100" cy="68" r="22" fill="none" stroke="#00FFD1" strokeWidth="1" opacity="0.5" />
            <text x="100" y="132" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">DIAGRAMA MOLECULAR</text>
        </svg>
    ),
}

export function getOrgDiagram(id: string): ReactElement {
    return diagrams[id] ?? diagrams.default
}

// ── Shared CSS-in-JS styles ──────────────────────────────────────────────────

export const panelSectionTitle = (color = 'rgba(255,255,255,0.4)'): CSSProperties => ({
    fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.22em', color, marginBottom: '0.5rem', display: 'block',
})

export const infoCard: CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px', padding: '0.9rem',
}
