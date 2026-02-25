# 🔬 Célula Animal 3D — Visualizador Científico Interactivo

![Célula Animal 3D](./public/cell-render.png)

Un proyecto personal que construí para explorar cómo llevar la biología celular al navegador usando tecnología 3D en tiempo real. La idea surgió de querer entender mejor cómo funciona una célula animal y, al mismo tiempo, practicar con React Three Fiber y Three.js.

> Puedes seleccionar orgánulos, explorar el interior de la célula, hacer zoom hasta el mínimo detalle y cambiar modos de visualización — todo en el navegador, sin instalar nada.

---

## ✨ Qué incluye

### 🧬 Orgánulos 3D
Membrana plasmática, Núcleo, Mitocondrias, Retículo Endoplasmático (rugoso y liso), Aparato de Golgi, Lisosomas, Peroxisomas, Centrosoma, Citoesqueleto, Vesículas y más.

### 📋 Panel lateral dinámico (izquierda)
El panel izquierdo alterna entre dos vistas dentro del mismo espacio:
- **Vista de lista** — todos los orgánulos con nombre científico e icono de color
- **Vista de ficha** — al hacer clic en un orgánulo, el mismo panel se transforma y muestra:
  - Diagrama SVG científico
  - Función biológica y funciones secundarias
  - Estructura interna
  - Importancia clínica
  - Datos curiosos y analogías

Volver a la lista con `‹ Lista` o con `✕`, sin que la escena 3D se achique en ningún momento.

### 🎯 Auto-zoom al orgánulo
Al seleccionar un orgánulo (desde la lista o haciendo clic en el modelo 3D), la cámara hace zoom automáticamente hacia él con una animación suave. Al deseleccionar, la cámara regresa a la vista general.

### 🖱 Modo de Exploración Libre
Botón en la esquina inferior izquierda que desactiva la selección de orgánulos:
- 👁 **Interactivo** — clic en la célula muestra su ficha de información
- 🖱 **Exploración Libre** — los clics no activan nada; zoom, rotación y paneo libres sin interrupciones

### 🔍 Modos de visualización (esquina superior derecha)
| Icono | Modo | Descripción |
|---|---|---|
| ⚡ | **Laboratorio** | Vista oscura estándar (por defecto) |
| 🔬 | **Microscopio** | Estilo microscopio óptico |
| ⚡ | **Fluorescencia** | Colores de fluorescencia celular |

### 🔭 Micro-Exploración
Botón en la esquina inferior izquierda para entrar físicamente al interior de la célula y verla desde adentro con un campo de visión ampliado.

### 🎨 Identidad visual
- **Logo SVG animado** con orgánulos orbitantes integrado en el header
- **Favicon personalizado** (`cell-favicon.svg`) visible en la pestaña del navegador
- **Líneas decorativas** con gradiente y glow que enmarcan la interfaz

### 🎞 Animaciones biológicas
- Flotación y rotación de orgánulos
- Partículas de ATP en las mitocondrias
- Efecto de dimming al seleccionar un orgánulo
- Transiciones suaves de la cámara con `maath easing`

---

## 🛠️ Tecnologías que usé

| Tecnología | Uso |
|---|---|
| [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) | Base de la aplicación |
| [Vite](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Renderizado 3D en React |
| [Three.js](https://threejs.org/) | Motor 3D subyacente |
| [@react-three/drei](https://github.com/pmndrs/drei) | Helpers (cámara, controles, efectos) |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | Bloom, Vignette, ChromaticAberration |
| [Zustand](https://github.com/pmndrs/zustand) | Estado global (orgánulo, modo, interactividad) |
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
│   │   ├── CameraController.tsx  # Auto-zoom y animación de cámara
│   │   ├── Nucleus.tsx
│   │   ├── Mitochondria.tsx
│   │   ├── Golgi.tsx
│   │   ├── Reticulum.tsx
│   │   ├── Lysosomes.tsx
│   │   ├── Centrosome.tsx
│   │   ├── Cytoskeleton.tsx
│   │   ├── Cytoplasm.tsx
│   │   ├── Membrane.tsx
│   │   └── Vesicles.tsx
│   └── ui/
│       ├── UI.tsx               # Interfaz completa (header, modos, botones)
│       ├── OrganelleMenu.tsx    # Panel lateral dinámico lista ↔ ficha
│       └── OrganelleDiagrams.tsx # Diagramas SVG científicos por orgánulo
├── data/
│   └── organelleData.ts   # Base de datos científica de orgánulos
├── store/
│   └── useStore.ts        # Estado global con Zustand
├── index.css              # Estilos globales
public/
└── cell-favicon.svg       # Favicon personalizado
```

---

## 🎮 Cómo usarlo

| Acción | Cómo |
|---|---|
| Rotar la célula | Clic sostenido + arrastrar |
| Zoom | Rueda del ratón (rango: muy cercano ↔ alejado) |
| Seleccionar orgánulo | Clic sobre la célula **o** clic en la lista izquierda |
| Ver información | Se abre automáticamente en el panel izquierdo |
| Cerrar ficha | Botón `‹ Lista` o `✕` en el panel |
| Exploración libre | Botón 🖱 **Exploración Libre** (abajo a la izquierda) |
| Volver a interactivo | Mismo botón, ahora dice 👁 **Interactivo** |
| Entrar a la célula | Botón **Micro-Exploración** (abajo a la izquierda) |
| Cambiar modo visual | Iconos en la esquina superior derecha |

---

## 📌 Notas

- Pensado para **navegadores de escritorio** con soporte WebGL (Chrome, Firefox, Edge modernos).
- En móvil funciona, pero la experiencia es mejor en pantallas grandes.
- Toda la información científica está basada en fuentes de biología celular estándar.

---

*Hecho con curiosidad científica y demasiadas horas mirando mitocondrias en Three.js.*
