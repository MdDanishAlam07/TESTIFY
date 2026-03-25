from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from exams.models import Option, Exam, Question
from .models import Result
from assignments.models import ExamAssignment   

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam(request):
    if request.user.role != 'student':
        return Response({'error': 'Only students can submit'}, status=403)

    exam_id = request.data.get('exam_id')
    answers = request.data.get('answers', [])

    try:
        exam = Exam.objects.get(id=exam_id)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

    if not ExamAssignment.objects.filter(exam=exam, student=request.user).exists():
        return Response({'error': 'You are not allowed to take this exam'}, status=403)

    if Result.objects.filter(exam=exam, student=request.user).exists():
        return Response({'error': 'You have already taken this exam'}, status=400)

    total_questions = Question.objects.filter(exam=exam).count()
    score = 0
    for ans in answers:
        q_id = ans.get('question_id')
        opt_id = ans.get('option_id')
        try:
            option = Option.objects.get(id=opt_id, question_id=q_id)
            if option.is_correct:
                score += 1
        except Option.DoesNotExist:
            pass

    Result.objects.create(
        student=request.user,
        exam=exam,
        score=score,
        total_questions=total_questions
    )

    return Response({'score': score, 'total': total_questions})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_results(request):
    if request.user.role != 'student':
        return Response({'error': 'Not allowed'}, status=403)
    results = Result.objects.filter(student=request.user).select_related('exam')
    data = [{
        'exam_title': r.exam.title,
        'score': r.score,
        'total': r.total_questions,
        'percentage': round(r.score / r.total_questions * 100, 2) if r.total_questions else 0,
        'submitted_at': r.submitted_at
    } for r in results]
    return Response(data)