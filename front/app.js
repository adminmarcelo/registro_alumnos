// app.js - Versión optimizada
const API_URL = "http://localhost:5001/api/students";
const CAREERS_URL = "http://localhost:5001/api/careers";
const CATEGORY_API = "http://localhost:5001/api/categories";

const API_KEY = "12345ABCDEF";
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

// ===== UTILITIES =====
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'position-fixed bottom-0 end-0 p-3';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = 'info') {
  if (typeof bootstrap === 'undefined' || !bootstrap.Toast) {
    console.error('Bootstrap no está cargado correctamente');
    alert(message);
    return;
  }

  const toastTypes = {
    'info': 'text-bg-info',
    'success': 'text-bg-success',
    'warning': 'text-bg-warning',
    'danger': 'text-bg-danger'
  };
  
  const toastId = `toast-${Date.now()}`;
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center ${toastTypes[type]} border-0`;
  toastEl.setAttribute('id', toastId);
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  toastContainer.appendChild(toastEl);
  
  try {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  } catch (e) {
    console.error('Error al mostrar toast:', e);
    toastEl.remove();
    alert(message);
  }
}

async function apiClient(url, method, body = null) {
 const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
    console.log(`[apiClient] Enviando ${method} a ${url} con cuerpo:`, body);
  } else {
    console.log(`[apiClient] Enviando ${method} a ${url} sin cuerpo`);
  }

  try {
    const res = await fetch(url, config);
    console.log(`[apiClient] Respuesta recibida: status ${res.status}`);

    const text = await res.text();

    if (!res.ok) {
      console.error(`[apiClient] Error en la respuesta:`, text);
      throw new Error(text || 'Error desconocido');
    }

    try {
      return JSON.parse(text);
    } catch (jsonError) {
      console.warn('[apiClient] No se pudo parsear JSON. Texto recibido:', text);
      return text;
    }
  } catch (fetchError) {
    console.error(`[apiClient] Error de conexión o fetch:`, fetchError);
    throw fetchError;
  }
}

function renderStudentCard(student, containerId = 'registerResult') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div id="successAlert" class="alert alert-success border-success shadow-lg fade show position-fixed top-50 start-50 translate-middle z-1050" role="alert" style="min-width: 320px; max-width: 90vw;">
      <div class="d-flex align-items-start gap-2">
        <i class="bi ${containerId === 'registerResult' ? 'bi-check-circle-fill' : 'bi-search-heart'} fs-4 text-success flex-shrink-0 mt-1"></i>
        <div>
          <h5 class="alert-heading mb-1">${containerId === 'registerResult' ? 'Registro Exitoso' : 'Estudiante Encontrado'}</h5>
          <p class="mb-1"><strong>👤 Nombre:</strong> ${student.name}</p>
          <p class="mb-1"><strong>🆔 DNI:</strong> ${student.dni}</p>
          <p class="mb-1"><strong>🎓 Carrera:</strong> ${student.career}</p>
          <p class="mb-1"><strong>🏷️ Tipo:</strong> ${student.tipo}</p>
          <p class="mb-0"><strong>⏳ Duración:</strong> ${student.duracion}</p>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const alert = document.getElementById("successAlert");
    if (alert) {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 500);
    }
  }, 5000);
}

// ===== STUDENT FUNCTIONS =====
async function registerStudentService(studentData) {
  return apiClient(API_URL, 'POST', studentData);
}

async function getStudentByIdService(id) {
  return apiClient(`${API_URL}/${id}`);
}

async function getStudentsByCareerService(career) {
  return apiClient(`${API_URL}/career?career=${encodeURIComponent(career)}`);
}

async function getStudentsByNameService(name) {
  return apiClient(`${API_URL}?name=${encodeURIComponent(name)}`);
}

async function deleteStudentService(id) {
  return apiClient(`${API_URL}/${id}`, 'DELETE');
}

async function deleteStudent() {
  const id = document.getElementById("deleteId").value.trim();
  if (!id) {
    showToast("Por favor, ingrese un ID", "warning");
    return;
  }

  try {
    const response = await deleteStudentService(id);
    if (response.error) {
      showToast(response.error, "danger");
    } else {
      showToast("Estudiante eliminado correctamente", "success");
      document.getElementById("deleteId").value = "";
    }
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    showToast("Error al eliminar estudiante", "danger");
  }
}
async function registerStudent() {
  const name = document.getElementById("registerName")?.value.trim();
  const dni = document.getElementById("registerDni")?.value.trim();
  const select = document.getElementById("registerCareer");

  if (!name || !dni || !select?.value) {
    showToast("Todos los campos son obligatorios: nombre, DNI y carrera.", "warning");
    return;
  }

  let selectedCareer;
  try {
    selectedCareer = JSON.parse(select.value);
  } catch (e) {
    showToast("Selección de carrera inválida.", "danger");
    return;
  }

  const studentData = {
    name,
    dni,
    career: selectedCareer.name,
    tipo: selectedCareer.category,
    duracion: selectedCareer.duration
  };

  try {
    const response = await registerStudentService(studentData);
    renderStudentCard(response.student || studentData);
    showToast("Estudiante registrado correctamente", "success");
    
    // Reset form
    document.getElementById("registerName").value = "";
    document.getElementById("registerDni").value = "";
  
    select.selectedIndex = 0;
    document.getElementById("careerTypeDisplay").value = "";
    document.getElementById("careerDurationDisplay").value = "";
    document.getElementById("careerRegistryDisplay").value = "";
  } catch (error) {
    console.error("Error al registrar estudiante:", error);
    showToast(error.message || "Error al registrar estudiante.", "danger");
  }
}

async function getStudentById() {
  const id = document.getElementById("studentId").value.trim();
  if (!id) {
    showToast("Por favor, ingrese un ID", "warning");
    return;
  }

  try {
    const student = await getStudentByIdService(id);
    if (student?.id) {
      renderStudentCard(student, 'getResult');
      showToast("Estudiante encontrado", "success");
    } else {
      document.getElementById("getResult").innerHTML = "";
      showToast("Estudiante no encontrado", "info");
    }
  } catch (error) {
    console.error("Error al buscar por ID:", error);
    showToast("Error al buscar estudiante", "danger");
  }
}

async function getStudentByName() {
  const name = document.getElementById("studentName").value.trim();
  if (!name) {
    showToast("Por favor ingresá un nombre", "warning");
    return;
  }

  try {
    const students = await getStudentsByNameService(name);
    renderStudentResult(students);
  } catch (error) {
    console.error(error);
    showToast("Error al buscar por nombre", "danger");
  }
}

async function getStudentsByCareer() {
  const selectElement = document.getElementById("registerCareerSearch");
  const selectedCareerValue = selectElement.value; // Esto es el JSON stringificado

  if (!selectedCareerValue) {
    showToast("Por favor, seleccione una carrera.", "warning");
    return;
  }

  let selectedCareerObject;
  try {
    selectedCareerObject = JSON.parse(selectedCareerValue); // Parsea el JSON stringificado
  } catch (e) {
    console.error("Error al parsear el JSON de la carrera:", e);
    showToast("Error al procesar la selección de carrera.", "danger");
    return;
  }

  if (!selectedCareerObject.name) {
    showToast("La carrera seleccionada no tiene un nombre válido.", "warning");
    return;
  }

  try {
    const students = await getStudentsByCareerService(selectedCareerObject.name); // Pasa el nombre de la carrera
    renderStudentResult(students);
    if (students.length > 0) {
      showToast(`Se encontraron ${students.length} estudiantes para la carrera: ${selectedCareerObject.name}`, "success");
    } else {
      showToast(`No se encontraron estudiantes para la carrera: ${selectedCareerObject.name}`, "info");
    }
  } catch (error) {
    console.error("Error al buscar por carrera:", error);
    showToast("Error al buscar por carrera: " + (error.message || "Error desconocido"), "danger");
  }
}


function renderStudentResult(students) {
  const resultDiv = document.getElementById("registerResult");
  const tableDiv = document.getElementById("getResult");

  resultDiv.innerHTML = "";
  tableDiv.innerHTML = "";

  if (!students?.length) {
    showToast("No se encontraron estudiantes", "info");
    return;
  }

  if (students.length === 1) {
    renderStudentCard(students[0], 'getResult');
    return;
  }
//colores resultados shhow table
function getTipoBadgeClass(tipo) {

  console.log('tipo', tipo);
  switch (tipo.toLowerCase()) {
    case "técnica": return "bg-warning text-dark";
    case "universitaria": return "bg-success";
    case "corta": return "bg-danger";
    case "postgrado": return "bg-secondary";
    default: return "bg-info text-dark";
  }
}

  // Multiple results - show table
 tableDiv.innerHTML = `
  <div class="table-responsive mt-4">
    <table class="table table-bordered table-hover table-striped align-middle shadow-sm rounded">
      <thead class="table-primary text-center">
        <tr>
          <th scope="col"><i class="bi bi-hash"></i> ID</th>
          <th scope="col" class="text-start"><i class="bi bi-person-fill"></i> Nombre</th>
          <th scope="col"><i class="bi bi-credit-card-2-front-fill"></i> DNI</th>
          <th scope="col" class="text-start"><i class="bi bi-mortarboard-fill"></i> Carrera</th>
          <th scope="col"><i class="bi bi-clock-history"></i> Duración</th>
          <th scope="col"><i class="bi bi-tags-fill"></i> Tipo</th>
        </tr>
      </thead>
      <tbody>
        ${students.map(s => `
          <tr>
            <td class="text-center fw-semibold">${s.id}</td>
            <td class="text-start">${s.name}</td>
            <td class="text-center">${s.dni}</td>
            <td class="text-start">${s.career}</td>
            <td class="text-center">${s.duracion} años</td>
            <td class="text-center">
              <span class="badge ${getTipoBadgeClass(s.tipo)}">${s.tipo}</span>
            </td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr class="table-light">
          <td colspan="6" class="text-end fw-bold">Total: ${students.length} estudiantes</td>
        </tr>
      </tfoot>
    </table>
  </div>
`;
// Scroll automático al div de resultados
setTimeout(() => {
  tableDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);

}

// ===== CAREER FUNCTIONS =====
async function registerCareerService(careerData) {
  return apiClient(CAREERS_URL, 'POST', careerData);
}

async function loadCareersToSelect() {
  try {
    const careers = await apiClient(CAREERS_URL);
    const select = document.getElementById("registerCareer");
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Seleccione Carrera</option>';
    careers.forEach(career => {
      const option = document.createElement("option");
      option.value = JSON.stringify(career);
      option.textContent = career.name;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      const selected = JSON.parse(select.value);
      document.getElementById("careerTypeDisplay").value = selected.category || '';
      document.getElementById("careerDurationDisplay").value = selected.duration || '';
      document.getElementById("careerRegistryDisplay").value = selected.registryNumber || '';
    });
  } catch (err) {
    console.error("Error al cargar carreras:", err);
    showToast("Error al cargar carreras", "danger");
  }
}

async function loadCareersToSelectSearch() {
  try {
    const careers = await apiClient(CAREERS_URL);
    const select = document.getElementById("registerCareerSearch");
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Seleccione Carrera</option>';
    careers.forEach(career => {
      const option = document.createElement("option");
      option.value = JSON.stringify(career);
      option.textContent = career.name;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      const selected = JSON.parse(select.value);
      document.getElementById("careerTypeDisplay").value = selected.category || '';
      document.getElementById("careerDurationDisplay").value = selected.duration || '';
      document.getElementById("careerRegistryDisplay").value = selected.registryNumber || '';
    });
  } catch (err) {
    console.error("Error al cargar carreras:", err);
    showToast("Error al cargar carreras", "danger");
  }
}

async function registerCareer() {
  const name = document.getElementById("careerName").value.trim();
  const category = document.getElementById("careerCategory").value;
  const duration = document.getElementById("careerDuration").value.trim();
  const registryNumber = document.getElementById("careerCode").value.trim();

  if (!name || !category || !duration || !registryNumber) {
    showToast("Todos los campos son obligatorios.", "warning");
    return;
  }

  try {
    await registerCareerService({ name, category, duration, registryNumber });
    showToast("Carrera registrada exitosamente.", "success");
    
    // Reset form
    document.getElementById("careerName").value = "";
    document.getElementById("careerCategory").value = "";
    document.getElementById("careerDuration").value = "";
    document.getElementById("careerCode").value = "";
  } catch (error) {
    console.error("Error al registrar carrera:", error);
    showToast(error.message || "Error al registrar carrera.", "danger");
  }
}

async function searchCareer() {
  const query = document.getElementById("searchCareerInput").value.trim().toLowerCase();
  if (!query) {
    showToast("Ingresá un valor para buscar.", "warning");
    return;
  }

  try {
    const careers = await apiClient(CAREERS_URL);
    const found = careers.find(c =>
      c.id.toString() === query ||
      c.name.toLowerCase() === query ||
      (c.category && c.category.toLowerCase() === query)
    );

    const result = document.getElementById("getCareerResult");
    if (!found) {
      result.textContent = "Carrera no encontrada.";
      result.className = "text-warning";
      return;
    }

    result.className = "text-light";
    result.innerHTML = `
      <strong>Legajo:</strong> ${found.registryNumber}<br>
      <strong>Nombre:</strong> ${found.name}<br>
      <strong>ID:</strong> ${found.id}<br>
      <strong>Categoría:</strong> ${found.category}<br>
      <strong>Duración:</strong> ${found.duration}<br>
    `;
    document.getElementById('searchCareerInput').value = '';
  } catch (err) {
    console.error("Error al buscar carrera:", err);
    showToast("Error al buscar carrera.", "danger");
  }
}

async function deleteCareer() {
  const input = document.getElementById("deleteCareerId").value.trim().toLowerCase();
  if (!input) {
    showToast("Ingresá un ID o nombre para eliminar.", "warning");
    return;
  }

  try {
    const careers = await apiClient(CAREERS_URL);
    const match = careers.find(c =>
      c.id.toString() === input || c.name.toLowerCase() === input
    );

    if (!match) {
      showToast("Carrera no encontrada.", "warning");
      return;
    }

    if (!confirm(`¿Estás seguro que querés eliminar la carrera "${match.name}"?`)) return;

    await apiClient(`${CAREERS_URL}/${match.id}`, 'DELETE');
    showToast("Carrera eliminada exitosamente.", "success");
    document.getElementById('deleteCareerId').value = '';
  } catch (err) {
    console.error("Error al eliminar carrera:", err);
    showToast(err.message || "Error al eliminar carrera.", "danger");
  }
}

// ===== CATEGORY FUNCTIONS =====
async function registerCategory(e) {
  e.preventDefault();
  const name = document.getElementById("category-name").value.trim();
  console.log('category-name', name);

  if (!name) {
    showToast("El nombre de la categoría es obligatorio", "warning");
    return;
  }

  try {
    await apiClient(CATEGORY_API,'POST', { name });
    showToast("Categoría registrada correctamente", "success");
    document.getElementById("category-name").value = "";
    loadCategories();
  } catch (error) {
    console.error("Error al registrar categoría:", error);
    showToast(error.message || "Error al registrar categoría", "danger");
  }
}

async function loadCategories() {
  const list = document.getElementById("category-list");
  if (!list) return;

  try {
    const categories = await apiClient(CATEGORY_API);
    list.innerHTML = categories.length ? 
      categories.map(cat => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>${cat.name}</span>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${cat.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </li>
      `).join('') : 
      '<li class="list-group-item text-warning">No hay categorías registradas.</li>';
  } catch (err) {
    console.error("Error al cargar categorías:", err);
    list.innerHTML = '<li class="list-group-item text-danger">Error al cargar categorías.</li>';
  }
}
//document.getElementById("careerCategory").addEventListener("submit", registerCategory);

async function loadCategoriesToSelect() {
  try {
    const categories = await apiClient(CATEGORY_API);
    const select = document.getElementById("careerCategory");
    if (!select) return;

    select.innerHTML = '<option value="">Seleccionar categoría</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando categorías:", err);
    showToast("Error al cargar categorías", "danger");
  }
}

async function deleteCategory(id) {
  if (!confirm("¿Estás seguro que deseas eliminar esta categoría?")) return;

  try {
    await apiClient(`${CATEGORY_API}/${id}`, 'DELETE');
    showToast("Categoría eliminada correctamente", "success");
    loadCategories();
  } catch (error) {
    console.error(error);
    showToast(error.message || "Error al eliminar categoría", "danger");
  }
}

// ===== NAVBAR & INITIALIZATION =====
function setupNavbar() {
  // Efecto scroll para el navbar
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scrolling para anclas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initializeModals() {
  const contactModalEl = document.getElementById('contactModal');
  if (contactModalEl) new bootstrap.Modal(contactModalEl);

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  setupNavbar();
  initializeModals();

  try {
    await Promise.all([
      loadCareersToSelect(),
      loadCareersToSelectSearch(),
      loadCategoriesToSelect(),
      loadCategories()
    ]);
  } catch (error) {
    console.error("Error during initialization:", error);
  }

  // Event listeners
  const categoryForm = document.getElementById("category-form");
  if (categoryForm) {
    categoryForm.addEventListener("submit", registerCategory);
  }
});
//cosas nuevas 
// En tu archivo app.js, añade/reemplaza esta función:
async function getAllCareers() {
  const result = document.getElementById("allCareersResult");
  if (!result) {
    console.error("Elemento 'allCareersResult' no encontrado en el DOM.");
    return;
  }
  result.innerHTML = "";

  try {
    const careers = await apiClient(CAREERS_URL);
    
    if (!Array.isArray(careers) || careers.length === 0) {
      result.innerHTML = `
        <div class="alert alert-warning mt-3">
          No hay carreras registradas.
        </div>
      `;
      return;
    }

    result.innerHTML = `
      <div class="table-responsive mt-3">
        <table class="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Duración</th>
              <th>Legajo</th>
            </tr>
          </thead>
          <tbody>
            ${careers.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.category}</td>
                <td>${c.duration}</td>
                <td>${c.registryNumber}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    result.innerHTML = `
      <div class="alert alert-danger mt-3">
        Error al cargar las carreras: ${error.message}
      </div>
    `;
  }
}


// Global functions needed for HTML event handlers
window.deleteCategory = deleteCategory;