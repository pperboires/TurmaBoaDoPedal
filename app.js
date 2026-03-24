function calculateDaysSince(dateString) {
  const lastChangeDate = new Date(`${dateString}T00:00:00`);
  const now = new Date();

  if (Number.isNaN(lastChangeDate.getTime())) {
    throw new Error("Data de ultima troca invalida.");
  }

  const diffMs = now.getTime() - lastChangeDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, days);
}

async function loadBikeData() {
  const imageElement = document.getElementById("bike-image");
  const modelElement = document.getElementById("bike-model");
  const counterElement = document.getElementById("days-without-change");

  try {
    const response = await fetch("./data/bike.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os dados da bike.");
    }

    const bike = await response.json();
    const daysWithoutChange = calculateDaysSince(bike.ultimaTrocaEm);

    imageElement.src = bike.foto;
    imageElement.alt = bike.alt || "Foto da bike atual do Rafael";
    modelElement.textContent = bike.modelo;
    counterElement.textContent = `Rafael está há ${daysWithoutChange} dias sem trocar de bike.`;
  } catch (error) {
    modelElement.textContent = "Erro ao carregar dados.";
    counterElement.textContent =
      "Nao foi possivel exibir o contador no momento.";
    imageElement.alt = "Imagem indisponivel";
  }
}

loadBikeData();
