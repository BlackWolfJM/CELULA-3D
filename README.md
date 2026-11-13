# CELULA-3D · Laboratorio celular interactivo

Explora, aprende y experimenta con un modelo didáctico de biología celular en 3D. Construido con React, TypeScript, Vite, Three.js y React Three Fiber.

**Versión pública:** https://blackwolfjm.github.io/CELULA-3D/

## Funcionalidades

- Interfaz científica renovada, adaptable a pantalla grande, tablet y móvil.
- Explorador con búsqueda de orgánulos, fichas y diagramas vectoriales.
- Visualización **Laboratorio / Microscopio / Fluorescencia** y canales de fluorescencia seleccionables.
- Cámara con vistas predefinidas, zoom, enfoque de estructuras y entrada a la célula.
- Capas de visibilidad, rótulos flotantes y cortes tridimensionales con tres orientaciones.
- Cinco perfiles comparativos: célula animal, vegetal, neurona, hepatocito y célula muscular.
- Tres simulaciones **conceptuales**: ruta de proteínas, producción de ATP y endocitosis.
- Recorrido educativo por seis estructuras, evaluación de seis preguntas y dos niveles de fichas.
- Comparación didáctica entre un estado de referencia y una visualización de estrés celular.
- Captura PNG con rótulo científico, controles de calidad gráfica y enlace para compartir.
- Biblioteca de referencias y avisos sobre límites del modelo.

## Precisión científica

**Atención:** el modelo es una *representación pedagógica no a escala*. Las posiciones, cantidades, movimientos y colores de los orgánulos son simplificaciones y no se deben interpretar como mediciones de una célula real. El estado de estrés celular es una visualización conceptual, no un diagnóstico ni la simulación de una enfermedad específica. Los modos de microscopía y fluorescencia **no** reproducen datos experimentales reales.

Para revisar conceptos: [OpenStax Biology 2e](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells) y [NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/).

## Desarrollo

Requiere Node.js 22 o superior para reproducir el entorno de compilación.

```bash
git clone https://github.com/BlackWolfJM/CELULA-3D.git
cd CELULA-3D
npm ci
npm run dev
```

La versión de producción se compila con:

```bash
npm run build
npm run preview
```

El resultado está en `dist/`. El flujo `.github/workflows/deploy.yml` publica el sitio con GitHub Pages en cada actualización de `main`. Las propuestas se verifican con `.github/workflows/ci.yml`.

## Organización

- `src/components/cell/`: modelos y escenas WebGL.
- `src/components/ui/UI.tsx`: interfaz, fichas y herramientas de exploración.
- `src/components/ui/UI.css`: estilos y adaptación móvil.
- `src/data/organelleData.ts`: información de estructuras celulares.
- `src/data/learning.ts`: rutas, simulaciones, perfiles, preguntas y fuentes.
- `src/store/useStore.ts`: estado compartido entre el 3D y los controles.

## Controles

Arrastra para rotar, usa el desplazamiento del ratón para hacer zoom y selecciona una estructura para enfocar su ficha. También puedes usar los botones de cámara. Pulsa **Esc** para cerrar una herramienta o la ficha. En móvil se admiten gestos táctiles en el canvas.

## Licencias y créditos

Proyecto: **BlackWolfJM**. Tecnologías: React, Three.js, React Three Fiber, Drei, Zustand, Maath y Lucide.
