Documentación del Proyecto: Gestión de Estudiantes y Carreras
Este documento describe la arquitectura, el flujo de trabajo del frontend (app.js) y la metodología de desarrollo asistida por Inteligencia Artificial utilizada para la creación de este proyecto.

1. Flujo de Trabajo de app.js (Frontend)
El archivo app.js es el frontend de la aplicación, es decir, la parte que interactúa directamente con el usuario en el navegador. Su función principal es gestionar la interfaz de usuario, enviar solicitudes al backend (index.js) y mostrar las respuestas de manera dinámica.

Aquí se detalla el flujo de trabajo y las secciones clave:

1.1. Constantes y Configuración Inicial
API_URL, CAREERS_URL, CATEGORY_API: Definen las URLs base para los diferentes endpoints del backend (estudiantes, carreras, categorías).

API_KEY y headers: Contienen la clave de API para la autenticación y los encabezados HTTP necesarios para las solicitudes (especificando Content-Type como JSON y la Authorization con la API Key).

1.2. Utilidades Generales
createToastContainer() y showToast(message, type): Estas funciones son cruciales para proporcionar retroalimentación al usuario. createToastContainer() crea un contenedor para los "toasts" (mensajes emergentes) si no existe, y showToast() se encarga de crear, configurar y mostrar un toast con un mensaje y tipo (info, success, warning, danger) específicos. Esto mejora la experiencia del usuario al notificarle sobre el éxito o fracaso de las operaciones.

apiClient(url, method, body): Esta es la función central para todas las interacciones con el backend.

Toma la url del endpoint, el method HTTP (GET, POST, DELETE) y opcionalmente un body para solicitudes POST.

Configura los headers (incluyendo la API Key).

Realiza la solicitud fetch al backend.

Maneja la respuesta: verifica si la respuesta es res.ok (status 2xx), intenta parsear el JSON de la respuesta y maneja errores de red o del servidor. Si la respuesta no es OK, lanza un error con el mensaje de error del backend.

renderStudentCard(student, containerId): Esta función se encarga de mostrar la información detallada de un estudiante en una tarjeta visualmente atractiva. Se utiliza tanto para mostrar un estudiante recién registrado como para mostrar el resultado de una búsqueda por ID. Incluye un setTimeout para que la tarjeta desaparezca después de un tiempo, mejorando la usabilidad.

getTipoBadgeClass(tipo): Función auxiliar para asignar clases CSS de Bootstrap (colores de badges) según el tipo de carrera (Técnica, Universitaria, Corta, Postgrado), lo que ayuda a la visualización en tablas.

renderStudentResult(students): Esta función decide cómo mostrar los resultados de la búsqueda de estudiantes. Si hay un solo estudiante, llama a renderStudentCard. Si hay múltiples estudiantes, los renderiza en una tabla. Si no hay resultados, muestra un toast informativo.

1.3. Funciones de Estudiantes (CRUD)
Esta sección contiene las funciones que interactúan con los endpoints de estudiantes del backend:

registerStudentService(studentData): Llama a apiClient para enviar una solicitud POST para registrar un nuevo estudiante.

getStudentByIdService(id): Llama a apiClient para obtener un estudiante por su ID.

getStudentsByCareerService(career): Llama a apiClient para obtener estudiantes filtrados por carrera.

getStudentsByNameService(name): Llama a apiClient para obtener estudiantes filtrados por nombre.

deleteStudentService(id): Llama a apiClient para eliminar un estudiante por su ID.

registerStudent(): Maneja el evento de registro de un estudiante desde el formulario. Recoge los datos del formulario, valida, llama a registerStudentService y actualiza la UI con un toast y la tarjeta del estudiante.

getStudentById(): Maneja la búsqueda de estudiante por ID.

getStudentByName(): Maneja la búsqueda de estudiante por nombre.

getStudentsByCareer(): Maneja la búsqueda de estudiantes por carrera.

deleteStudent(): Maneja la eliminación de un estudiante.

