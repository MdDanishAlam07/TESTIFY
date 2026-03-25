import json
import os
from django.core.management.base import BaseCommand
from exams.models import Exam, Question, Option
from accounts.models import User

class Command(BaseCommand):
    help = 'Load real questions from JSON files into template exams'

    def add_arguments(self, parser):
        parser.add_argument('--data_dir', type=str, required=True, help='Path to directory containing JSON files')

    def handle(self, *args, **options):
        data_dir = options['data_dir']
        templates = {exam.title: exam for exam in Exam.objects.filter(is_template=True)}
        for filename in os.listdir(data_dir):
            if not filename.endswith('.json'):
                continue
            subject = filename.replace('.json', '')
            if subject not in templates:
                self.stdout.write(f"Template '{subject}' not found, skipping.")
                continue
            exam = templates[subject]
            exam.questions.all().delete()
            with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
                questions_data = json.load(f)
            for idx, qdata in enumerate(questions_data, start=1):
                q = Question.objects.create(
                    exam=exam,
                    text=qdata['text']
                )
                for i, opt_text in enumerate(qdata['options']):
                    Option.objects.create(
                        question=q,
                        text=opt_text,
                        is_correct=(i == qdata['correct'])
                    )
                self.stdout.write(f"Added question {idx} for {subject}")
            self.stdout.write(self.style.SUCCESS(f"Loaded {len(questions_data)} questions for {subject}"))



