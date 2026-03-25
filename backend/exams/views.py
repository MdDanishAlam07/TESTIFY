from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Exam, Question, Option


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exams(request):
    """
    Returns all exams created by the teacher (excluding templates).
    Students get an empty list (or later you can provide assigned exams).
    """
    if request.user.role == 'teacher':
        exams = Exam.objects.filter(teacher=request.user, is_template=False).values('id', 'title')
    else:
        exams = []  
    return Response(exams)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questions(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

    questions = Question.objects.filter(exam=exam)
    data = []
    for q in questions:
        options = Option.objects.filter(question=q)
        data.append({
            'id': q.id,
            'text': q.text,
            'options': [{'id': o.id, 'text': o.text} for o in options]
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_templates(request):
    """
    Returns all exam templates (for teachers only)
    """
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)

    templates = Exam.objects.filter(is_template=True).values('id', 'title')
    return Response(templates)


from django.db import transaction

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_from_template(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)

    template_id = request.data.get('template_id')
    try:
        template = Exam.objects.get(id=template_id, is_template=True)
    except Exam.DoesNotExist:
        return Response({'error': 'Template not found'}, status=404)


    with transaction.atomic():
        new_exam = Exam.objects.create(
            title=template.title,
            teacher=request.user,
            duration=template.duration,
            is_template=False,
        )

        for q in template.questions.all():
            new_q = Question.objects.create(
                exam=new_exam,
                text=q.text
            )
            for opt in q.options.all():
                Option.objects.create(
                    question=new_q,
                    text=opt.text,
                    is_correct=opt.is_correct
                )

    return Response({'id': new_exam.id, 'title': new_exam.title}, status=201)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_templates(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Not allowed'}, status=403)
    templates = Exam.objects.filter(is_template=True).values('id', 'title')
    return Response(templates)