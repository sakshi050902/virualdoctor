// document.getElementById("mealForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     calculateCalories();
// });

// function calculateCalories() {
//     const name = document.getElementById("name").value;
//     const age = parseInt(document.getElementById("age").value);
//     const gender = document.getElementById("gender").value;
//     const weight = parseFloat(document.getElementById("weight").value);
//     const height = parseFloat(document.getElementById("height").value);
//     const activityLevel = document.getElementById("activity_level").value;

//     let bmr;
//     if (gender === 'male') {
//         bmr = 10 * weight + 6.25 * height - 5 * age + 5;
//     } else {
//         bmr = 10 * weight + 6.25 * height - 5 * age - 161;
//     }

//     let calories;
//     switch (activityLevel) {
//         case 'sedentary':
//             calories = bmr * 1.2;
//             break;
//         case 'lightly_active':
//             calories = bmr * 1.375;
//             break;
//         case 'moderately_active':
//             calories = bmr * 1.55;
//             break;
//         case 'very_active':
//             calories = bmr * 1.725;
//             break;
//         case 'super_active':
//             calories = bmr * 1.9;
//             break;
//         default:
//             calories = bmr * 1.2;
//     }

//     calories = Math.round(calories);

//     alert(`Hello ${name}, your daily required calorie intake is ${calories} calories.`);

//     displayHealthRecommendations(calories, weight, age, activityLevel);
// }

// function displayHealthRecommendations(calories, weight, age, activityLevel) {
//     const waterIntake = (weight * 0.033).toFixed(2);
//     const sleepDuration = (age < 18) ? '8-10' : (age <= 64) ? '7-9' : '7-8';
//     const walkingDuration = (calories / 100).toFixed(2);
//     const activitySuggestions = suggestPhysicalActivities(activityLevel);

//     let recommendations = `💧 Drink at least ${waterIntake} liters of water daily.\n`;
//     recommendations += `🛌 Aim for ${sleepDuration} hours of sleep per night.\n`;
//     recommendations += `🚶‍♂️ Walk for at least ${walkingDuration} minutes daily.\n`;
//     recommendations += `Based on your activity level (${activityLevel}), we suggest the following physical activities:\n`;

//     activitySuggestions.forEach(activity => {
//         recommendations += ` - ${activity}\n`;
//     });

//     alert(recommendations);
// }

// function suggestPhysicalActivities(activityLevel) {
//     const activities = {
//         'sedentary': [
//             "Light stretching",
//             "Walking (leisurely pace)",
//             "Desk exercises",
//             "Yoga (beginner level)"
//         ],
//         'lightly_active': [
//             "Brisk walking",
//             "Dancing",
//             "Light jogging",
//             "Cycling (leisure pace)"
//         ],
//         'moderately_active': [
//             "Running",
//             "Swimming",
//             "Hiking",
//             "Strength training (moderate intensity)"
//         ],
//         'very_active': [
//             "High-intensity interval training (HIIT)",
//             "CrossFit",
//             "Competitive sports",
//             "Intense cycling"
//         ],
//         'super_active': [
//             "Marathon training",
//             "Triathlon training",
//             "Professional athletic training",
//             "Intense weightlifting"
//         ]
//     };
//     return activities[activityLevel] || [];
// }

// Function to fetch ingredients from Flask API
function fetchIngredientsFromServer(callback) {
    fetch('/get_ingredients')
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
        });
}

// Function to display ingredients checkboxes
function displayIngredients(ingredients, containerId) {
    const container = document.getElementById(containerId);
    ingredients.forEach(ingredient => {
        const checkboxItem = document.createElement('div');
        checkboxItem.classList.add('form-check');
        checkboxItem.innerHTML = `
            <input class="form-check-input" type="checkbox" id="${containerId}-${ingredient.name}" name="${containerId}-ingredient" value="${ingredient.name}">
            <label class="form-check-label" for="${containerId}-${ingredient.name}">${ingredient.name} - ${ingredient.calories_per_unit} calories</label>
        `;
        container.appendChild(checkboxItem);
    });
}

// Event listener for form submission
document.getElementById('mealForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const selectedMeals = {
        breakfast: getSelectedIngredients('breakfastIngredients'),
        lunch: getSelectedIngredients('lunchIngredients'),
        dinner: getSelectedIngredients('dinnerIngredients')
    };

    console.log('Selected meals:', selectedMeals);
    alert(`Selected meals:\n\nBreakfast: ${selectedMeals.breakfast.join(', ')}\nLunch: ${selectedMeals.lunch.join(', ')}\nDinner: ${selectedMeals.dinner.join(', ')}`);
});

// Function to get selected ingredients from a container
function getSelectedIngredients(containerId) {
    const selectedIngredients = [];
    const checkboxes = document.querySelectorAll(`input[name="${containerId}-ingredient"]:checked`);
    checkboxes.forEach(checkbox => {
        selectedIngredients.push(checkbox.value);
    });
    return selectedIngredients;
}

// Initialize by fetching ingredients when the page loads
fetchIngredientsFromServer(function(ingredients) {
    displayIngredients(ingredients, 'breakfastIngredients');
    displayIngredients(ingredients, 'lunchIngredients');
    displayIngredients(ingredients, 'dinnerIngredients');
});
