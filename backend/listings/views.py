from django.contrib.auth import authenticate
from django.db.models import Count, Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Category, Listing
from .permissions import IsOwnerOrReadOnly
from .serializers import CategorySerializer, ListingSerializer, RegisterSerializer

class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    def get_queryset(self):
        qs = Listing.objects.select_related("owner", "category").prefetch_related("images")
        p = self.request.query_params
        if p.get("search"): qs = qs.filter(Q(title__icontains=p["search"]) | Q(city__icontains=p["search"]) | Q(address__icontains=p["search"]))
        if p.get("category"): qs = qs.filter(category__slug=p["category"])
        if p.get("transaction"): qs = qs.filter(transaction=p["transaction"])
        if p.get("min_price"): qs = qs.filter(price__gte=p["min_price"])
        if p.get("max_price"): qs = qs.filter(price__lte=p["max_price"])
        if p.get("rooms"): qs = qs.filter(rooms__gte=p["rooms"])
        return qs

@api_view(["GET"])
def categories(request):
    return Response(CategorySerializer(Category.objects.annotate(count=Count("listings")), many=True).data)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    s = RegisterSerializer(data=request.data); s.is_valid(raise_exception=True)
    user = s.save(); token = Token.objects.create(user=user)
    return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    user = authenticate(username=request.data.get("username"), password=request.data.get("password"))
    if not user: return Response({"detail": "Погрешно корисничко име или лозинка."}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username})

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request): return Response({"id": request.user.id, "username": request.user.username, "email": request.user.email})

