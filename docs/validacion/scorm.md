# Validación del Paquete SCORM para Moodle

## Descripción

El paquete SCORM es una versión empaquetada de la documentación que se puede importar en Moodle como un recurdo educativo.

## Estructura del paquete SCORM
```bash
app-attendance-scorm-moodle.zip
├── imsmanifest.xml # Archivo de manifiesto SCORM
├── index.html # Página principal
├── css/
│ └── styles.css # Estilos
├── js/
│ ├── scorm.js # API SCORM
│ └── app.js # Lógica de la landing
└── assets/
└── images/ # Imágenes (si aplica)
```


## Archivo imsmanifest.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="AppAttendanceSCORM" 
          version="1.0" 
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adl="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 3rd Edition</schemaversion>
    <adl:location>App Attendance - Documentación</adl:location>
  </metadata>

  <organizations default="TOC1">
    <organization identifier="TOC1" title="App Attendance">
      <item identifier="ITEM1" identifierref="RESOURCE1" title="Documentación del Sistema">
        <item identifier="ITEM1_1" identifierref="RESOURCE1" title="Arquitectura"/>
        <item identifier="ITEM1_2" identifierref="RESOURCE1" title="API"/>
        <item identifier="ITEM1_3" identifierref="RESOURCE1" title="Modelo de Datos"/>
        <item identifier="ITEM1_4" identifierref="RESOURCE1" title="Operación"/>
        <item identifier="ITEM1_5" identifierref="RESOURCE1" title="Validación"/>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="RESOURCE1" type="webcontent" adl:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="css/styles.css"/>
      <file href="js/scorm.js"/>
      <file href="js/app.js"/>
    </resource>
  </resources>
</manifest>
```

## Contenido del index.html (resumen)
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Attendance - Documentación</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>App Attendance</h1>
            <p>Sistema de Asistencia Académica con QR</p>
        </header>

        <nav>
            <button class="tab-btn active" data-tab="arquitectura">Arquitectura</button>
            <button class="tab-btn" data-tab="api">API</button>
            <button class="tab-btn" data-tab="modelo">Modelo de Datos</button>
            <button class="tab-btn" data-tab="operacion">Operación</button>
            <button class="tab-btn" data-tab="validacion">Validación</button>
        </nav>

        <div id="arquitectura" class="tab-content active">
            <h2>Arquitectura del Sistema</h2>
            <!-- Contenido de arquitectura resumido -->
            <h3>Tecnologías</h3>
            <ul>
                <li>Frontend: Ionic React + Vite</li>
                <li>Backend: Node.js + Express</li>
                <li>Base de Datos: MongoDB</li>
                <li>Orquestación: Docker Compose</li>
            </ul>
            
            <h3>ADRs</h3>
            <ul>
                <li>ADR-001: Estructura monorepo</li>
                <li>ADR-002: Docker Compose</li>
                <li>ADR-003: Autenticación JWT</li>
                <li>ADR-004: MongoDB</li>
            </ul>
        </div>

        <div id="api" class="tab-content">
            <h2>API Reference</h2>
            <!-- Contenido de API resumido -->
            <table>
                <thead>
                    <tr><th>Método</th><th>Endpoint</th><th>Descripción</th></tr>
                </thead>
                <tbody>
                    <tr><td>POST</td><td>/auth/login</td><td>Inicio de sesión</td></tr>
                    <tr><td>GET</td><td>/institutions</td><td>Listar instituciones</td></tr>
                    <tr><td>POST</td><td>/sessions</td><td>Crear sesión QR</td></tr>
                </tbody>
            </table>
        </div>

        <div id="modelo" class="tab-content">
            <h2>Modelo de Datos</h2>
            <!-- Contenido del modelo de datos -->
            <h3>Colecciones</h3>
            <ul>
                <li>Institution</li>
                <li>AcademicUnit</li>
                <li>Person</li>
                <li>Enrollment</li>
                <li>Session</li>
                <li>Attendance</li>
            </ul>
        </div>

        <div id="operacion" class="tab-content">
            <h2>Operación</h2>
            <!-- Contenido de operación -->
            <h3>Inicio rápido con Docker</h3>
            <pre><code>docker-compose up -d
docker exec app_attendance_api npm run seed</code></pre>
            
            <h3>Credenciales de prueba</h3>
            <p>Documento: DOCENTE-001</p>
            <p>Contraseña: demo123</p>
        </div>

        <div id="validacion" class="tab-content">
            <h2>Validación</h2>
            <!-- Contenido de validación -->
            <h3>Checklist de pruebas</h3>
            <ul class="checklist">
                <li>✓ Login funciona correctamente</li>
                <li>✓ Listado de instituciones</li>
                <li>✓ Creación de sesión QR</li>
                <li>✓ Registro de asistencia</li>
                <li>✓ Resultados y exportación</li>
            </ul>
        </div>

        <footer>
            <p>App Attendance - Sistema de Asistencia Académica</p>
        </footer>
    </div>

    <script src="js/scorm.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```