1.4. Funciones de Carreras (CRUD)
Similar a las funciones de estudiantes, estas manejan las operaciones con las carreras:

registerCareerService(careerData): Llama a apiClient para registrar una nueva carrera.

loadCareersToSelect() y loadCareersToSelectSearch(): Estas funciones son cruciales para poblar los select (dropdowns) de carreras en los formularios de registro y búsqueda de estudiantes. Obtienen las carreras del backend y las añaden como opciones, incluyendo un change listener para actualizar los campos de tipo y duración de la carrera seleccionada.

registerCareer(): Maneja el registro de una nueva carrera.

searchCareer(): Maneja la búsqueda de una carrera por ID o nombre.

deleteCareer(): Maneja la eliminación de una carrera. Incluye una confirmación antes de eliminar.

getAllCareers(): Obtiene y muestra todas las carreras en una tabla.

1.5. Funciones de Categorías (CRUD)
Estas funciones gestionan las operaciones con las categorías de carreras:

registerCategory(e): Maneja el registro de una nueva categoría.

loadCategories(): Carga y muestra todas las categorías en una lista. Incluye botones para eliminar cada categoría.

loadCategoriesToSelect(): Pobla el select de categorías en el formulario de registro de carreras.

deleteCategory(id): Maneja la eliminación de una categoría. Incluye una confirmación.

1.6. Inicialización y Event Listeners
setupNavbar(): Configura el comportamiento del navbar (efecto de scroll y smooth scrolling para anclas).

initializeModals(): Inicializa los modales de Bootstrap (como el de contacto) y los tooltips.

document.addEventListener('DOMContentLoaded', async () => { ... }): Este es el punto de entrada principal del script. Se ejecuta una vez que el DOM está completamente cargado.

Llama a setupNavbar() e initializeModals().

Utiliza Promise.all para cargar de forma asíncrona y paralela los datos iniciales necesarios para los selects (carreras para registro/búsqueda, categorías para carreras). Esto asegura que los dropdowns estén poblados al cargar la página.

Adjunta el event listener para el formulario de registro de categorías.

window.deleteCategory = deleteCategory;: Hace que la función deleteCategory sea accesible globalmente, lo cual es necesario porque se llama directamente desde el HTML en los botones de eliminar categoría.

En resumen, app.js es el cerebro del lado del cliente, orquestando la interacción del usuario, la comunicación con el servidor y la actualización dinámica de la interfaz. Utiliza funciones modulares y asíncronas para manejar las operaciones CRUD y proporcionar una experiencia de usuario fluida.

2. IAs y Prompts para la Generación del Proyecto
Este proyecto fue desarrollado con la asistencia de Modelos de Lenguaje Grandes (LLMs) para acelerar el proceso de codificación, generar ideas y proporcionar explicaciones.

2.1. Herramientas de IA Utilizadas
Gemini 1.5 Pro: Utilizado para la generación de código, refactorización, explicación de conceptos y depuración. Su capacidad para manejar contextos largos y razonamiento complejo fue fundamental.

2.2. Metodología de Prompteado
La interacción con la IA se basó en un enfoque iterativo y conversacional, donde cada prompt se construía sobre las respuestas anteriores. Se priorizó la claridad, la especificidad y la división de tareas complejas en subtareas más manejables.

Prompts Clave (Ejemplos Representativos)
A continuación, se presentan ejemplos de prompts que se utilizaron para generar las diferentes partes del proyecto. Es importante destacar que estos son resúmenes y que la conversación real fue mucho más detallada y con múltiples iteraciones para refinar el código y las funcionalidades.

2.2.1. Configuración Inicial del Backend (index.js)

Prompt Inicial:
"Necesito configurar un servidor Node.js con Express para gestionar datos de estudiantes, carreras y categorías. Debe usar fs para persistir los datos en archivos JSON (students.json, careers.json, categories.json). Implementa middleware para CORS y para validar una API Key ficticia en los headers de autorización. Define un puerto 5001."

