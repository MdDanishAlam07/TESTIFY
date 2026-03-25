from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from exams.models import Exam, Question, Option

TEMPLATES = [
    "SQL",
    "JS",
    "HTML",
    "CSS",
    "C++",
    "Python",
    "Java",
    "C",
    "OOP",
    "Computer Networks",
    "Islamic Knowledge"
    "Math"
]

class Command(BaseCommand):
    help = "Load predefined exam templates with 50 questions each"

    def handle(self, *args, **kwargs):
        system_teacher, _ = User.objects.get_or_create(
            email="system@testify.com",
            defaults={
                "password": "dummy",
                "role": "teacher",
                "is_active": True,
            }
        )
        system_teacher.set_unusable_password()
        system_teacher.save()

        for template_name in TEMPLATES:
            if Exam.objects.filter(title=template_name, is_template=True).exists():
                self.stdout.write(f"Template {template_name} already exists.")
                continue

            exam = Exam.objects.create(
                title=template_name,
                teacher=system_teacher,
                is_template=True,
                duration=60
            )
            for i in range(1, 51):
                q = Question.objects.create(
                    exam=exam,
                    text=f"Question {i} about {template_name}: Sample question text?"
                )
                for j, opt_text in enumerate(["Option A", "Option B", "Option C", "Option D"]):
                    Option.objects.create(
                        question=q,
                        text=opt_text,
                        is_correct=(j == 0)
                    )
            self.stdout.write(f"Created template: {template_name}")

        self.stdout.write(self.style.SUCCESS("All templates loaded."))