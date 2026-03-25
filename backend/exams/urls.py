from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_exams, name='get_exams'),
    path('templates/', views.get_templates, name='get_templates'),
    path('create-from-template/', views.create_from_template, name='create_from_template'),
    path('<int:exam_id>/questions/', views.get_questions, name='get_questions'),
]