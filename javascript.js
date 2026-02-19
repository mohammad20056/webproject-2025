const planten = [
  {
    naam: "",
    prijs: ,
    afbeelding: ""
  },
  {
    naam: "",
    prijs: ,
    afbeelding: ""
  },
  {
    naam: "",
    prijs: ,
    afbeelding: ""
  }
];
const container = document.getElementById("assortiment");

planten.forEach(plant => {
  const plantCard = document.createElement("div");
  plantCard.classList.add("plant-card");

  plantCard.innerHTML = `
    <img src="${plant.afbeelding}" alt="${plant.naam}">
    <h2>${plant.naam}</h2>
    <p>€ ${plant.prijs}</p>
  `;

  container.appendChild(plantCard);
});
