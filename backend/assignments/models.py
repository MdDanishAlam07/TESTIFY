from django.db import models
from accounts.models import User
from exams.models import Exam

class Follow(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'teacher')

    def __str__(self):
        return f"{self.student.email} follows {self.teacher.email}"

class ExamAssignment(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='assignments')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_exams')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('exam', 'student')

    def __str__(self):
        return f"{self.exam.title} assigned to {self.student.email}"