import { useStore } from '../../store/useStore'
import { organelleData } from '../../data/organelleData'
import { getOrgDiagram } from './OrganelleDiagrams'
import { Shield, Info, Beaker, X } from 'lucide-react'
import * as THREE from 'three'
import type { CSSProperties } from 'react'

// ── Approximate world positions matching Scene.tsx layout ─────────────────
const ORGANELLE_POSITIONS: Record<string, [number, number, number]> = {
    Membrane: [0, 0, 0],
    Cytoplasm: [0, 0, 0],
    Nucleus: [0, 0, 0],
    Mitochondria: [2, 1, 2],
    Golgi: [-2, 1, -1],
    'Rough ER': [1.5, -0.5, -1.5],
    'Smooth ER': [-1, 2, 1],
    Lysosome: [2.5, -1.5, 1],
    Peroxisome: [-2.5, 1.5, -1],
    Centrosome: [0, -1.8, 0.5],
}

// ── Small colored icon per organelle ─────────────────────────────────────
const OrgIcon = ({ color }: { color: string }) => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="10" fill={color + '22'} stroke={color} strokeWidth="1.4" />
        <circle cx="13" cy="13" r="4.5" fill={color + '55'} />
        <circle cx="18" cy="9" r="2.2" fill={color + '99'} />
    </svg>
)

const organelleList = Object.values(organelleData)