## Archivo scorm.js (API SCORM)
```javascript
// js/scorm.js
var SCORM = {
    version: '2004 3rd Edition',
    initialized: false,
    completionStatus: 'incomplete',
    score: 0,

    initialize: function() {
        this.initialized = true;
        console.log('SCORM initialized');
        return true;
    },

    terminate: function() {
        this.initialized = false;
        console.log('SCORM terminated');
        return true;
    },

    setScore: function(score) {
        this.score = score;
        if (score >= 50) {
            this.completionStatus = 'completed';
        }
        console.log('Score set to: ' + score);
    },

    getStatus: function() {
        return this.completionStatus;
    },

    LMSInitialize: function() { return this.initialize(); },
    LMSFinish: function() { return this.terminate(); },
    LMSSetValue: function(name, value) {
        if (name === 'cmi.core.score.raw') {
            this.setScore(parseInt(value));
        }
        return true;
    },
    LMSGetValue: function(name) {
        if (name === 'cmi.core.score.raw') return this.score;
        if (name === 'cmi.core.lesson_status') return this.getStatus();
        return '';
    }
};

window.API = SCORM;
```

## Archivo app.js (interactividad)
```javascript
// js/app.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar SCORM
    if (typeof SCORM !== 'undefined' && SCORM.LMSInitialize) {
        SCORM.LMSInitialize('');
    }

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Registrar progreso en SCORM
            if (typeof SCORM !== 'undefined') {
                SCORM.LMSSetValue('cmi.core.score.raw', 20);
            }
        });
    });

    // Completar SCORM al finalizar
    window.addEventListener('beforeunload', function() {
        if (typeof SCORM !== 'undefined') {
            SCORM.LMSSetValue('cmi.core.lesson_status', 'completed');
            SCORM.LMSFinish('');
        }
    });
});
```

## Archivo styles.css (estilos básicos)
```css
/* css/styles.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f7fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    padding: 40px 0;
    background: linear-gradient(135deg, #4CAF50, #2E7D32);
    color: white;
    border-radius: 16px;
    margin-bottom: 30px;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

nav {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.tab-btn {
    padding: 12px 24px;
    background: white;
    border: 2px solid #4CAF50;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s;
}

.tab-btn.active {
    background: #4CAF50;
    color: white;
}

.tab-content {
    display: none;
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tab-content.active {
    display: block;
}

h2 {
    color: #4CAF50;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
}

h3 {
    margin: 20px 0 10px 0;
    color: #333;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

th {
    background: #4CAF50;
    color: white;
}

pre {
    background: #f4f4f4;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
}

code {
    font-family: 'Courier New', monospace;
    color: #4CAF50;
}

ul.checklist {
    list-style: none;
}

ul.checklist li {
    padding: 8px 0;
    font-size: 16px;
}

footer {
    text-align: center;
    padding: 30px;
    color: #666;
    font-size: 14px;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    header h1 {
        font-size: 1.8rem;
    }
    
    .tab-btn {
        padding: 8px 16px;
        font-size: 14px;
    }
    
    table {
        font-size: 12px;
    }
    
    th, td {
        padding: 8px;
    }
}
```

## Cómo crear el paquete SCORM

### 1. Estructura de carpetas
```bash
# Crear la estructura
mkdir scorm-package
cd scorm-package
mkdir css js assets

# Copiar archivos
# - imsmanifest.xml
# - index.html
# - css/styles.css
# - js/scorm.js
# - js/app.js
```

### 2. Validar el paquete
```bash
# Verificar estructura
tree /f

# Comprimir a ZIP
zip -r app-attendance-scorm-moodle.zip *
```

### 3. Probar en Moodle

1. Iniciar sesión en Moodle como administrador

2. Agregar una actividad → Paquete SCORM

3. Subir el archivo ZIP

4. Configurar opciones:

- Mostrar: Ventana actual

- Calificación máxima: 100

5. Guardar y mostrar

## Validación del SCORM
|Prueba	|Resultado Esperado|
|-------|------------------|
|Importación en Moodle	|Sin errores|
|Visualización	|Contenido visible|
|Navegación entre pestañas	|Funciona correctamente|
|Progreso	|Se registra en Moodle|
|Finalización	|Marcado como completado|


## Solución de problemas
|Problema	|Solución|
|-----------|--------|
|Error de importación	|Verificar que imsmanifest.xml está en la raíz del ZIP|
|No se ven los estilos	|Verificar rutas de CSS en index.html|
|No registra progreso	|Verificar API SCORM en scorm.js|
|Imágenes no cargan	|Usar rutas relativas|


## Resultado esperado
text

✅ Paquete SCORM creado correctamente

✅ Estructura de archivos validada

✅ Se puede importar en Moodle

✅ El contenido se visualiza correctamente

✅ El progreso se registra correctamente

