import { useStore } from '../../store/useStore'
import { Microscope, Activity, Zap, Maximize, X, Shield, Info, Beaker } from 'lucide-react'
import { organelleData } from '../../data/organelleData'
import { getOrgDiagram } from './OrganelleDiagrams'
import type { CSSProperties } from 'react'

export const UI = () => {
    const { selectedOrganelle, setSelectedOrganelle, mode, setMode, internalView, setInternalView, hoveredOrganelle } = useStore()
    const info = selectedOrganelle ? organelleData[selectedOrganelle] : null

    // ── Inline Style Objects ──────────────────────────────────────────────────
    const uiLayer: CSSProperties = {
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10,
    }

    const headerStyle: CSSProperties = {
        position: 'absolute', top: '1.5rem', left: '1.5rem',
        pointerEvents: 'auto',
        opacity: info ? 0 : 1,
        transition: 'opacity 0.4s ease',
        zIndex: 15,
    }

    const modeCtrlStyle: CSSProperties = {
        position: 'absolute', top: '1.5rem',
        right: info ? '420px' : '1.5rem',
        display: 'flex', gap: '0.75rem',
        pointerEvents: 'auto',
        transition: 'right 0.5s ease',
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

    const panelStyle: CSSProperties = {
        position: 'absolute', top: 0, right: 0,
        height: '100%', width: '400px',
        // KEY FIX: solid, fully-opaque background
        background: '#0B0F1A',
        borderLeft: '1px solid rgba(0,255,209,0.25)',
        zIndex: 50,
        overflowY: 'auto',
        pointerEvents: 'auto',
        transform: info ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
    }

    const bottomCtrlStyle: CSSProperties = {
        position: 'absolute', bottom: '1.5rem', left: '1.5rem',
        pointerEvents: info ? 'none' : 'auto',
        opacity: info ? 0 : 1,
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

    // ── Panel sections ────────────────────────────────────────────────────────
    const sectionTitle = (_label: string, color = '#fff'): CSSProperties => ({
        fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.2em', color, opacity: 0.6, marginBottom: '0.5rem',
    })

    const card: CSSProperties = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px', padding: '1rem',
    }

    const dividerStyle: CSSProperties = {
        height: '1px', background: 'rgba(255,255,255,0.08)',
        margin: '1.5rem 0',
    }

    return (
        <div style={uiLayer}>

            {/* ── Header ── */}
            <div style={headerStyle}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#00FFD1', textShadow: '0 0 18px rgba(0,255,209,0.5)', margin: 0 }}>
                    ANIMAL CELL 3D{' '}
                    <span style={{ fontSize: '0.6rem', fontWeight: 400, opacity: 0.5, letterSpacing: '0.3em' }}>EDICIÓN CIENTÍFICA</span>
                </h1>
                <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '0.2rem' }}>Visualizador Científico en Tiempo Real</p>
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

            {/* ── Info Panel ── */}
            <div style={panelStyle}>
                {info && (
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Header row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={sectionTitle('FICHA TÉCNICA', '#00FFD1')}>FICHA TÉCNICA</span>
                            <button
                                onClick={() => setSelectedOrganelle(null)}
                                style={{ padding: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', borderRadius: '50%' }}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Illustration – scientific SVG diagram */}
                        <div style={{
                            aspectRatio: '16/9', background: '#0D1520',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                            overflow: 'hidden', position: 'relative',
                        }}>
                            {getOrgDiagram(info.id)}
                        </div>

                        {/* Name */}
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{info.name}</h2>
                            <p style={{ fontSize: '0.78rem', color: '#00FFD1', marginTop: '0.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>{info.scientificName || info.name}</p>
                        </div>

                        {/* Size / Type grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div style={card}>
                                <p style={sectionTitle('Tamaño')}>Tamaño</p>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{info.size}</p>
                            </div>
                            <div style={card}>
                                <p style={sectionTitle('Tipo')}>Tipo</p>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Orgánulo</p>
                            </div>
                        </div>

                        {/* Función */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <Shield size={14} color="#00FFD1" />
                                <p style={sectionTitle('Función Biológica', '#00FFD1')}>Función Biológica</p>
                            </div>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.85, marginBottom: '1rem' }}>{info.whatIsIt}</p>
                            <div style={{ background: 'rgba(0,255,209,0.05)', border: '1px solid rgba(0,255,209,0.18)', borderRadius: '10px', padding: '1rem' }}>
                                <p style={{ fontSize: '0.78rem', color: '#00FFD1', fontWeight: 700 }}>✦ {info.function.primary}</p>
                                <div style={dividerStyle} />
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {info.function.secondary.map((fn, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', opacity: 0.8 }}>
                                            <span style={{ color: '#00FFD1' }}>›</span> {fn}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Estructura */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                <Info size={14} color="rgba(255,255,255,0.4)" />
                                <p style={sectionTitle('Estructura Interna')}>Estructura Interna</p>
                            </div>
                            <p style={{ fontSize: '0.78rem', lineHeight: 1.6, opacity: 0.7, borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '0.75rem' }}>
                                {info.structure}
                            </p>
                        </div>

                        {/* Importancia clínica */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                <Beaker size={14} color="#5CE1E6" />
                                <p style={sectionTitle('Importancia Clínica', '#5CE1E6')}>Importancia Clínica</p>
                            </div>
                            <div style={{ background: 'rgba(92,225,230,0.05)', border: '1px solid rgba(92,225,230,0.18)', borderRadius: '10px', padding: '1rem' }}>
                                <p style={{ fontSize: '0.78rem', color: '#5CE1E6', lineHeight: 1.6 }}>{info.clinicalImportance}</p>
                            </div>
                        </div>

                        <div style={dividerStyle} />

                        {/* Curiosidades */}
                        <div>
                            <p style={sectionTitle('Datos Curiosos')}>Datos Curiosos</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {info.curiosities.map((c, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(0,255,209,0.4)', marginTop: 4, flexShrink: 0 }} />
                                        <p style={{ opacity: 0.8, lineHeight: 1.5 }}>{c}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Analogía */}
                        <div style={{
                            background: 'linear-gradient(90deg, rgba(0,255,209,0.1), transparent)',
                            border: '1px solid rgba(0,255,209,0.2)', borderRadius: '12px',
                            padding: '1.2rem', marginTop: '0.5rem',
                        }}>
                            <p style={{ ...sectionTitle('Analogía', '#00FFD1'), opacity: 0.5 }}>Analogía</p>
                            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.9, lineHeight: 1.6, marginTop: '0.5rem' }}>"{info.comparison}"</p>
                        </div>

                    </div>
                )}
            </div>

            {/* ── Bottom Button ── */}
            <div style={bottomCtrlStyle}>
                <button style={exploreBtnStyle} onClick={() => setInternalView(!internalView)}>
                    <Maximize size={18} />
                    {internalView ? 'Macro-Visión' : 'Micro-Exploración'}
                </button>
            </div>

        </div>
    )
}
