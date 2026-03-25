from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_exam, name='submit_exam'),
    path('my-results/', views.my_results, name='my_results'),
]