export const OrganelleMenu = () => {
    const { selectedOrganelle, setSelectedOrganelle } = useStore()
    const info = selectedOrganelle ? organelleData[selectedOrganelle] : null

    // ── Shared panel wrapper ──────────────────────────────────────────────
    const wrap: CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        zIndex: 20,
        pointerEvents: 'auto',
        // Width expands when showing info
        width: info ? '360px' : '210px',
        transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
    }

    const panel: CSSProperties = {
        width: '100%',
        background: 'rgba(11,15,26,0.96)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0,255,209,0.22)',
        borderTop: '1px solid rgba(0,255,209,0.15)',
        borderBottom: '1px solid rgba(0,255,209,0.15)',
        borderRadius: '0 18px 18px 0',
        overflow: 'hidden',
        boxShadow: '4px 0 40px rgba(0,255,209,0.08)',
        maxHeight: '82vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
    }

    // ── Divider ───────────────────────────────────────────────────────────
    const divider: CSSProperties = {
        height: '1px',
        background: 'rgba(255,255,255,0.07)',
        margin: '0.75rem 0',
    }

    const sectionLabel = (color = '#fff'): CSSProperties => ({
        fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.22em', color, opacity: 0.65, marginBottom: '0.4rem',
    })

    // ─────────────────────────────────────────────────────────────────────
    // VIEW A: ORGANELLE LIST
    // ─────────────────────────────────────────────────────────────────────
    if (!info) {
        return (
            <div style={wrap}>
                <div style={panel}>
                    {/* Header */}
                    <div style={{
                        padding: '0.65rem 1rem',
                        borderBottom: '1px solid rgba(0,255,209,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={sectionLabel('#00FFD1')}>Orgánulos</span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.3, color: '#fff' }}>{organelleList.length}</span>
                    </div>

                    {/* Scrollable list */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {organelleList.map((org) => (
                            <div
                                key={org.id}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.55rem',
                                    padding: '0.5rem 0.9rem',
                                    cursor: 'pointer',
                                    borderLeft: '2px solid transparent',
                                    transition: 'all 0.18s ease',
                                }}
                                onClick={() => {
                                    const pos = ORGANELLE_POSITIONS[org.id]
                                    const vec = pos ? new THREE.Vector3(...pos) : undefined
                                    setSelectedOrganelle(org.id, vec)
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLDivElement
                                    el.style.background = 'rgba(0,255,209,0.07)'
                                    el.style.borderLeftColor = 'rgba(0,255,209,0.5)'
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLDivElement
                                    el.style.background = 'transparent'
                                    el.style.borderLeftColor = 'transparent'
                                }}
                            >
                                <OrgIcon color={org.colors.main} />
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: '0.73rem', fontWeight: 600, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {org.name}
                                    </p>
                                    {org.scientificName && (
                                        <p style={{ margin: 0, fontSize: '0.54rem', opacity: 0.35, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {org.scientificName}
                                        </p>
                                    )}
                                </div>
                                {/* Arrow hint */}
                                <span style={{ marginLeft: 'auto', color: '#00FFD1', opacity: 0.35, fontSize: '0.8rem', flexShrink: 0 }}>›</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────
    // VIEW B: ORGANELLE INFO (replaces list)
    // ─────────────────────────────────────────────────────────────────────
    return (
        <div style={wrap}>
            <div style={{ ...panel, overflowY: 'auto' }}>
                <div style={{ padding: '1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Top bar: back-to-list + label */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={() => setSelectedOrganelle(null)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#00FFD1', fontSize: '0.65rem', fontWeight: 700,
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                padding: '0.3rem 0.5rem',
                                borderRadius: '8px',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,209,0.1)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M8 1L3 6l5 5" stroke="#00FFD1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Lista
                        </button>
                        <button
                            onClick={() => setSelectedOrganelle(null)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', borderRadius: '50%', padding: '0.25rem' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* SVG Diagram */}
                    <div style={{
                        aspectRatio: '16/9', background: '#0D1520',
                        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px',
                        overflow: 'hidden',
                    }}>
                        {getOrgDiagram(info.id)}
                    </div>

                    {/* Name */}
                    <div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{info.name}</h2>
                        <p style={{ fontSize: '0.72rem', color: '#00FFD1', marginTop: '0.3rem', fontWeight: 600, letterSpacing: '0.04em' }}>{info.scientificName || info.name}</p>
                    </div>

                    {/* Size / Type grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        {[['Tamaño', info.size], ['Tipo', 'Orgánulo']].map(([label, value]) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem' }}>
                                <p style={sectionLabel()}>{label}</p>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Función */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                            <Shield size={13} color="#00FFD1" />
                            <p style={sectionLabel('#00FFD1')}>Función Biológica</p>
                        </div>
                        <p style={{ fontSize: '0.8rem', lineHeight: 1.55, opacity: 0.85, marginBottom: '0.75rem', marginTop: 0 }}>{info.whatIsIt}</p>
                        <div style={{ background: 'rgba(0,255,209,0.05)', border: '1px solid rgba(0,255,209,0.18)', borderRadius: '9px', padding: '0.85rem' }}>
                            <p style={{ fontSize: '0.74rem', color: '#00FFD1', fontWeight: 700, margin: '0 0 0.5rem' }}>✦ {info.function.primary}</p>
                            <div style={divider} />
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {info.function.secondary.map((fn, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.74rem', opacity: 0.8 }}>
                                        <span style={{ color: '#00FFD1' }}>›</span>{fn}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Estructura */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                            <Info size={13} color="rgba(255,255,255,0.4)" />
                            <p style={sectionLabel()}>Estructura Interna</p>
                        </div>
                        <p style={{ fontSize: '0.74rem', lineHeight: 1.55, opacity: 0.7, borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '0.65rem', margin: 0 }}>
                            {info.structure}
                        </p>
                    </div>

                    {/* Importancia clínica */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                            <Beaker size={13} color="#5CE1E6" />
                            <p style={sectionLabel('#5CE1E6')}>Importancia Clínica</p>
                        </div>
                        <div style={{ background: 'rgba(92,225,230,0.05)', border: '1px solid rgba(92,225,230,0.18)', borderRadius: '9px', padding: '0.85rem' }}>
                            <p style={{ fontSize: '0.74rem', color: '#5CE1E6', lineHeight: 1.55, margin: 0 }}>{info.clinicalImportance}</p>
                        </div>
                    </div>

                    <div style={divider} />

                    {/* Curiosidades */}
                    <div>
                        <p style={{ ...sectionLabel(), marginBottom: '0.5rem' }}>Datos Curiosos</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {info.curiosities.map((c, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.74rem' }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(0,255,209,0.45)', marginTop: 3, flexShrink: 0 }} />
                                    <p style={{ opacity: 0.8, lineHeight: 1.5, margin: 0 }}>{c}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analogía */}
                    <div style={{
                        background: 'linear-gradient(90deg, rgba(0,255,209,0.08), transparent)',
                        border: '1px solid rgba(0,255,209,0.18)', borderRadius: '10px', padding: '1rem',
                    }}>
                        <p style={{ ...sectionLabel('#00FFD1'), opacity: 0.45, marginBottom: '0.4rem' }}>Analogía</p>
                        <p style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.9, lineHeight: 1.55, margin: 0 }}>"{info.comparison}"</p>
                    </div>

                </div>
            </div>
        </div>
    )
}
