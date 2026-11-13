import type { CellType, ProcessType } from '../store/useStore'

export const cellProfiles: { id: CellType; name: string; description: string; disclaimer?: string }[] = [
  { id: 'animal', name: 'Célula animal', description: 'Modelo eucariota de referencia: organelos distribuidos en un volumen celular simplificado.' },
  { id: 'plant', name: 'Célula vegetal', description: 'Incluye pared celular, cloroplastos y una vacuola grande. Modelo comparativo esquemático.' },
  { id: 'neuron', name: 'Neurona', description: 'Visualización simplificada de soma, dendritas y axón; no representa proporciones anatómicas exactas.' },
  { id: 'hepatocyte', name: 'Hepatocito', description: 'Se enfatizan el metabolismo, las mitocondrias y el retículo endoplasmático.' },
  { id: 'muscle', name: 'Célula muscular', description: 'Se muestran estructuras contráctiles esquemáticas y su relación con la producción de ATP.' },
]

export type TourStep = { title: string; id: string; summary: string; anchor: [number, number, number] }
export const tourSteps: TourStep[] = [
  { title: 'Bienvenido al interior de la célula', id: 'Membrane', summary: 'La membrana plasmática delimita el espacio celular y regula el intercambio.', anchor: [4.7, 0, 0] },
  { title: 'Centro de información', id: 'Nucleus', summary: 'En el núcleo se almacena el ADN y se regula gran parte de la expresión genética.', anchor: [0, 0, 0] },
  { title: 'Síntesis de proteínas', id: 'Rough ER', summary: 'Los ribosomas asociados al RER participan en la síntesis de proteínas destinadas a secreción y membranas.', anchor: [1.5, -0.5, -1.5] },
  { title: 'Procesamiento y distribución', id: 'Golgi', summary: 'El aparato de Golgi modifica, clasifica y dirige productos celulares.', anchor: [-2, 1, -1] },
  { title: 'Energía para las actividades', id: 'Mitochondria', summary: 'Las mitocondrias participan en la producción de ATP mediante fosforilación oxidativa.', anchor: [2, 1, 2] },
  { title: 'Reciclaje intracelular', id: 'Lysosome', summary: 'Los lisosomas degradan y reciclan materiales; forman parte del sistema endomembranoso.', anchor: [1, -1, 1] },
]

export type QuizQuestion = { prompt: string; options: string[]; answer: string; explain: string; focus: string }
export const quizQuestions: QuizQuestion[] = [
  { prompt: '¿Qué orgánulo es esencial para la fosforilación oxidativa?', options: ['Lisosoma', 'Mitocondria', 'Aparato de Golgi', 'Centrosoma'], answer: 'Mitocondria', explain: 'La membrana mitocondrial interna aloja complejos de la cadena respiratoria.', focus: 'Mitochondria' },
  { prompt: '¿Qué estructura modifica y clasifica proteínas que llegan desde el RER?', options: ['Aparato de Golgi', 'Peroxisoma', 'Núcleo', 'Citoplasma'], answer: 'Aparato de Golgi', explain: 'El Golgi recibe proteínas y lípidos y los dirige hacia distintos destinos.', focus: 'Golgi' },
  { prompt: '¿Dónde se localiza la mayor parte del ADN nuclear?', options: ['Envoltura plasmática', 'Matriz mitocondrial', 'Núcleo', 'Lisosoma'], answer: 'Núcleo', explain: 'En células eucariotas el ADN nuclear se organiza en cromatina.', focus: 'Nucleus' },
  { prompt: '¿Qué orgánulo posee enzimas hidrolíticas activas en un ambiente ácido?', options: ['Centrosoma', 'RER', 'Lisosoma', 'REL'], answer: 'Lisosoma', explain: 'Los lisosomas contienen hidrolasas y mantienen su lumen ácido.', focus: 'Lysosome' },
  { prompt: '¿Qué estructura tiene ribosomas asociados a su superficie citosólica?', options: ['RER', 'REL', 'Membrana mitocondrial externa', 'Peroxisoma'], answer: 'RER', explain: 'Los ribosomas explican el aspecto rugoso del retículo endoplasmático.', focus: 'Rough ER' },
  { prompt: '¿Qué red participa en el transporte intracelular y la forma celular?', options: ['Citoesqueleto', 'Nucléolo', 'Cristas', 'Aparato de Golgi'], answer: 'Citoesqueleto', explain: 'Los microtúbulos, microfilamentos y filamentos intermedios forman el citoesqueleto.', focus: 'Cytoskeleton' },
]

export const processes: { id: ProcessType; title: string; subtitle: string; steps: string[] }[] = [
  { id: 'none', title: 'Sin simulación', subtitle: 'Explora la célula a tu ritmo.', steps: [] },
  { id: 'protein', title: 'Ruta de una proteína', subtitle: 'Animación conceptual de tráfico intracelular', steps: ['Síntesis en ribosomas del RER', 'Transporte vesicular al Golgi', 'Clasificación y destino de secreción'] },
  { id: 'atp', title: 'Producción de ATP', subtitle: 'Señales visuales esquemáticas, no moléculas a escala', steps: ['Entrada de sustratos energéticos', 'Metabolismo mitocondrial', 'Producción y uso de ATP'] },
  { id: 'endocytosis', title: 'Endocitosis', subtitle: 'Representación didáctica simplificada', steps: ['Contacto con membrana', 'Ingreso de material', 'Tránsito hacia compartimentos endosómicos'] },
]

export const clinicalContext = {
  healthy: { title: 'Célula de referencia', description: 'Representación general de una célula eucariota en condiciones basales.' },
  stress: { title: 'Estrés celular (esquema)', description: 'Se destacan orgánulos vinculados con respuestas celulares al estrés. No es un modelo diagnóstico ni una reconstrucción patológica a escala.' },
}

export const resources = [
  { title: 'OpenStax Biology 2e · Eukaryotic Cells', url: 'https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells' },
  { title: 'NCBI Bookshelf · Molecular Biology of the Cell', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26821/' },
  { title: 'OpenStax Biology 2e · Endomembrane System', url: 'https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins' },
]
