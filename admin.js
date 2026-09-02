import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  STORAGE_BUCKET,
  DEMO_MODE
} from "./config.js";


const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ===============================
// ELEMENTOS
// ===============================

const loginView = document.getElementById("loginView");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const projectForm = document.getElementById("projectForm");

const logoutBtn = document.getElementById("logout");

const newBtn = document.getElementById("newBtn");

const cancelBtn = document.getElementById("cancelBtn");
const cancelBtn2 = document.getElementById("cancelBtn2");

const formWrap = document.getElementById("formWrap");

const formTitle = document.getElementById("formTitle");

const projectList = document.getElementById("projectList");

const statusEl = document.getElementById("status");


// ===============================
// CAMPOS
// ===============================

const projectId = document.getElementById("projectId");

const title = document.getElementById("title");

const year = document.getElementById("year");

const division = document.getElementById("division");

const color = document.getElementById("color");

const description = document.getElementById("description");

const imageFile = document.getElementById("imageFile");

const currentImage = document.getElementById("currentImage");

const featured = document.getElementById("featured");

const published = document.getElementById("published");


// ===============================
// STATUS
// ===============================

function setStatus(message, error = false) {

  if (!statusEl) return;

  statusEl.textContent = message;

  statusEl.className =
    error
      ? "mb-6 text-sm text-red-400"
      : "mb-6 text-sm text-white/50";

}


// ===============================
// LOGIN
// ===============================

loginForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;


    setStatus("Entrando...");


    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });


    if (error) {

      setStatus(
        "Não foi possível entrar: " +
        error.message,
        true
      );

      return;
    }


    setStatus("Login realizado.");

    await showDashboard();

  }
);


// ===============================
// LOGOUT
// ===============================

logoutBtn?.addEventListener(
  "click",
  async () => {

    await supabase.auth.signOut();

    showLogin();

  }
);


// ===============================
// MOSTRAR LOGIN
// ===============================

function showLogin() {

  loginView?.classList.remove("hidden");

  dashboard?.classList.add("hidden");

  logoutBtn?.classList.add("hidden");

  formWrap?.classList.add("hidden");

}


// ===============================
// MOSTRAR DASHBOARD
// ===============================

async function showDashboard() {

  loginView?.classList.add("hidden");

  dashboard?.classList.remove("hidden");

  logoutBtn?.classList.remove("hidden");

  await loadProjects();

}


// ===============================
// CARREGAR PROJETOS
// ===============================

async function loadProjects() {

  projectList.innerHTML = "";

  setStatus("Carregando projetos...");


  const {
    data,
    error
  } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    setStatus(
      "Erro ao carregar projetos: " +
      error.message,
      true
    );

    return;
  }


  if (!data || data.length === 0) {

    projectList.innerHTML = `
      <div class="md:col-span-2 glass rounded-3xl p-8 text-center text-white/45">
        Nenhum projeto cadastrado ainda.
      </div>
    `;

    setStatus("");

    return;
  }


  data.forEach(renderProject);


  setStatus(
    `${data.length} projeto(s) encontrado(s).`
  );

}


// ===============================
// RENDER PROJETO
// ===============================

function renderProject(project) {

  const card =
    document.createElement("article");


  card.className =
    "glass rounded-3xl overflow-hidden";


  const image =
    project.image_url
      ? `
        <img
          src="${escapeHtml(project.image_url)}"
          alt="${escapeHtml(project.title)}"
          class="w-full aspect-video object-cover">
      `
      : `
        <div
          class="w-full aspect-video
                 flex items-center justify-center
                 bg-white/5
                 text-white/20">

          SEM IMAGEM

        </div>
      `;


  card.innerHTML = `

    ${image}

    <div class="p-5">

      <div
        class="flex items-center justify-between gap-3">

        <h3
          class="font-black text-xl">

          ${escapeHtml(project.title)}

        </h3>

        <span
          class="text-xs font-bold"
          style="color:${escapeHtml(project.color)}">

          ${project.division === "animation"
            ? "ANIMATION"
            : "PICTURES"}

        </span>

      </div>


      <p
        class="mt-2 text-sm text-white/45">

        ${project.year || "Ano não informado"}

      </p>


      <p
        class="mt-3 text-sm text-white/60">

        ${escapeHtml(project.description || "")}

      </p>


      <div
        class="mt-5 flex items-center
               justify-between">

        <span
          class="text-xs
                 ${project.published
                   ? "text-green-400"
                   : "text-white/35"}">

          ${project.published
            ? "PUBLICADO"
            : "OCULTO"}

        </span>


        <div class="flex gap-2">

          <button
            class="editBtn rounded-full
                   border border-white/15
                   px-4 py-2
                   text-xs font-bold">

            EDITAR

          </button>


          <button
            class="deleteBtn rounded-full
                   border border-red-500/30
                   text-red-400
                   px-4 py-2
                   text-xs font-bold">

            EXCLUIR

          </button>

        </div>

      </div>

    </div>

  `;


  card
    .querySelector(".editBtn")
    .addEventListener(
      "click",
      () => editProject(project)
    );


  card
    .querySelector(".deleteBtn")
    .addEventListener(
      "click",
      () => deleteProject(project)
    );


  projectList.appendChild(card);

}


