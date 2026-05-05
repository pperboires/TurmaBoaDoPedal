function parseLocalDate(dateString) {
  const d = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Data invalida.");
  }
  return d;
}

function calculateDaysSince(dateString) {
  const lastChangeDate = parseLocalDate(dateString);
  const now = new Date();

  const diffMs = now.getTime() - lastChangeDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, days);
}

function calculateDaysBetween(startDateString, endDateString) {
  const start = parseLocalDate(startDateString);
  const end = parseLocalDate(endDateString);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function formatDateBR(dateString) {
  const d = parseLocalDate(dateString);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function computeRecordMax(diasAtual, historico) {
  const entries = Array.isArray(historico) ? historico : [];
  const historicDays = entries.map((h) =>
    calculateDaysBetween(h.comprouEm, h.vendeuEm),
  );
  return Math.max(diasAtual, ...historicDays, 0);
}

/** Maior duração já registrada só no histórico (sem a bike atual). */
function computeHistoricMax(historico) {
  const entries = Array.isArray(historico) ? historico : [];
  const historicDays = entries.map((h) =>
    calculateDaysBetween(h.comprouEm, h.vendeuEm),
  );
  return Math.max(0, ...historicDays);
}

function shouldShowRecordBadges(historico) {
  return Array.isArray(historico) && historico.length > 0;
}

function renderHistorico(entries, recordMax, showBadges) {
  const root = document.getElementById("historico-root");
  const section = document.getElementById("historico-section");
  if (!root || !section) return;

  if (!Array.isArray(entries) || entries.length === 0) {
    section.hidden = true;
    root.innerHTML = "";
    return;
  }

  section.hidden = false;
  const sorted = [...entries].sort((a, b) => {
    const endA = a.vendeuEm || "";
    const endB = b.vendeuEm || "";
    return endB.localeCompare(endA);
  });

  const badgeHtml =
    showBadges && recordMax > 0
      ? `<span class="record-badge" aria-label="Recorde de dias com a mesma bike">Recorde</span>`
      : "";

  root.innerHTML = sorted
    .map((item) => {
      const dias = calculateDaysBetween(item.comprouEm, item.vendeuEm);
      const isRecord =
        showBadges && recordMax > 0 && dias === recordMax;
      const alt =
        item.alt || `Foto da ${item.modelo} (histórico)`;
      return `
        <article class="historico-row">
          <div class="historico-photo-wrap">
            <img
              class="historico-photo"
              src="${item.foto}"
              alt="${alt.replace(/"/g, "&quot;")}"
              loading="lazy"
            />
          </div>
          <table class="historico-table">
            <tbody>
              <tr>
                <th scope="row">Modelo</th>
                <td>${item.modelo}</td>
              </tr>
              <tr>
                <th scope="row">Comprou em</th>
                <td>${formatDateBR(item.comprouEm)}</td>
              </tr>
              <tr>
                <th scope="row">Vendeu em</th>
                <td>${formatDateBR(item.vendeuEm)}</td>
              </tr>
              <tr>
                <th scope="row">Dias com ela</th>
                <td class="dias-cell">
                  <span>${dias} ${dias === 1 ? "dia" : "dias"}</span>
                  ${isRecord ? badgeHtml : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      `;
    })
    .join("");
}

async function loadBikeData() {
  const imageElement = document.getElementById("bike-image");
  const modelElement = document.getElementById("bike-model");
  const counterElement = document.getElementById("days-without-change");
  const currentRecordBadge = document.getElementById("current-record-badge");

  try {
    const response = await fetch("./data/bike.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os dados da bike.");
    }

    const bike = await response.json();
    const daysWithoutChange = calculateDaysSince(bike.ultimaTrocaEm);
    const recordMax = computeRecordMax(daysWithoutChange, bike.historico);
    const showBadges = shouldShowRecordBadges(bike.historico);
    const historicMax = computeHistoricMax(bike.historico);
    const currentIsRecord =
      showBadges &&
      daysWithoutChange > 0 &&
      daysWithoutChange > historicMax;

    imageElement.src = bike.foto;
    imageElement.alt = bike.alt || "Foto da bike atual do Rafael";
    modelElement.textContent = bike.modelo;
    counterElement.textContent = `Rafael está há ${daysWithoutChange} dias sem trocar de bike.`;

    if (currentRecordBadge) {
      currentRecordBadge.hidden = !currentIsRecord;
    }

    renderHistorico(bike.historico, recordMax, showBadges);
  } catch (error) {
    modelElement.textContent = "Erro ao carregar dados.";
    counterElement.textContent =
      "Nao foi possivel exibir o contador no momento.";
    imageElement.alt = "Imagem indisponivel";
    if (currentRecordBadge) {
      currentRecordBadge.hidden = true;
    }
    renderHistorico([], 0, false);
  }
}

loadBikeData();
