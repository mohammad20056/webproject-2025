const planten = [
  {
    naam: "cactus",
    prijs: 5.99,
    afbeelding: "images/cacti.jpg"
  },
  {
    naam: "zonnebloem",
    prijs: 7.50,
    afbeelding: "images/zonnebloemen.jpg"
  },
  {
    naam: "rode tulpen",
    prijs: 3.99,
    afbeelding: "images/rodetulpen.jpg"
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
