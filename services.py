import os
import json
import google.generativeai as geniker

# Configure the Gemini Client
geniker.configure(api_key=os.environ.get('GEMINI_API_KEY'))

def parse_meal_with_gemini(text):
    """
    Uses Gemini 1.5 Flash to parse natural language into nutrition data.
    """
    try:
        # Using the fast and cost-effective Flash model
        model = geniker.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Analyze the following Indian food description: "{text}".
        Return a strictly valid JSON object with these exact keys: 
        "name" (concise summary), "calories", "protein", "carbs", "fats", "fiber", "sugar", "sodium".
        
        Rules:
        1. Estimate quantities based on standard Indian serving sizes if not specified.
        2. Calculate totals if multiple items are listed.
        3. Return ONLY the JSON object, no markdown formatting.
        
        Example Input: "2 roti and dal"
        Example Output:
        {{
            "name": "2 Roti + Dal",
            "calories": 360,
            "protein": 16.5,
            "carbs": 60,
            "fats": 9.0,
            "fiber": 6.5,
            "sugar": 2.0,
            "sodium": 400
        }}
        """

        response = model.generate_content(prompt)
        
        # Clean up response text (remove markdown code blocks if present)
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_text)

    except Exception as e:
        print(f"Gemini AI Error: {e}")
        return None