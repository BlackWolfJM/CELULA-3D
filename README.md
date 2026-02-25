# 🔬 Célula Animal 3D — Visualizador Científico Interactivo

Un proyecto personal que construí para explorar cómo llevar la biología celular al navegador usando tecnología 3D en tiempo real. La idea surgió de querer entender mejor cómo funciona una célula animal y, al mismo tiempo, practicar con React Three Fiber y Three.js.

> Puedes hacer clic en cualquier orgánulo, ver información científica detallada, cambiar modos de visualización y explorar el interior de la célula — todo en el navegador, sin instalar nada.

---

## ✨ Qué incluye

- **Orgánulos interactivos**: Membrana plasmática, Núcleo, Mitocondrias, Retículo Endoplasmático (rugoso y liso), Aparato de Golgi, Lisosomas, Peroxisomas, Centrosoma, Citoesqueleto y más.
- **Panel de información científica**: Al hacer clic en cualquier parte de la célula se abre una ficha técnica con nombre científico, función biológica, estructura interna, importancia clínica, curiosidades y analogías.
- **Diagramas moleculares vectoriales**: Cada orgánulo tiene su propio diagrama SVG científico generado en código.
- **Modos de visualización**:
  - 🧪 **Laboratorio** — vista oscura estándar
  - 🔬 **Microscopio** — estilo microscopio óptico
  - ⚡ **Fluorescencia** — colores de fluorescencia celular
- **Micro-Exploración**: botón para entrar físicamente al interior de la célula y verla desde adentro.
- **Animaciones biológicas**: rotación de orgánulos, partículas en el citoplasma, efecto de dimming al seleccionar.

---

## 🛠️ Tecnologías que usé

| Tecnología | Uso |
|---|---|
| [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) | Base de la aplicación |
| [Vite](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Renderizado 3D en React |
| [Three.js](https://threejs.org/) | Motor 3D subyacente |
| [@react-three/drei](https://github.com/pmndrs/drei) | Helpers (cámara, controles, efectos) |
| [Zustand](https://github.com/pmndrs/zustand) | Estado global (orgánulo seleccionado, modo, etc.) |
| [Lucide React](https://lucide.dev/) | Iconos del panel UI |
| [Maath](https://github.com/pmndrs/maath) | Interpolación suave de cámara |

---

## 🚀 Instalación y ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/celulas-3d.git
cd celulas-3d

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Luego abre tu navegador en **http://localhost:5173**

---

## 📦 Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos listos para subir a cualquier hosting (Netlify, Vercel, GitHub Pages, etc.).

Para pre-visualizar el build de producción localmente:

```bash
npm run preview
```

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── cell/              # Orgánulos 3D (uno por archivo)
│   │   ├── Scene.tsx      # Escena principal con todos los orgánulos
│   │   ├── Nucleus.tsx
│   │   ├── Mitochondria.tsx
│   │   ├── Golgi.tsx
│   │   ├── Reticulum.tsx
│   │   ├── Lysosomes.tsx
│   │   ├── Peroxisomes.tsx
│   │   ├── Centrosome.tsx
│   │   ├── Cytoskeleton.tsx
│   │   ├── Cytoplasm.tsx
│   │   ├── Membrane.tsx
│   │   ├── Vesicles.tsx
│   │   └── CameraController.tsx
│   └── ui/
│       ├── UI.tsx               # Interfaz completa (panel, controles, header)
│       └── OrganelleDiagrams.tsx # Diagramas SVG científicos por orgánulo
├── data/
│   └── organelleData.ts   # Base de datos científica de orgánulos
├── store/
│   └── useStore.ts        # Estado global con Zustand
└── index.css              # Estilos globales
```

---

## 🎮 Cómo usarlo

1. **Rotar la célula**: Clic sostenido + arrastrar
2. **Zoom**: Rueda del ratón
3. **Seleccionar orgánulo**: Clic sobre cualquier parte de la célula
4. **Cerrar panel**: Botón ✕ en la esquina superior del panel
5. **Cambiar modo**: Iconos en la esquina superior derecha (Laboratorio / Microscopio / Fluorescencia)
6. **Explorar interior**: Botón "Micro-Exploración" en la esquina inferior izquierda

---

## 📌 Notas

- El proyecto está pensado para **navegadores de escritorio** con soporte WebGL (Chrome, Firefox, Edge modernos).
- En móvil funciona, pero la experiencia es mejor en pantallas grandes.
- Toda la información científica está basada en fuentes de biología celular estándar.

---

*Hecho con curiosidad científica y demasiadas horas mirando mitocondrias en Three.js.*
