from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Follow, ExamAssignment
from exams.models import Exam
from accounts.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_students(request):
    # Get students who follow this teacher
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)

    followers = Follow.objects.filter(teacher=request.user).select_related('student')
    students = [{'id': f.student.id, 'email': f.student.email} for f in followers]
    return Response(students)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_exam(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)

    exam_id = request.data.get('exam_id')
    student_ids = request.data.get('student_ids', [])

    try:
        exam = Exam.objects.get(id=exam_id, teacher=request.user)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

    for sid in student_ids:
        ExamAssignment.objects.get_or_create(exam=exam, student_id=sid)

    return Response({'msg': 'Assigned successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_assigned_exams(request):
    if request.user.role != 'student':
        return Response({'error': 'Not allowed'}, status=403)

    assignments = ExamAssignment.objects.filter(student=request.user).select_related('exam')
    exams = [{'id': a.exam.id, 'title': a.exam.title} for a in assignments]
    return Response(exams)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_exam_results(request, exam_id):
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)

    try:
        exam = Exam.objects.get(id=exam_id, teacher=request.user)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

    from results.models import Result
    results = Result.objects.filter(exam=exam).select_related('student')
    data = [{
        'student_email': r.student.email,
        'score': r.score,
        'total': r.total_questions,
        'percentage': round(r.score / r.total_questions * 100, 2),
        'submitted_at': r.submitted_at
    } for r in results]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_student(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)
    exam_id = request.data.get('exam_id')
    student_id = request.data.get('student_id')
    try:
        exam = Exam.objects.get(id=exam_id, teacher=request.user)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)
    ExamAssignment.objects.filter(exam=exam, student_id=student_id).delete()
    return Response({'msg': 'Student removed'})
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_students(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id, teacher=request.user)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)
    assignments = ExamAssignment.objects.filter(exam=exam).select_related('student')
    students = [{'id': a.student.id, 'email': a.student.email} for a in assignments]
    return Response(students)



from .models import Follow

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_teacher(request):
    if request.user.role != 'student':
        return Response({'error': 'Only students can follow'}, status=403)
    teacher_id = request.data.get('teacher_id')
    try:
        teacher = User.objects.get(id=teacher_id, role='teacher')
    except User.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=404)
    Follow.objects.get_or_create(student=request.user, teacher=teacher)
    return Response({'msg': 'Following'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_teacher(request):
    if request.user.role != 'student':
        return Response({'error': 'Only students can unfollow'}, status=403)
    teacher_id = request.data.get('teacher_id')
    Follow.objects.filter(student=request.user, teacher_id=teacher_id).delete()
    return Response({'msg': 'Unfollowed'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_following(request):
    if request.user.role != 'student':
        return Response({'error': 'Not allowed'}, status=403)
    follows = Follow.objects.filter(student=request.user).select_related('teacher')
    data = [{'id': f.teacher.id, 'email': f.teacher.email} for f in follows]
    return Response(data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_teachers(request):
    if request.user.role != 'student':
        return Response({'error': 'Not allowed'}, status=403)
    teachers = User.objects.filter(role='teacher').values('id', 'email')
    return Response(teachers)