Prompts para Endpoints CRUD (Ejemplo para Estudiantes):
"Crea los endpoints CRUD para estudiantes:

POST /api/students: para registrar un nuevo estudiante. Debe validar que name, dni, career, tipo, duracion estén presentes y que el DNI tenga 7 u 8 dígitos. Asigna un ID incremental.

GET /api/students/:id: para obtener un estudiante por ID.

GET /api/students: para obtener todos los estudiantes, con un filtro opcional por name (query parameter).

GET /api/students/career?career=XYZ: para obtener estudiantes por nombre de carrera.

DELETE /api/students/:id: para eliminar un estudiante por ID. Asegúrate de que no se pueda eliminar una carrera si tiene estudiantes asociados."

Prompts para Persistencia:
"Implementa funciones loadStudents(), saveStudents(), loadCareers(), saveCareers(), loadCategories(), saveCategories() que lean y escriban los datos en sus respectivos archivos JSON. Asegúrate de manejar errores de lectura/escritura."

2.2.2. Desarrollo del Frontend (app.js)

Prompt Inicial para Estructura Base:
"Crea un archivo app.js para el frontend. Necesito funciones para interactuar con la API del backend. Incluye una función apiClient genérica para hacer fetch requests con la API Key. También, crea un sistema de toasts (mensajes emergentes) para notificaciones al usuario, utilizando Bootstrap 5."

Prompts para Lógica de Estudiantes (Ejemplo: Registro):
"Desarrolla la función registerStudent() en app.js. Debe obtener los valores del formulario de registro de estudiantes, validar que no estén vacíos, llamar a apiClient con el endpoint POST /api/students y, si es exitoso, mostrar un toast de éxito y limpiar el formulario. Si hay un error, muestra un toast de error."

Prompts para Renderizado de Datos:
"Crea una función renderStudentResult(students) que muestre los estudiantes en una tabla si hay múltiples resultados, o en una tarjeta detallada si es un solo estudiante. La tabla debe tener columnas para ID, Nombre, DNI, Carrera, Duración y Tipo. Usa clases de Bootstrap para estilizar la tabla y los badges de tipo."

Prompts para Carga Dinámica de Dropdowns:
"Implementa loadCareersToSelect() y loadCategoriesToSelect() para poblar dinámicamente los dropdowns de selección de carrera y categoría en los formularios. Estas funciones deben hacer un GET a los endpoints correspondientes del backend y añadir las opciones al <select> HTML."

Prompts para Interacción de Usuario y UI:
"Añade lógica para el DOMContentLoaded event listener para inicializar el navbar, modales y cargar los datos iniciales. Asegúrate de que las funciones de eliminación (deleteStudent, deleteCareer, deleteCategory) tengan una confirmación antes de proceder."

2.2.3. Refactorización y Mejoras

Prompts para Optimización y Modularización:
"Revisa el código de app.js para mejorar la modularidad. Agrupa funciones relacionadas, y asegura que apiClient maneje correctamente las respuestas no-OK del servidor, lanzando errores con los mensajes del backend."

Prompts para Experiencia de Usuario:
"Mejora la experiencia del usuario al mostrar los resultados de búsqueda. Si solo hay un resultado, muéstralo en una tarjeta destacada. Si hay varios, en una tabla. Añade un scroll automático a los resultados."

2.3. Conclusiones sobre el Uso de IA
El uso de Gemini 1.5 Pro permitió:

Aceleración del Desarrollo: Generación rápida de la estructura base y los endpoints CRUD.

Reducción de Errores: Asistencia en la validación de entradas y el manejo de errores.

Mejora de la Calidad del Código: Sugerencias para modularización, funciones utilitarias y mejores prácticas.

Resolución de Bloqueos: Ayuda para depurar problemas y entender conceptos complejos.

Este enfoque colaborativo con la IA fue fundamental para la construcción eficiente y robusta de la aplicación.