// ===============================
// NOVO PROJETO
// ===============================

newBtn?.addEventListener(
  "click",
  () => {

    projectForm.reset();

    projectId.value = "";

    published.checked = true;

    featured.checked = false;

    currentImage.textContent = "";

    formTitle.textContent =
      "Novo projeto";

    formWrap.classList.remove("hidden");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });

  }
);


// ===============================
// CANCELAR
// ===============================

function closeForm() {

  formWrap?.classList.add("hidden");

}


cancelBtn?.addEventListener(
  "click",
  closeForm
);


cancelBtn2?.addEventListener(
  "click",
  closeForm
);


// ===============================
// EDITAR
// ===============================

function editProject(project) {

  projectId.value =
    project.id;

  title.value =
    project.title || "";

  year.value =
    project.year || "";

  division.value =
    project.division || "pictures";

  color.value =
    project.color || "#18bdf2";

  description.value =
    project.description || "";

  featured.checked =
    !!project.featured;

  published.checked =
    !!project.published;

  imageFile.value = "";

  currentImage.textContent =
    project.image_url
      ? "Este projeto já possui uma imagem."
      : "Nenhuma imagem cadastrada.";

  formTitle.textContent =
    "Editar projeto";


  formWrap.classList.remove("hidden");


  formWrap.scrollIntoView({
    behavior: "smooth"
  });

}


// ===============================
// SALVAR PROJETO
// ===============================

projectForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const id =
      projectId.value;


    const projectData = {

      title:
        title.value.trim(),

      year:
        year.value
          ? Number(year.value)
          : null,

      division:
        division.value,

      color:
        color.value,

      description:
        description.value.trim(),

      featured:
        featured.checked,

      published:
        published.checked

    };


    setStatus("Salvando projeto...");


    try {

      // ==========================
      // IMAGEM
      // ==========================

      let imageUrl =
        null;


      if (imageFile.files.length > 0) {

        const file =
          imageFile.files[0];


        const extension =
          file.name
            .split(".")
            .pop()
            .toLowerCase();


        const fileName =
          `${crypto.randomUUID()}.${extension}`;


        const filePath =
          fileName;


        const {
          error: uploadError
        } =
          await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(
              filePath,
              file,
              {
                upsert: false,
                contentType: file.type
              }
            );


        if (uploadError) {

          throw uploadError;

        }


        const {
          data: publicData
        } =
          supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);


        imageUrl =
          publicData.publicUrl;

      }


      // ==========================
      // ATUALIZAR
      // ==========================

      if (id) {

        if (imageUrl) {

          projectData.image_url =
            imageUrl;

        }


        const {
          error
        } =
          await supabase
            .from("projects")
            .update(projectData)
            .eq("id", id);


        if (error) {

          throw error;

        }


        setStatus(
          "Projeto atualizado com sucesso!"
        );

      }


      // ==========================
      // CRIAR
      // ==========================

      else {

        projectData.image_url =
          imageUrl;


        const {
          error
        } =
          await supabase
            .from("projects")
            .insert(projectData);


        if (error) {

          throw error;

        }


        setStatus(
          "Projeto criado com sucesso!"
        );

      }


      closeForm();

      await loadProjects();

    }

    catch (error) {

      console.error(error);

      setStatus(
        "Erro ao salvar: " +
        error.message,
        true
      );

    }

  }
);


// ===============================
// EXCLUIR
// ===============================

async function deleteProject(project) {

  const confirmed =
    confirm(
      `Tem certeza que deseja excluir "${project.title}"?`
    );


  if (!confirmed) return;


  setStatus("Excluindo projeto...");


  const {
    error
  } =
    await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);


  if (error) {

    setStatus(
      "Erro ao excluir: " +
      error.message,
      true
    );

    return;
  }


  setStatus(
    "Projeto excluído."
  );


  await loadProjects();

}


// ===============================
// SEGURANÇA HTML
// ===============================

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ===============================
// VERIFICAR LOGIN
// ===============================

async function checkSession() {

  if (DEMO_MODE) {

    setStatus(
      "Modo demonstração: configure o Supabase em config.js."
    );

    showLogin();

    return;
  }


  const {
    data
  } =
    await supabase.auth.getSession();


  if (data.session) {

    await showDashboard();

  } else {

    showLogin();

  }

}


// ===============================
// INICIAR
// ===============================

checkSession();
