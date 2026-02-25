export interface OrganelleDetail {
    id: string
    name: string
    scientificName?: string
    whatIsIt: string
    function: {
        primary: string
        secondary: string[]
    }
    size: string
    colors: {
        main: string
        glow?: string
        secondary?: string
    }
    structure: string
    curiosities: string[]
    clinicalImportance: string
    comparison: string
    image?: string // Added image field
}

export const organelleData: Record<string, OrganelleDetail> = {
    Membrane: {
        id: 'Membrane',
        name: 'Membrana Plasmática',
        scientificName: 'Membrana celular / Plasmalema',
        whatIsIt: 'Bicapa lipídica que delimita la célula y regula el paso de sustancias.',
        size: '7–10 nm de grosor',
        colors: { main: '#6EC1E4', glow: '#00BFFF' },
        function: {
            primary: 'Transporte selectivo',
            secondary: ['Comunicación celular', 'Protección', 'Anclaje del citoesqueleto']
        },
        structure: 'Bicapa de fosfolípidos con proteínas integrales, colesterol y carbohidratos.',
        curiosities: ['Es fluida como el aceite', 'Se autorepara si se rompe levemente'],
        clinicalImportance: 'La fibrosis quística se debe a defectos en proteínas de transporte de la membrana.',
        comparison: 'Como la piel de la célula o el muro de seguridad de una fábrica.'
    },
    Cytoplasm: {
        id: 'Cytoplasm',
        name: 'Citoplasma',
        whatIsIt: 'Medio acuoso donde flotan los orgánulos.',
        size: 'Ocupa el ~70% del volumen celular',
        colors: { main: '#CFEFFF' },
        function: {
            primary: 'Soporte estructural',
            secondary: ['Reacciones metabólicas', 'Transporte interno']
        },
        structure: 'Citosol (agua, sales, proteínas) y el citoesqueleto.',
        curiosities: ['Las partículas se mueven por movimiento browniano', 'Donde ocurre la glucólisis'],
        clinicalImportance: 'Almacena enzimas críticas; su pH debe ser estable para la vida.',
        comparison: 'El caldo de una sopa o la gelatina de un postre.'
    },
    Nucleus: {
        id: 'Nucleus',
        name: 'Núcleo',
        scientificName: 'Nucleus',
        whatIsIt: 'Centro de control celular que alberga la información genética.',
        size: '5–10 µm de diámetro',
        colors: { main: '#6A5ACD', secondary: '#B19CD9' },
        function: {
            primary: 'Contiene el ADN',
            secondary: ['Controla la expresión genética', 'Replicación del ADN']
        },
        structure: 'Envoltura nuclear doble, poros nucleares y nucleoplasma.',
        curiosities: ['Si estiras el ADN de un solo núcleo, mediría 2 metros.', 'Es el orgánulo más visible al microscopio.'],
        clinicalImportance: 'Mutaciones en su ADN causan la mayoría de los cánceres.',
        comparison: 'El cerebro o la biblioteca principal de una ciudad.'
    },
    Mitochondria: {
        id: 'Mitochondria',
        name: 'Mitocondria',
        whatIsIt: 'Central energética de la célula.',
        size: '1–2 µm de longitud',
        colors: { main: '#FF6B35' },
        function: {
            primary: 'Producción de ATP',
            secondary: ['Respiración celular', 'Apoptosis (muerte celular programada)']
        },
        structure: 'Membrana externa, membrana interna plegada (crestas) y matriz.',
        curiosities: ['Tienen su propio ADN separado del núcleo.', 'Se heredan solo de la madre.'],
        clinicalImportance: 'Las enfermedades mitocondriales afectan órganos con alta demanda de energía.',
        comparison: 'Las centrales eléctricas o baterías de la célula.'
    },
    Golgi: {
        id: 'Golgi',
        name: 'Aparato de Golgi',
        whatIsIt: 'Sistema de cisternas membranosas apiladas.',
        colors: { main: '#F4C430' },
        size: 'Cisternas de 0.5 a 1.0 µm',
        function: {
            primary: 'Modificación y empaquetamiento de proteínas',
            secondary: ['Distribución de lípidos', 'Formación de lisosomas']
        },
        structure: 'Pilas de sacos aplanados llamados dictiosomas.',
        curiosities: ['Fue descubierto por Camillo Golgi usando tinción de plata.', 'Tiene una cara "Cis" (entrada) y una "Trans" (salida).'],
        clinicalImportance: 'Crucial en la secreción de insulina y hormonas.',
        comparison: 'El centro de distribución de Amazon.'
    },
    'Rough ER': {
        id: 'Rough ER',
        name: 'R.E. Rugoso',
        scientificName: 'Retículo Endoplasmático Rugoso',
        whatIsIt: 'Red de membranas con ribosomas incrustados.',
        colors: { main: '#2E8B57' },
        size: 'Extenso sistema membranoso',
        function: {
            primary: 'Producción de proteínas',
            secondary: ['Plegamiento proteico', 'Control de calidad']
        },
        structure: 'Sacos aplanados cubiertos de ribosomas.',
        curiosities: ['Está conectado directamente a la membrana nuclear.'],
        clinicalImportance: 'El estrés del RE está relacionado con el Alzheimer.',
        comparison: 'La línea de montaje de una fábrica.'
    },
    'Smooth ER': {
        id: 'Smooth ER',
        name: 'R.E. Liso',
        scientificName: 'Retículo Endoplasmático Liso',
        whatIsIt: 'Red de membranas tubulares sin ribosomas.',
        colors: { main: '#3CB371' },
        size: 'Variable según el tipo celular',
        function: {
            primary: 'Síntesis de lípidos',
            secondary: ['Detoxificación celular', 'Almacenamiento de calcio']
        },
        structure: 'Tubos ramificados interconectados.',
        curiosities: ['Es muy abundante en las células del hígado.'],
        clinicalImportance: 'Ayuda a eliminar toxinas y fármacos del cuerpo.',
        comparison: 'La planta de procesamiento químico o refinería.'
    },
    Lysosome: {
        id: 'Lysosome',
        name: 'Lisosoma',
        whatIsIt: 'Vesículas ácidas que contienen enzimas digestivas.',
        colors: { main: '#8B0000' },
        size: '0.1–1.2 µm',
        function: {
            primary: 'Digestión celular',
            secondary: ['Reciclaje de orgánulos', 'Destrucción de bacterias']
        },
        structure: 'Membrana sencilla con medio ácido (pH ~5).',
        curiosities: ['Se les llama el "estómago" de la célula.'],
        clinicalImportance: 'Su mal funcionamiento causa enfermedades de depósito.',
        comparison: 'El camión de la basura o el sistema de reciclaje.'
    },
    Peroxisome: {
        id: 'Peroxisome',
        name: 'Peroxisoma',
        whatIsIt: 'Orgánulos oxidativos que neutralizan toxinas.',
        colors: { main: '#6B8E23' },
        size: '0.1–1.0 µm',
        function: {
            primary: 'Detoxificación de peróxidos',
            secondary: ['Metabolismo de grasas', 'Eliminación del alcohol']
        },
        structure: 'Membrana única con contenido enzimático denso.',
        curiosities: ['Contienen catalasa para descomponer agua oxigenada.'],
        clinicalImportance: 'Vital para prevenir el daño celular por radicales libres.',
        comparison: 'La planta de tratamiento de residuos.'
    },
    Centrosome: {
        id: 'Centrosome',
        name: 'Centrosoma',
        whatIsIt: 'Centro organizador de microtúbulos.',
        size: '1 µm aprox.',
        colors: { main: '#A9A9A9' },
        function: {
            primary: 'Organización estructural',
            secondary: ['División celular', 'Huso mitótico']
        },
        structure: 'Dos centríolos en ángulo recto y material pericentriolar.',
        curiosities: ['Se duplica justo antes de que la célula se divida.'],
        clinicalImportance: 'Errores aquí causan células con número incorrecto de cromosomas.',
        comparison: 'El director de logística o jefe de obras.'
    }
}
