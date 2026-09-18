from django.contrib.auth.models import User
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=10, default="🏠")
    class Meta: verbose_name_plural = "Categories"



    def __str__(self): return self.name

class Listing(models.Model):
    TRANSACTION = [("sale", "Продажба"), ("rent", "Изнајмување")]
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="listings")
    title = models.CharField(max_length=150)
    description = models.TextField()
    city = models.CharField(max_length=80)
    address = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    area = models.PositiveIntegerField(help_text="m²")
    rooms = models.PositiveSmallIntegerField()
    bathrooms = models.PositiveSmallIntegerField(default=1)
    floor = models.SmallIntegerField(null=True, blank=True)
    transaction = models.CharField(max_length=10, choices=TRANSACTION, default="sale")
    furnished = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    phone = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: ordering = ["-featured", "-created_at"]


    def __str__(self): return self.title

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="listings/%Y/%m/")

    def __str__(self): return f"Слика за {self.listing.title}"

