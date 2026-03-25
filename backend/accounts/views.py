from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    if not email or not password or role not in ['teacher', 'student']:
        return Response({'error': 'Invalid data'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)

    user = User.objects.create_user(email=email, password=password, role=role)
    return Response({'msg': 'User created successfully'}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # Debug prints (remove after testing)
    print("=== LOGIN REQUEST ===")
    print("Request data:", request.data)
    email = request.data.get('email')
    password = request.data.get('password')
    print(f"Extracted email: {email}, password: {password}")
    user = authenticate(email=email, password=password)
    print(f"Authenticated user: {user}")

    # Actual login logic
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'role': user.role
        })
    return Response({'error': 'Invalid credentials'}, status=401)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if not email or not password or role not in ['teacher', 'student']:
        return Response({'error': 'Invalid data'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)

    user = User.objects.create_user(
        email=email,
        password=password,
        role=role,
        first_name=first_name,
        last_name=last_name
    )
    return Response({'msg': 'User created successfully'}, status=201)



@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'role': user.role,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
    return Response({'error': 'Invalid credentials'}, status=401)