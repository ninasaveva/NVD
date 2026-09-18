from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Listing, ListingImage

class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)
    class Meta: model = Category; fields = ["id", "name", "slug", "icon", "count"]

class ImageSerializer(serializers.ModelSerializer):
    class Meta: model = ListingImage; fields = ["id", "image"]

class ListingSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source="owner.username", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    uploaded_images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    is_owner = serializers.SerializerMethodField()
    class Meta:
        model = Listing
        fields = ["id", "owner_name", "is_owner", "category", "category_name", "title", "description", "city", "address", "price", "area", "rooms", "bathrooms", "floor", "transaction", "furnished", "featured", "phone", "created_at", "images", "uploaded_images"]
        read_only_fields = ["featured"]
    def get_is_owner(self, obj):
        user = self.context["request"].user
        return user.is_authenticated and obj.owner_id == user.id
    def create(self, validated_data):
        images = validated_data.pop("uploaded_images", [])
        listing = Listing.objects.create(owner=self.context["request"].user, **validated_data)
        for image in images: ListingImage.objects.create(listing=listing, image=image)
        return listing
    def update(self, instance, validated_data):
        images = validated_data.pop("uploaded_images", [])
        instance = super().update(instance, validated_data)
        for image in images: ListingImage.objects.create(listing=instance, image=image)
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta: model = User; fields = ["username", "email", "password"]
    def create(self, data): return User.objects.create_user(**data)

