from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [("auth", "0012_alter_user_first_name_max_length")]
    operations = [
        migrations.CreateModel(name="Category", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("name", models.CharField(max_length=50)), ("slug", models.SlugField(unique=True)), ("icon", models.CharField(default="🏠", max_length=10))], options={"verbose_name_plural": "Categories"}),
        migrations.CreateModel(name="Listing", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("title", models.CharField(max_length=150)), ("description", models.TextField()), ("city", models.CharField(max_length=80)), ("address", models.CharField(max_length=150)), ("price", models.DecimalField(decimal_places=2, max_digits=12)), ("area", models.PositiveIntegerField(help_text="m²")), ("rooms", models.PositiveSmallIntegerField()), ("bathrooms", models.PositiveSmallIntegerField(default=1)), ("floor", models.SmallIntegerField(blank=True, null=True)), ("transaction", models.CharField(choices=[("sale", "Продажба"), ("rent", "Изнајмување")], default="sale", max_length=10)), ("furnished", models.BooleanField(default=False)), ("featured", models.BooleanField(default=False)), ("phone", models.CharField(max_length=30)), ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)), ("category", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="listings", to="listings.category")), ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="listings", to="auth.user"))], options={"ordering": ["-featured", "-created_at"]}),
        migrations.CreateModel(name="ListingImage", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("image", models.ImageField(upload_to="listings/%Y/%m/")), ("listing", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="images", to="listings.listing"))]),
    ]

