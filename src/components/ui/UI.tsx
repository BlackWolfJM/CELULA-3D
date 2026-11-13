import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import {
  Activity, Atom, BookOpen, Brain, Camera, Check, ChevronLeft, ChevronRight,
  CircleHelp, Download, EyeOff, FlaskConical, Focus, Home, Layers3,
  Maximize2, Menu, Microscope, Move3d, Pause, Play,
  RotateCcw, Search, Settings2, Share2, Sparkles,
  Split, X, ZoomIn, ZoomOut
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { CameraAction, CellType, ProcessType, ViewMode } from '../../store/useStore'
import { organelleData } from '../../data/organelleData'
import { getOrgDiagram } from './OrganelleDiagrams'
import { cellProfiles, clinicalContext, processes, quizQuestions, resources, tourSteps } from '../../data/learning'
import './UI.css'

type Tool = 'layers' | 'cut' | 'process' | 'tour' | 'quiz' | 'compare' | 'settings' | 'help' | null
type Level = 'basic' | 'advanced'

const groups: {label:string; ids:string[]}[] = [
  {label:'Envoltura y soporte',ids:['Membrane','Cytoplasm','Cytoskeleton']},
  {label:'Información y energía',ids:['Nucleus','Mitochondria','Centrosome']},
  {label:'Síntesis y transporte',ids:['Rough ER','Smooth ER','Golgi','Vesicle']},
  {label:'Degradación y metabolismo',ids:['Lysosome','Peroxisome','Inclusión Lipídica','Gránulo de Glucógeno']},
]
const extraGroups: Record<string,string[]> = {
  plant:['Cell Wall','Chloroplast','Central Vacuole'],
  neuron:['Axon'], hepatocyte:[], muscle:['Myofibril'], animal:[]
}
const focusLocations:Record<string,[number,number,number]>={
  Membrane:[4.7,0,0],Cytoplasm:[0,0,0],Cytoskeleton:[1,1,1],
  Nucleus:[0,0,0],Mitochondria:[2,1,2],Centrosome:[0,-1.8,0.5],
  'Rough ER':[1.5,-0.5,-1.5],'Smooth ER':[-1,2,1],Golgi:[-2,1,-1],
  Vesicle:[2,-1,1],Lysosome:[1,-1,1],Peroxisome:[-1,-1,-1],
  'Inclusión Lipídica':[1,-1,0],'Gránulo de Glucógeno':[2,0,0],
  'Cell Wall':[4.7,0,0],Chloroplast:[-3.1,2.3,1.1],
  'Central Vacuole':[1.6,0.2,-1],Axon:[6.8,0,0],Myofibril:[0,0,0.8]
}
const toolItems = [
  {id:'layers', label:'Capas',Icon:Layers3},
  {id:'cut',label:'Corte 3D',Icon:Split},
  {id:'process',label:'Simular',Icon:FlaskConical},
  {id:'tour',label:'Recorrido',Icon:BookOpen},
  {id:'quiz',label:'Evaluación',Icon:Brain},
  {id:'compare',label:'Comparar',Icon:Activity},
  {id:'settings',label:'Ajustes',Icon:Settings2},
] as const

function imageExport(cellType: CellType, selectedName: string | undefined, notify: (message:string)=>void) {
  const canvas=document.querySelector<HTMLCanvasElement>('.cell-canvas canvas, canvas.cell-canvas')
  if (!canvas || !canvas.width) {notify('No se pudo acceder a la escena 3D.');return}
  try {
    const output=document.createElement('canvas')
    const ratio=Math.min(1,3200/Math.max(canvas.width,canvas.height))
    output.width=Math.round(canvas.width*ratio)
    output.height=Math.round(canvas.height*ratio)
    const ctx=output.getContext('2d')
    if (!ctx) {notify('Tu navegador no permite exportar la imagen.');return}
    ctx.drawImage(canvas,0,0,output.width,output.height)
    const h=Math.max(58,output.height*0.105)
    ctx.fillStyle='rgba(5,15,25,0.8)'
    ctx.fillRect(0,output.height-h,output.width,h)
    ctx.fillStyle='#eaf6fc'
    ctx.font='600 '+Math.max(18,Math.round(output.width*0.020))+'px sans-serif'
    ctx.fillText('CELULA-3D',Math.max(20,output.width*0.025),output.height-h*0.46)
    ctx.fillStyle='#8ccbd1'
    ctx.font=Math.max(12,Math.round(output.width*0.011))+'px sans-serif'
    ctx.fillText((selectedName || cellProfiles.find(p=>p.id===cellType)?.name || '')+' · Representación didáctica, no a escala',Math.max(20,output.width*0.025),output.height-h*0.17)
    output.toBlob(blob=>{
      if (!blob) {notify('No se pudo generar el PNG.');return}
      const url=URL.createObjectURL(blob)
      const link=document.createElement('a')
      link.href=url;link.download='celula-3d-'+cellType+'.png'
      document.body.appendChild(link);link.click();link.remove()
      window.setTimeout(()=>URL.revokeObjectURL(url),5000)
      notify('Imagen PNG exportada.')
    },'image/png')
  } catch {notify('La imagen no se pudo exportar.')}
}

export const UI = () => {
  const {
    selectedOrganelle, setSelectedOrganelle, hoveredOrganelle, mode, setMode,
    cellType, setCellType, internalView, setInternalView, condition, setCondition,
    simulation, setSimulation, simulationPlaying, setSimulationPlaying,
    quality, setQuality, visibleOrganelles, setOrganelleVisible, setAllVisible,
    labelsVisible, setLabelsVisible, fluorescenceChannels, setFluorescenceChannel,
    cutEnabled, setCutEnabled, cutAxis, setCutAxis, cutDepth, setCutDepth, requestCamera
  } = useStore()
  const [sidebarOpen,setSidebarOpen] = useState(()=>typeof window==='undefined' ? true : window.innerWidth>=900)
  const [tool,setTool] = useState<Tool>(null)
  const [query,setQuery] = useState('')
  const [level,setLevel] = useState<Level>('basic')
  const [tourIndex,setTourIndex] = useState(0)
  const [quizIndex,setQuizIndex] = useState(0)
  const [answers,setAnswers] = useState<{choice:string;correct:boolean}[]>([])
  const [toast,setToast] = useState('')
  const [showReferences,setShowReferences] = useState(false)
  const selectedInfo = selectedOrganelle ? organelleData[selectedOrganelle] : null
  const profile=cellProfiles.find(p=>p.id===cellType) ?? cellProfiles[0]
  const ids=useMemo(()=>groups.flatMap(g=>g.ids).concat(extraGroups[cellType]).filter(id=>{
    const data=organelleData[id]
    return data && (data.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')) ||
      id.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  }),[query,cellType])

  useEffect(()=>{
    if (!toast) return
    const timer=window.setTimeout(()=>setToast(''),3200)
    return ()=>window.clearTimeout(timer)
  },[toast])
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if (e.key==='Escape') { setTool(null); setSelectedOrganelle(null) }
    }
    document.addEventListener('keydown',onKey)
    return ()=>document.removeEventListener('keydown',onKey)
  },[setSelectedOrganelle])
  useEffect(()=>{
    if (tool !== 'tour') return
    const step=tourSteps[tourIndex]
    if (step) setSelectedOrganelle(step.id,new THREE.Vector3(...step.anchor))
  },[tool,tourIndex,setSelectedOrganelle])
  const focus=(id:string)=>{
    setSelectedOrganelle(id,new THREE.Vector3(...(focusLocations[id]||[0,0,0])))
    if (window.innerWidth<800) setSidebarOpen(false)
  }
  const toggleTool=(name:Tool)=>{
    setTool(prev=>prev===name?null:name)
    if (name) setSidebarOpen(false)
    if (name==='tour') {setTourIndex(0);setCellType('animal')}
  }
  const home=()=>{setSelectedOrganelle(null);setInternalView(false);requestCamera('home')}
  const resetAll=()=>{
    setTool(null);setSimulation('none');setCondition('healthy');setCutEnabled(false);
    setAllVisible(true);setLabelsVisible(true);setMode('dark');home();setToast('Vista restaurada.')
  }
  const selectQuizAnswer=(choice:string)=>{
    if (answers[quizIndex]) return
    const correct=choice===quizQuestions[quizIndex].answer
    setAnswers(prev=>[...prev,{choice,correct}])
  }
  const restartQuiz=()=>{setQuizIndex(0);setAnswers([])}
  const share=async()=>{
    try {await navigator.clipboard.writeText(window.location.href);setToast('Enlace copiado al portapapeles.')}
    catch {setToast('Copia la URL desde la barra del navegador.')}
  }
  const doCamera=(action:CameraAction)=>requestCamera(action)
  const score=answers.filter(a=>a.correct).length
  const quiz=quizQuestions[quizIndex]

  return <div className="app-overlay">
    <a className="skip-link" href="#cell-explorer">Ir a los controles de exploración</a>
    <header className="app-topbar">
      <div className="app-brand">
        <div className="brand-icon"><Atom size={23} strokeWidth={1.8}/></div>
        <div><strong>CELULA<span>-3D</span></strong><small>Laboratorio celular interactivo</small></div>
      </div>
      <div className="topbar-context">
        <span className="status-light"/><span className="desktop-only">MODELO INTERACTIVO</span>
        <select aria-label="Tipo de célula" value={cellType} onChange={e=>setCellType(e.target.value as CellType)}>
          {cellProfiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn" onClick={()=>setSidebarOpen(v=>!v)} aria-label={sidebarOpen?'Ocultar explorador':'Mostrar explorador'} title="Explorador"><Menu size={18}/><span className="desktop-only">Explorar</span></button>
        <button className="topbar-btn" onClick={()=>toggleTool('help')} title="Ayuda" aria-label="Abrir ayuda"><CircleHelp size={18}/></button>
        <button className="topbar-btn topbar-share" onClick={share} title="Copiar enlace"><Share2 size={18}/><span className="desktop-only">Compartir</span></button>
      </div>
    </header>

    <aside id="cell-explorer" className={'explorer-panel'+(sidebarOpen?' is-open':'')} aria-label="Explorador de orgánulos">
      <div className="panel-heading"><div><span className="eyebrow">EXPLORACIÓN</span><h2>Componentes celulares</h2></div><button className="ghost-icon mobile-close" title="Cerrar explorador" aria-label="Cerrar explorador" onClick={()=>setSidebarOpen(false)}><X size={17}/></button></div>
      <div className="search-wrap"><Search size={16}/><input placeholder="Buscar orgánulos..." aria-label="Buscar orgánulos" value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button className="ghost-icon" aria-label="Limpiar búsqueda" onClick={()=>setQuery('')}><X size={14}/></button>}</div>
      <div className="explorer-scroll">
        {groups.concat(extraGroups[cellType].length?[{label:'Especialización celular',ids:extraGroups[cellType]}]:[]).map(group=>{
          const entries=group.ids.filter(id=>ids.includes(id))
          if (!entries.length) return null
          return <section className="org-group" key={group.label}>
            <div className="group-title">{group.label}<span>{entries.length}</span></div>
            {entries.map(id=>{
              const org=organelleData[id]
              return <button className={'org-row'+(selectedOrganelle===id?' is-selected':'')} key={id} onClick={()=>focus(id)} aria-label={'Enfocar '+org.name}>
                <span className="org-dot" style={{background:org.colors.main,boxShadow:'0 0 10px '+org.colors.main+'55'}}/>
                <span className="org-name">{org.name}</span>
                {visibleOrganelles[id]===false?<EyeOff size={15} className="muted"/>:<ChevronRight size={15} className="muted"/>}
              </button>
            })}
          </section>
        })}
        {ids.length===0 && <p className="empty-note">No se encontraron estructuras con ese nombre.</p>}
      </div>
      <div className="explorer-footer">
        <span className="eyebrow">HERRAMIENTAS</span>
        <div className="tool-grid">
          {toolItems.map(({id,label,Icon})=><button key={id} onClick={()=>toggleTool(id)} title={label}
            className={'tool-tile'+(tool===id?' is-active':'')} aria-pressed={tool===id}><Icon size={19}/><span>{label}</span></button>)}
        </div>
        <p className="micro-disclaimer">{profile.description}</p>
      </div>
    </aside>

    <div className={'scene-title'+(sidebarOpen?' with-sidebar':'')} aria-hidden="true">
      <span className="eyebrow">VISUALIZACIÓN 3D EN TIEMPO REAL</span>
      <strong>{profile.name}</strong>
      <small>Modelo educativo esquemático · No a escala</small>
      {hoveredOrganelle && <span className="hover-chip">{organelleData[hoveredOrganelle]?.name||hoveredOrganelle}</span>}
    </div>

    <div className={'scene-toolbar'+(selectedInfo?' has-detail':'')} aria-label="Controles de cámara">
      <button aria-label="Vista frontal" title="Vista frontal" onClick={()=>doCamera('front')}><Focus size={17}/></button>
      <button aria-label="Vista superior" title="Vista superior" onClick={()=>doCamera('top')}><Move3d size={17}/></button>
      <button aria-label="Acercar" title="Acercar" onClick={()=>doCamera('zoomIn')}><ZoomIn size={17}/></button>
      <button aria-label="Alejar" title="Alejar" onClick={()=>doCamera('zoomOut')}><ZoomOut size={17}/></button>
      <button aria-label="Restablecer cámara" title="Restablecer cámara" onClick={home}><Home size={17}/></button>
    </div>

    <div className="bottom-toolbar">
      <div className="mode-buttons" role="group" aria-label="Modo de visualización">
        {([
          {id:'dark',Icon:Activity,label:'Laboratorio'},
          {id:'microscope',Icon:Microscope,label:'Microscopio'},
          {id:'fluorescence',Icon:Sparkles,label:'Fluorescencia'}
        ] as const).map(({id,Icon,label})=><button key={id} className={mode===id?'active':''} onClick={()=>setMode(id as ViewMode)} title={label} aria-pressed={mode===id}><Icon size={16}/><span>{label}</span></button>)}
      </div>
      <div className="bottom-extras">
        <button className={'subtle-btn'+(internalView?' highlighted':'')} onClick={()=>setInternalView(!internalView)} aria-pressed={internalView} title="Entrar o salir de la célula"><Maximize2 size={17}/><span className="desktop-only">{internalView?'Salir de la célula':'Microexploración'}</span></button>
        <button className="subtle-btn" onClick={()=>imageExport(cellType,selectedInfo?.name,setToast)} title="Exportar imagen PNG"><Camera size={17}/><span className="desktop-only">Capturar</span></button>
      </div>
    </div>

    {selectedInfo && <aside className="detail-panel" aria-label={'Información sobre '+selectedInfo.name}>
      <div className="detail-header">
        <div><span className="eyebrow">ATLAS DE BIOLOGÍA CELULAR</span><strong>Ficha científica</strong></div>
        <button className="ghost-icon" aria-label="Cerrar ficha" title="Cerrar" onClick={()=>setSelectedOrganelle(null)}><X size={20}/></button>
      </div>
      <div className="detail-scroll">
        <div className="diagram-card">{getOrgDiagram(selectedInfo.id)}<span className="diagram-badge">ILUSTRACIÓN ESQUEMÁTICA</span></div>
        <div className="detail-name"><span className="eyebrow">ESTRUCTURA SELECCIONADA</span><h2>{selectedInfo.name}</h2>{selectedInfo.scientificName && <p>{selectedInfo.scientificName}</p>}</div>
        <div className="level-switch" role="group" aria-label="Nivel científico">
          <button className={level==='basic'?'active':''} onClick={()=>setLevel('basic')}>Básico</button>
          <button className={level==='advanced'?'active':''} onClick={()=>setLevel('advanced')}>Universitario</button>
        </div>
        <div className="info-stat-grid"><div><small>TAMAÑO / ESCALA</small><strong>{selectedInfo.size}</strong></div><div><small>CATEGORÍA</small><strong>Estructura celular</strong></div></div>
        <section className="info-section"><h3><span className="section-bullet"/>¿Qué es?</h3><p>{selectedInfo.whatIsIt}</p></section>
        <section className="info-section"><h3><span className="section-bullet"/>Función principal</h3><p className="accent-paragraph">{selectedInfo.function.primary}</p>
          {level==='advanced' && <ul>{selectedInfo.function.secondary.map((fn,i)=><li key={i}>{fn}</li>)}</ul>}
        </section>
        {level==='advanced' && <>
          <section className="info-section"><h3><span className="section-bullet"/>Organización estructural</h3><p>{selectedInfo.structure}</p></section>
          <section className="info-section"><h3><span className="section-bullet"/>Relación clínica</h3><p>{selectedInfo.clinicalImportance}</p></section>
          <section className="info-section"><h3><span className="section-bullet"/>Datos de interés</h3><ul>{selectedInfo.curiosities.map((c,i)=><li key={i}>{c}</li>)}</ul></section>
        </>}
        {level==='basic' && <div className="analogy"><span className="eyebrow">PARA RECORDAR</span><p>{selectedInfo.comparison}</p></div>}
        <button className="link-row" onClick={()=>setShowReferences(v=>!v)} aria-expanded={showReferences}><BookOpen size={16}/> Bibliografía de referencia <ChevronRight size={16} style={{transform:showReferences?'rotate(90deg)':undefined}}/></button>
        {showReferences && <div className="reference-list">{resources.map(r=><a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">{r.title} ↗</a>)}<small>Fuentes generales; cada afirmación requiere validación especializada antes de uso académico formal.</small></div>}
      </div>
      <div className="detail-footer"><button className="outline-btn" onClick={()=>imageExport(cellType,selectedInfo.name,setToast)}><Download size={16}/> Exportar vista</button><button className="accent-btn" onClick={()=>setSelectedOrganelle(null)}>Volver al modelo</button></div>
    </aside>}

    {tool && <section className={'floating-tool tool-'+tool} aria-label="Panel de herramienta">
      <div className="floating-head"><span className="eyebrow">HERRAMIENTA ACTIVA</span><button className="ghost-icon" onClick={()=>setTool(null)} aria-label="Cerrar herramienta"><X size={18}/></button></div>
      {tool==='layers' && <>
        <h2>Capas y visibilidad</h2><p className="tool-desc">Aísla los componentes para inspeccionar la arquitectura celular.</p>
        <div className="tool-actions"><button onClick={()=>setAllVisible(true)}>Mostrar todo</button><button onClick={()=>setAllVisible(false)}>Ocultar todo</button></div>
        <label className="switch-row"><span>Etiquetas flotantes</span><input type="checkbox" checked={labelsVisible} onChange={e=>setLabelsVisible(e.target.checked)}/></label>
        <div className="tool-list">{groups.flatMap(g=>g.ids).concat(extraGroups[cellType]).filter((id,i,a)=>a.indexOf(id)===i).map(id=><label key={id} className="switch-row">
          <span>{organelleData[id]?.name||id}</span><input type="checkbox" checked={visibleOrganelles[id]!==false} onChange={e=>setOrganelleVisible(id,e.target.checked)}/>
        </label>)}</div>
      </>}
      {tool==='cut' && <>
        <h2>Cortes 3D</h2><p className="tool-desc">Secciona la geometría en tiempo real para explorar las estructuras internas.</p>
        <label className="switch-row emphasized"><span>Activar corte</span><input type="checkbox" checked={cutEnabled} onChange={e=>setCutEnabled(e.target.checked)}/></label>
        <span className="form-label">PLANO DE CORTE</span>
        <div className="segmented">{([['x','Sagital'],['y','Transversal'],['z','Frontal']] as const).map(([axis,label])=><button key={axis} className={cutAxis===axis?'active':''} onClick={()=>{setCutAxis(axis);setCutEnabled(true)}}>{label}</button>)}</div>
        <label className="range-label" htmlFor="cut-depth">Desplazamiento del plano <strong>{cutDepth.toFixed(1)}</strong></label>
        <input id="cut-depth" type="range" min="-4.5" max="4.5" step="0.1" value={cutDepth} onChange={e=>{setCutDepth(Number(e.target.value));setCutEnabled(true)}}/>
        <p className="fineprint">Plano de clipping geométrico. Las superficies seccionadas no tienen tapas anatómicas; no es una preparación histológica.</p>
        <button className="outline-btn full-width" onClick={()=>{setCutEnabled(false);setCutDepth(0)}}><RotateCcw size={16}/> Restablecer corte</button>
      </>}
      {tool==='process' && <>
        <h2>Simulador de procesos</h2><p className="tool-desc">Visualiza rutas de movimiento simplificadas con partículas dinámicas.</p>
        <div className="process-picks">{processes.filter(p=>p.id!=='none').map((p,i)=><button key={p.id} className={simulation===p.id?'selected':''} onClick={()=>setSimulation(p.id as ProcessType)}>
          <span className="process-number">0{i+1}</span><span><strong>{p.title}</strong><small>{p.subtitle}</small></span><ChevronRight size={16}/>
        </button>)}</div>
        {simulation!=='none' && <div className="process-steps"><span className="eyebrow">SECUENCIA CONCEPTUAL</span><ol>{processes.find(p=>p.id===simulation)?.steps.map(s=><li key={s}>{s}</li>)}</ol>
          <div className="tool-actions"><button className="accent-btn" onClick={()=>setSimulationPlaying(!simulationPlaying)}>{simulationPlaying?<Pause size={16}/>:<Play size={16}/>} {simulationPlaying?'Pausar':'Reanudar'}</button><button onClick={()=>setSimulation('none')}><X size={16}/> Detener</button></div>
        </div>}
        <p className="fineprint">Las partículas representan conceptos, no moléculas ni trayectorias medidas experimentalmente.</p>
      </>}
      {tool==='tour' && <>
        <h2>Recorrido guiado</h2>
        <div className="tour-progress"><span>PASO {tourIndex+1} DE {tourSteps.length}</span><div><i style={{width:((tourIndex+1)/tourSteps.length*100)+'%'}}/></div></div>
        <div className="tour-feature"><span className="tour-step-icon"><BookOpen size={25}/></span><h3>{tourSteps[tourIndex].title}</h3><p>{tourSteps[tourIndex].summary}</p></div>
        <p className="fineprint">La cámara enfoca el orgánulo de cada estación. Puedes rotar y explorar entre pasos.</p>
        <div className="tour-navigation"><button disabled={tourIndex===0} onClick={()=>setTourIndex(x=>Math.max(0,x-1))}><ChevronLeft size={17}/> Anterior</button>
          {tourIndex<tourSteps.length-1?<button className="accent-btn" onClick={()=>setTourIndex(x=>x+1)}>Siguiente <ChevronRight size={17}/></button>:<button className="accent-btn" onClick={()=>{setTool(null);home()}}><Check size={17}/> Terminar</button>}
        </div>
      </>}
      {tool==='quiz' && <>
        <h2>Evalúa tus conocimientos</h2>
        <div className="tour-progress"><span>PREGUNTA {quizIndex+1} DE {quizQuestions.length}</span><div><i style={{width:(answers.length/quizQuestions.length*100)+'%'}}/></div></div>
        {quizIndex<quizQuestions.length && <><h3 className="quiz-question">{quiz.prompt}</h3>
          <div className="quiz-options">{quiz.options.map((opt,i)=><button key={opt} disabled={!!answers[quizIndex]}
            className={answers[quizIndex] ? (opt===quiz.answer?'correct':opt===answers[quizIndex].choice?'incorrect':'') : ''}
            onClick={()=>selectQuizAnswer(opt)}><span>{String.fromCharCode(65+i)}</span>{opt}</button>)}</div>
          {answers[quizIndex] && <div className={'quiz-feedback'+(answers[quizIndex].correct?' good':' bad')}><strong>{answers[quizIndex].correct?'¡Correcto!':'Respuesta: '+quiz.answer}</strong><p>{quiz.explain}</p><button className="inline-link" onClick={()=>focus(quiz.focus)}>Ver estructura en 3D <ChevronRight size={14}/></button></div>}
          {answers[quizIndex] && <button className="accent-btn full-width" onClick={()=>{if(quizIndex<quizQuestions.length-1)setQuizIndex(x=>x+1);else setQuizIndex(quizQuestions.length)}}>{quizIndex<quizQuestions.length-1?'Siguiente pregunta':'Ver resultados'} <ChevronRight size={16}/></button>}
        </>}
        {quizIndex===quizQuestions.length && <div className="quiz-score"><Brain size={34}/><strong>{score} / {quizQuestions.length}</strong><p>{score===quizQuestions.length?'¡Excelente dominio!':'Repasa las fichas y prueba de nuevo.'}</p><button className="accent-btn full-width" onClick={restartQuiz}><RotateCcw size={16}/> Repetir evaluación</button></div>}
      </>}
      {tool==='compare' && <>
        <h2>Exploración comparativa</h2><p className="tool-desc">Compara un modelo de referencia con una visualización didáctica de estrés celular.</p>
        <div className="compare-buttons"><button className={condition==='healthy'?'selected':''} onClick={()=>setCondition('healthy')}><Check size={19}/> Referencia</button>
          <button className={condition==='stress'?'selected':''} onClick={()=>setCondition('stress')}><Activity size={19}/> Estrés celular</button></div>
        <div className="feature-card"><strong>{clinicalContext[condition].title}</strong><p>{clinicalContext[condition].description}</p></div>
        <p className="fineprint">El color resalta componentes con fines de enseñanza. No representa enfermedades específicas, cuantificación ni diagnóstico.</p>
      </>}
      {tool==='settings' && <>
        <h2>Preferencias</h2><p className="tool-desc">Personaliza la calidad visual, canales de fluorescencia y rotulación.</p>
        <label className="form-label" htmlFor="graphic-quality">CALIDAD GRÁFICA</label>
        <select id="graphic-quality" value={quality} onChange={e=>setQuality(e.target.value as 'low'|'medium'|'high')} className="panel-select"><option value="low">Baja · mayor fluidez</option><option value="medium">Media · equilibrada</option><option value="high">Alta · más detalle</option></select>
        <label className="switch-row"><span>Mostrar etiquetas</span><input type="checkbox" checked={labelsVisible} onChange={e=>setLabelsVisible(e.target.checked)}/></label>
        <span className="form-label">CANALES DE FLUORESCENCIA</span>
        {([['nucleus','Núcleo'],['mitochondria','Mitocondrias'],['membrane','Membrana']] as const).map(([id,label])=><label key={id} className="switch-row"><span>{label}</span><input type="checkbox" checked={fluorescenceChannels[id]} onChange={e=>{setFluorescenceChannel(id,e.target.checked);setMode('fluorescence')}}/></label>)}
        <button className="outline-btn full-width" onClick={resetAll}><RotateCcw size={16}/> Restaurar preferencias</button>
        <p className="fineprint">Calidad baja desactiva algunos efectos y partículas para equipos menos potentes.</p>
      </>}
      {tool==='help' && <>
        <h2>Cómo explorar</h2>
        <div className="help-list"><p><strong>Rotar</strong> Arrastra con el botón izquierdo o con un dedo.</p>
          <p><strong>Zoom</strong> Usa la rueda, el gesto de pellizco o los botones +/−.</p>
          <p><strong>Enfocar</strong> Selecciona un orgánulo del listado o directamente en el modelo 3D.</p>
          <p><strong>Cerrar</strong> Pulsa Esc para cerrar la herramienta y la ficha.</p>
          <p><strong>Recorridos</strong> Usa el modo de visita guiada para aprender paso a paso.</p></div>
        <p className="fineprint">Modelos didácticos simplificados y no a escala. Las simulaciones muestran procesos conceptuales.</p>
        <button className="accent-btn full-width" onClick={()=>toggleTool('tour')}>Empezar recorrido <ChevronRight size={16}/></button>
      </>}
    </section>}
    {toast && <div className="app-toast" role="status"><Check size={15}/>{toast}</div>}
    <div className="version-stamp">CELULA-3D <span>·</span> BETA CIENTÍFICA</div>
  </div>
}
