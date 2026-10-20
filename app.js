const meals = [
  {name:"Sesame tofu rice bowl", cuisine:"Asian", price:11.50, time:20, emoji:"🍚", description:"Crispy tofu, brown rice, crunchy greens, and a tangy sesame drizzle.", details:"A quick, feel-good bowl with plenty of flavor."},
  {name:"Chicken veggie stir-fry", cuisine:"Asian", price:13.00, time:25, emoji:"🥡", description:"Tender chicken and colorful vegetables tossed in a ginger soy sauce.", details:"Ready fast and easy to keep under budget."},
  {name:"Peanut noodle bowl", cuisine:"Asian", price:10.00, time:15, emoji:"🍜", description:"Warm noodles with crisp vegetables and creamy peanut-lime sauce.", details:"A speedy option with a satisfying kick."},
  {name:"Crispy chicken sandwich", cuisine:"American", price:12.00, time:25, emoji:"🍔", description:"Golden chicken, crunchy lettuce, pickles, and house sauce on a toasted bun.", details:"A classic comfort-food pick that’s quick to enjoy."},
  {name:"Loaded sweet potato", cuisine:"American", price:9.50, time:40, emoji:"🍠", description:"Roasted sweet potato with black beans, avocado, and a cool lime crema.", details:"A hearty, budget-friendly plate with fresh toppings."},
  {name:"Turkey avocado wrap", cuisine:"American", price:10.50, time:15, emoji:"🌯", description:"Smoky turkey, ripe avocado, greens, and tomato in a soft wrap.", details:"A fresh, filling lunch ready in a flash."},
  {name:"Lemon ricotta pasta", cuisine:"Italian", price:14.00, time:25, emoji:"🍝", description:"Silky ricotta, lemon zest, and parmesan folded through tender pasta.", details:"Comforting Italian flavor in under half an hour."},
  {name:"Margherita flatbread", cuisine:"Italian", price:12.50, time:20, emoji:"🍕", description:"Toasty flatbread with tomato, creamy mozzarella, and fresh basil.", details:"A quick, simple favorite that stays within budget."},
  {name:"Tomato basil gnocchi", cuisine:"Italian", price:15.00, time:35, emoji:"🥘", description:"Pillowy potato gnocchi in a bright tomato and basil sauce.", details:"A cozy, satisfying meal for an easy evening."},
  {name:"Black bean tacos", cuisine:"Mexican", price:9.00, time:15, emoji:"🌮", description:"Spiced black beans, crunchy cabbage, salsa, and avocado in warm tortillas.", details:"Fast, colorful, and especially kind to your budget."},
  {name:"Chicken burrito bowl", cuisine:"Mexican", price:13.50, time:25, emoji:"🥑", description:"Citrus chicken, rice, corn salsa, and a spoonful of creamy guacamole.", details:"A filling bowl with bright Mexican-inspired flavors."},
  {name:"Cheesy veggie quesadilla", cuisine:"Mexican", price:10.00, time:20, emoji:"🫓", description:"Crisp tortillas filled with melty cheese, peppers, and sweet corn.", details:"A warm, easy favorite that’s on the table quickly."}
];

const form = document.querySelector("#food-form");
const budgetInput = document.querySelector("#budget");
const timeSelect = document.querySelector("#time");
const results = document.querySelector("#results");
const recommendations = document.querySelector("#recommendations");
const validation = document.querySelector("#validation-message");
const subtitle = document.querySelector("#results-subtitle");
const chooseButton = document.querySelector("#choose-button");
const choiceMessage = document.querySelector("#choice-message");
let selectedCuisine = "Any";
let currentMeals = [];

document.querySelectorAll(".cuisine").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCuisine = button.dataset.cuisine;
    document.querySelectorAll(".cuisine").forEach((option) => {
      const active = option === button;
      option.classList.toggle("selected", active);
      option.setAttribute("aria-pressed", String(active));
    });
  });
});

function renderMeals(items, budget, time) {
  recommendations.replaceChildren();
  choiceMessage.hidden = true;
  currentMeals = items;
  chooseButton.disabled = items.length === 0;
  chooseButton.style.opacity = items.length === 0 ? ".5" : "1";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = '<div class="empty-emoji">🥣</div><h3>No matches just yet</h3><p>Try a higher budget or a little more time, and we’ll find something tasty.</p>';
    recommendations.append(empty);
    subtitle.textContent = `Nothing matched ${selectedCuisine === "Any" ? "your" : `${selectedCuisine}`} cuisine, $${budget.toFixed(2)} budget, and ${time} minute limit.`;
    return;
  }

  const shown = items.slice(0, 3);
  subtitle.textContent = shown.length === 3
    ? `Three tasty ideas under $${budget.toFixed(2)} and ready within ${time} minutes.`
    : `We found ${shown.length} idea${shown.length === 1 ? "" : "s"} under $${budget.toFixed(2)} and ready within ${time} minutes.`;
  shown.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "food-card";
    card.dataset.meal = meal.name;
    card.innerHTML = `<div class="card-top"><div class="food-illustration" aria-hidden="true">${meal.emoji}</div><span class="price-pill">$${meal.price.toFixed(2)}</span></div><p class="card-cuisine">${meal.cuisine} · ${meal.time} min</p><h3>${meal.name}</h3><p class="food-description">${meal.description}</p><div class="match-reason"><span>✦</span><strong>Why it fits:</strong> ${meal.details}</div>`;
    recommendations.append(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const budget = Number(budgetInput.value);
  const time = Number(timeSelect.value);
  if (!Number.isFinite(budget) || budget <= 0 || budget > 500) {
    validation.textContent = "Enter a budget greater than $0 and no more than $500.";
    validation.hidden = false;
    budgetInput.setAttribute("aria-invalid", "true");
    budgetInput.focus();
    return;
  }
  validation.hidden = true;
  budgetInput.removeAttribute("aria-invalid");
  const matches = meals.filter((meal) => (selectedCuisine === "Any" || meal.cuisine === selectedCuisine) && meal.price <= budget && meal.time <= time);
  renderMeals(matches, budget, time);
  results.hidden = false;
  results.scrollIntoView({behavior:"smooth", block:"start"});
});

budgetInput.addEventListener("input", () => {
  if (!validation.hidden) {
    validation.hidden = true;
    budgetInput.removeAttribute("aria-invalid");
  }
});

chooseButton.addEventListener("click", () => {
  if (!currentMeals.length) return;
  const cards = [...recommendations.querySelectorAll(".food-card")];
  cards.forEach((card) => {
    card.classList.remove("chosen");
    card.querySelector(".chosen-label")?.remove();
  });
  const picked = cards[Math.floor(Math.random() * cards.length)];
  picked.classList.add("chosen");
  const label = document.createElement("span");
  label.className = "chosen-label";
  label.textContent = "✦ YOUR PICK";
  picked.append(label);
  choiceMessage.textContent = `The choice is made: ${picked.dataset.meal}!`;
  choiceMessage.hidden = false;
  picked.scrollIntoView({behavior:"smooth", block:"nearest"});
});
