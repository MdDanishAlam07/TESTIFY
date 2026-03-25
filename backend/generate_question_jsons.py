import json
import os

SUBJECTS = [
    "HTML",
    "SQL",
    "JS",
    "CSS",
    "C++",
    "Python",
    "Java",
    "C",
    "OOP",
    "Computer Networks",
    "Islamic Knowledge"
]

def generate_questions(subject, count=50):
    questions = []
    for i in range(1, count+1):
        q = {
            "text": f"{subject} Question {i}: What is the correct answer?",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "correct": 0   # first option is correct (you can change later)
        }
        questions.append(q)
    return questions

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(output_dir, exist_ok=True)
    for subject in SUBJECTS:
        filename = f"{subject}.json"
        filepath = os.path.join(output_dir, filename)
        questions = generate_questions(subject)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(questions, f, indent=2)
        print(f"Created {filename}")
    print("Done. Edit the JSON files in the 'data' folder to replace the placeholder questions with real ones.")