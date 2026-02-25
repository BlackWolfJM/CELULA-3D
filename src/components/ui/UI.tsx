import { useStore } from '../../store/useStore'
import { Microscope, Activity, Zap, Maximize, MousePointer2, Eye } from 'lucide-react'
import { OrganelleMenu } from './OrganelleMenu'
import type { CSSProperties } from 'react'

export const UI = () => {
    const { selectedOrganelle, mode, setMode, internalView, setInternalView, hoveredOrganelle, interactiveMode, setInteractiveMode } = useStore()

    // ── Inline Style Objects ──────────────────────────────────────────────────
    const uiLayer: CSSProperties = {
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10,
    }

    const headerStyle: CSSProperties = {
        position: 'absolute', top: '1.5rem', left: '1.5rem',
        pointerEvents: 'auto',
        opacity: selectedOrganelle ? 0 : 1,
        transition: 'opacity 0.4s ease',
        zIndex: 15,
    }

    const modeCtrlStyle: CSSProperties = {
        position: 'absolute', top: '1.5rem',
        right: '1.5rem',
        display: 'flex', gap: '0.75rem',
        pointerEvents: 'auto',
        zIndex: 15,
    }

    const modeBtnStyle = (active: boolean): CSSProperties => ({
        padding: '0.75rem',
        background: active ? 'rgba(0,255,209,0.07)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? '#00FFD1' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: active ? '0 0 16px rgba(0,255,209,0.25)' : 'none',
        display: 'flex', alignItems: 'center',
    })

    const bottomCtrlStyle: CSSProperties = {
        position: 'absolute', bottom: '1.5rem', left: '1.5rem',
        pointerEvents: 'auto',
        opacity: selectedOrganelle ? 0 : 1,
        transition: 'opacity 0.4s ease',
        zIndex: 15,
    }

    const exploreBtnStyle: CSSProperties = {
        padding: '1rem 2rem',
        background: internalView ? 'rgba(0,255,209,0.07)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${internalView ? '#00FFD1' : 'rgba(255,255,255,0.15)'}`,
        borderRadius: '12px',
        color: internalView ? '#00FFD1' : '#fff',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        fontFamily: 'inherit',
        boxShadow: internalView ? '0 0 30px rgba(0,255,209,0.25)' : 'none',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
    }

    const tagStyle: CSSProperties = {
        marginTop: '1rem', padding: '0.25rem 0.75rem',
        background: 'rgba(0,255,209,0.12)',
        border: '1px solid rgba(0,255,209,0.35)',
        borderRadius: '999px', display: 'inline-block',
        animation: 'pulse 2s infinite',
    }

    return (
        <div style={uiLayer}>

            {/* ── Organelle Side Menu ── */}
            <OrganelleMenu />

            {/* ── Decorative Horizontal Lines ── */}
            <svg
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="lineGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00FFD1" stopOpacity="0" />
                        <stop offset="15%" stopColor="#00FFD1" stopOpacity="0.35" />
                        <stop offset="50%" stopColor="#00FFD1" stopOpacity="0.1" />
                        <stop offset="85%" stopColor="#00FFD1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#00FFD1" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradBot" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0" />
                        <stop offset="15%" stopColor="#5CE1E6" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#5CE1E6" stopOpacity="0.07" />
                        <stop offset="85%" stopColor="#5CE1E6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#5CE1E6" stopOpacity="0" />
                    </linearGradient>
                    <filter id="lineGlow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <line x1="0" y1="10%" x2="100%" y2="10%" stroke="url(#lineGradTop)" strokeWidth="1" filter="url(#lineGlow)" />
                <line x1="0" y1="90%" x2="100%" y2="90%" stroke="url(#lineGradBot)" strokeWidth="1" filter="url(#lineGlow)" />
                <circle cx="20.5%" cy="10%" r="2.5" fill="#00FFD1" opacity="0.55" />
                <circle cx="79.5%" cy="10%" r="2.5" fill="#00FFD1" opacity="0.55" />
                <circle cx="20.5%" cy="90%" r="2.5" fill="#5CE1E6" opacity="0.45" />
                <circle cx="79.5%" cy="90%" r="2.5" fill="#5CE1E6" opacity="0.45" />
            </svg>

            {/* ── Header with Cell Logo ── */}
            <div style={headerStyle}>
                {/* SVG Cell Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <style>{`
                            @keyframes orbitA { from { transform: rotate(0deg) translateX(16px) rotate(0deg); } to { transform: rotate(360deg) translateX(16px) rotate(-360deg); } }
                            @keyframes orbitB { from { transform: rotate(120deg) translateX(16px) rotate(-120deg); } to { transform: rotate(480deg) translateX(16px) rotate(-480deg); } }
                            @keyframes orbitC { from { transform: rotate(240deg) translateX(16px) rotate(-240deg); } to { transform: rotate(600deg) translateX(16px) rotate(-600deg); } }
                            @keyframes cellPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
                        `}</style>
                        {/* Outer membrane */}
                        <circle cx="26" cy="26" r="23" stroke="#00FFD1" strokeWidth="1.2" strokeDasharray="4 2" fill="rgba(0,255,209,0.04)" style={{ animation: 'cellPulse 3s ease-in-out infinite' }} />
                        {/* Nucleus */}
                        <circle cx="26" cy="26" r="8" fill="rgba(106,90,205,0.55)" stroke="#B19CD9" strokeWidth="1" />
                        <circle cx="26" cy="26" r="4" fill="rgba(177,156,217,0.4)" />
                        {/* Orbiting organelles */}
                        <g style={{ transformOrigin: '26px 26px', animation: 'orbitA 6s linear infinite' }}>
                            <circle cx="26" cy="26" r="3.5" fill="#FF6B35" />
                        </g>
                        <g style={{ transformOrigin: '26px 26px', animation: 'orbitB 6s linear infinite' }}>
                            <circle cx="26" cy="26" r="3" fill="#F4C430" />
                        </g>
                        <g style={{ transformOrigin: '26px 26px', animation: 'orbitC 6s linear infinite' }}>
                            <circle cx="26" cy="26" r="2.5" fill="#2E8B57" />
                        </g>
                    </svg>
                    <div>
                        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#00FFD1', textShadow: '0 0 18px rgba(0,255,209,0.5)', margin: 0, lineHeight: 1 }}>
                            ANIMAL CELL 3D
                        </h1>
                        <p style={{ fontSize: '0.58rem', fontWeight: 400, opacity: 0.45, letterSpacing: '0.28em', margin: '3px 0 0', textTransform: 'uppercase' }}>Edición Científica</p>
                        <p style={{ fontSize: '0.62rem', opacity: 0.4, marginTop: '2px' }}>Visualizador en Tiempo Real</p>
                    </div>
                </div>
                {hoveredOrganelle && !selectedOrganelle && (
                    <div style={tagStyle}>
                        <span style={{ fontSize: '0.65rem', color: '#00FFD1', fontWeight: 700, letterSpacing: '0.2em' }}>
                            {hoveredOrganelle}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Mode Controls ── */}
            <div style={modeCtrlStyle}>
                <button style={modeBtnStyle(mode === 'dark')} onClick={() => setMode('dark')} title="Laboratorio">
                    <Activity size={20} color={mode === 'dark' ? '#00FFD1' : '#fff'} />
                </button>
                <button style={modeBtnStyle(mode === 'microscope')} onClick={() => setMode('microscope')} title="Microscopio">
                    <Microscope size={20} color={mode === 'microscope' ? '#00FFD1' : '#fff'} />
                </button>
                <button style={modeBtnStyle(mode === 'fluorescence')} onClick={() => setMode('fluorescence')} title="Fluorescencia">
                    <Zap size={20} color={mode === 'fluorescence' ? '#00FFD1' : '#fff'} />
                </button>
            </div>

            {/* ── Bottom Buttons ── */}
            <div style={{ ...bottomCtrlStyle, display: 'flex', gap: '0.75rem' }}>
                <button style={exploreBtnStyle} onClick={() => setInternalView(!internalView)}>
                    <Maximize size={18} />
                    {internalView ? 'Macro-Visión' : 'Micro-Exploración'}
                </button>

                {/* Interactive / Exploration mode toggle */}
                <button
                    style={{
                        ...exploreBtnStyle,
                        background: interactiveMode ? 'rgba(0,255,209,0.07)' : 'rgba(255,140,0,0.12)',
                        border: `1px solid ${interactiveMode ? 'rgba(255,255,255,0.15)' : '#FF8C00'}`,
                        color: interactiveMode ? '#fff' : '#FF8C00',
                        boxShadow: interactiveMode ? 'none' : '0 0 20px rgba(255,140,0,0.25)',
                    }}
                    onClick={() => {
                        setInteractiveMode(!interactiveMode)
                        // If turning off interactive mode, also deselect any active organelle
                        if (interactiveMode) useStore.getState().setSelectedOrganelle(null)
                    }}
                    title={interactiveMode ? 'Modo Interactivo: clic muestra información' : 'Modo Exploración: clic libre, sin selección'}
                >
                    {interactiveMode
                        ? <><Eye size={18} /> Interactivo</>
                        : <><MousePointer2 size={18} /> Exploración Libre</>
                    }
                </button>
            </div>

        </div>
    )
}
