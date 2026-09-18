from django.contrib import admin
from .models import Category, Listing, ListingImage
class ImageInline(admin.TabularInline): model = ListingImage; extra = 1
@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "city", "price", "transaction", "owner", "featured"]
    list_filter = ["category", "transaction", "city", "featured"]
    search_fields = ["title", "city", "address"]
    inlines = [ImageInline]
admin.site.register(Category)

