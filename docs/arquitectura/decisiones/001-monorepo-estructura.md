# ADR-001: Estructura del proyecto como monorepo

## Datos básicos

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-05-01 |
| **Estado** | ✅ Aceptado |
| **Decisión final** | Organizar frontend y backend en un solo repositorio |
| **Responsable** | Equipo de desarrollo |

## Contexto

El proyecto requiere dos componentes principales:

1. **Frontend** - Aplicación Ionic React para web y Android
2. **Backend** - API REST con Node.js + Express + MongoDB

Se necesita decidir cómo organizar el código fuente.

## Opciones consideradas

### Opción A: Monorepo (una carpeta, dos subcarpetas)

```
app-attendance/
├── app/ # Frontend
├── back/ # Backend
└── docker-compose.yml
```

**Ventajas:**
- Un solo repositorio para clonar
- Fácil de ejecutar con Docker Compose
- Cambios coordinados en frontend/backend

**Desventajas:**
- El repositorio puede crecer
- CI/CD un poco más complejo

### Opción B: Repositorios separados
```
app-attendance-frontend/
app-attendance-backend/
```


**Ventajas:**
- Independencia total
- CI/CD separado

**Desventajas:**
- Dos clones para desarrollar
- Más difícil sincronizar cambios
- Docker Compose más complejo

### Opción C: Todo en una sola carpeta
```
app-attendance/
├── src/ # Frontend y backend mezclados
├── public/
└── routes/
```


**Ventajas:**
- Muy simple

**Desventajas:**
- Desorganizado
- Difícil mantener
- No escalable

## Decisión

**Se acepta la Opción A: Monorepo con dos subcarpetas**

### Justificación

1. **Simplicidad para el usuario final**: Con `docker-compose up` se levanta todo
2. **Cohesión**: Frontend y backend están relacionados y tienen un propósito común
3. **Facilidad de desarrollo**: Se puede trabajar en ambos en el mismo IDE
4. **Estándar del sector**: Muchos proyectos usan esta estructura (ej: Lerna, Nx)

### Detalles de implementación
```
app-attendance/
├── app/ # Frontend Ionic React
│ ├── src/
│ │ ├── pages/ # Pantallas
│ │ ├── services/ # API calls
│ │ ├── components/ # Componentes reutilizables
│ │ └── theme/ # Estilos
│ ├── public/
│ ├── package.json
│ └── vite.config.ts
├── back/ # Backend Node.js
│ ├── src/
│ │ ├── controllers/ # Controladores
│ │ ├── models/ # Modelos MongoDB
│ │ ├── routes/ # Rutas API
│ │ ├── middleware/ # Middlewares (auth)
│ │ ├── config/ # Configuración
│ │ ├── scripts/ # Scripts (seed)
│ │ └── index.ts # Entry point
│ ├── package.json
│ └── tsconfig.json
├── docker-compose.yml # Orquestación
├── .env.example # Variables de entorno ejemplo
└── README.md # Documentación principal
```

## Consecuencias

### Positivas

- ✅ Un solo `git clone` para obtener todo
- ✅ `docker-compose up` levanta frontend, backend y MongoDB
- ✅ Cambios relacionados se versionan juntos
- ✅ Fácil de compartir con el profesor

### Negativas

- ⚠️ El repositorio puede crecer (pero es manejable)
- ⚠️ CI/CD necesita filtrar cambios por carpeta

## Estados de la decisión

- [X] Propuesta
- [X] Analizada
- [X] Aceptada
- [X] Implementada
- [X] Superada (si aplica)

## Referencias

- [Monorepo vs Multi-repo](https://monorepo.tools/)
- [Estructura de proyectos Ionic + Node](https://ionicframework.com/docs)