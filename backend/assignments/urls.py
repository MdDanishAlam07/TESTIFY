from django.urls import path
from . import views

urlpatterns = [
    path('teacher/students/', views.teacher_students, name='teacher_students'),
    path('assign-exam/', views.assign_exam, name='assign_exam'),
    path('student/exams/', views.student_assigned_exams, name='student_assigned_exams'),
    path('teacher/results/<int:exam_id>/', views.teacher_exam_results, name='teacher_exam_results'),
    path('remove-student/', views.remove_student, name='remove_student'),
    path('exam/<int:exam_id>/students/', views.get_assigned_students, name='get_assigned_students'),
    path('follow/', views.follow_teacher),
path('unfollow/', views.unfollow_teacher),
path('my-following/', views.my_following),
path('teachers/', views.all_teachers, name='all_teachers'),
]