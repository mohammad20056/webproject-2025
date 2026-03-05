<<<<<<< HEAD
=======
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
>>>>>>> f5af11a229aac67bb8dba315b69b7d25af2dd2ed
const planten = [
  {
    naam: "cactus",
    prijs: 5.99,
<<<<<<< HEAD
    afbeelding: ""
=======
    afbeelding: "images/cactus.jpg"
>>>>>>> f5af11a229aac67bb8dba315b69b7d25af2dd2ed
  },
  {
    naam: "zonnebloem",
    prijs: 7.50,
<<<<<<< HEAD
    afbeelding: ""
=======
    afbeelding: "images/zonnebloemen.jpg"
>>>>>>> f5af11a229aac67bb8dba315b69b7d25af2dd2ed
  },
  {
    naam: "rode tulpen",
    prijs: 3.99,
    afbeelding: ""
  },
   
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
