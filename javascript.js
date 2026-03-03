<<<<<<< HEAD
const plants = [
  {
    id: 1,
    name: "Monstera",
    price: 24.99,
    image: "images/monstera.jpg"
  },
  {
    id: 2,
    name: "Ficus",
    price: 19.99,
    image: "images/ficus.jpg"
  },
  {
    id: 3,
    name: "Cactus",
    price: 9.99,
    image: "images/cactus.jpg"
  }
];
=======
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
>>>>>>> 302d48ee644b027b2db8895b57a01b537f7e30e7
