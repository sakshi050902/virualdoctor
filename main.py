import streamlit as st
import csv

# Function to read ingredients from CSV file
def read_ingredients_from_csv(filename):
    ingredients = []
    with open(filename, 'r', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            ingredients.append({
                'name': row['name'],
                'calories_per_unit': int(row['calories_per_unit']),
                'proteins': float(row['proteins']),
                'fats': float(row['fats']),
                'carbohydrates': float(row['carbohydrates'])
            })
    return ingredients

# Function to calculate required calorie intake
def calculate_calories(age, gender, weight, height, activity_level):
    if gender.lower() == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    activity_multiplier = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Super Active': 1.9
    }

    calories = bmr * activity_multiplier.get(activity_level, 1.2)
    return int(calories)

# Initialize session state for inputs
if "user_data" not in st.session_state:
    st.session_state.user_data = {
        "name": "",
        "age": 25,
        "gender": "Male",
        "weight": 70.0,
        "height": 170.0,
        "activity_level": "Sedentary",
        "selected_ingredients": {}
    }

# Streamlit App
st.title("Personalized Meal Planner and Health Recommendations 🥗💪")

# Step 1: Input Personal Information
st.header("Step 1: Enter Your Personal Information")
st.session_state.user_data["name"] = st.text_input("Enter your name:", st.session_state.user_data["name"])
st.session_state.user_data["age"] = st.number_input(
    "Enter your age:", min_value=0, max_value=120, value=st.session_state.user_data["age"], step=1
)
st.session_state.user_data["gender"] = st.selectbox(
    "Select your gender:", ["Male", "Female"], index=["Male", "Female"].index(st.session_state.user_data["gender"])
)
st.session_state.user_data["weight"] = st.number_input(
    "Enter your weight (in kg):", min_value=0.0, max_value=200.0, value=st.session_state.user_data["weight"], step=0.1
)
st.session_state.user_data["height"] = st.number_input(
    "Enter your height (in cm):", min_value=0.0, max_value=250.0, value=st.session_state.user_data["height"], step=0.1
)
st.session_state.user_data["activity_level"] = st.selectbox(
    "Select your activity level:", 
    ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Super Active"], 
    index=["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Super Active"].index(st.session_state.user_data["activity_level"])
)

if st.button("Calculate Daily Calorie Requirement"):
    required_calories = calculate_calories(
        st.session_state.user_data["age"],
        st.session_state.user_data["gender"],
        st.session_state.user_data["weight"],
        st.session_state.user_data["height"],
        st.session_state.user_data["activity_level"]
    )
    st.session_state.user_data["required_calories"] = required_calories
    st.success(f"Your required daily calorie intake is: {required_calories} calories.")

# Step 2: Meal Planning
if "required_calories" in st.session_state.user_data:
    st.header("Step 2: Meal Planning")
    st.info("We'll divide your daily calorie intake into breakfast, lunch, and dinner.")
    ingredients = read_ingredients_from_csv('ingredients.csv')
    
    recommended_calories = {
        'Breakfast': int(0.25 * st.session_state.user_data["required_calories"]),
        'Lunch': int(0.35 * st.session_state.user_data["required_calories"]),
        'Dinner': int(0.40 * st.session_state.user_data["required_calories"])
    }

    for meal_name, max_calories in recommended_calories.items():
        st.subheader(f"{meal_name} (Target: {max_calories} calories)")
        selected_ingredients = st.multiselect(
            f"Select ingredients for {meal_name}:",
            options=[ingredient['name'] for ingredient in ingredients],
            default=st.session_state.user_data["selected_ingredients"].get(meal_name, [])
        )
        st.session_state.user_data["selected_ingredients"][meal_name] = selected_ingredients

        total_calories = sum(
            ingredient['calories_per_unit'] for ingredient in ingredients if ingredient['name'] in selected_ingredients
        )
        st.write(f"Total Calories: {total_calories} kcal")

# Step 3: Recommendations
if "required_calories" in st.session_state.user_data:
    st.header("Step 3: Health Recommendations")
    weight = st.session_state.user_data["weight"]
    water_intake = round(weight * 0.033, 2)
    st.write(f"💧 Recommended Water Intake: {water_intake} liters/day")
