from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from listings.models import Category, Listing, ListingImage

class Command(BaseCommand):
    help = "Креира демо податоци"
    def handle(self, *args, **kwargs):
        admin, created = User.objects.get_or_create(username="admin", defaults={"email": "admin@dom.mk", "is_staff": True, "is_superuser": True})
        if created: admin.set_password("admin123"); admin.save()
        demo, created = User.objects.get_or_create(username="demo", defaults={"email": "demo@dom.mk"})
        if created: demo.set_password("demo1234"); demo.save()
        cats = {}
        for name, slug, icon in [("Стан", "stan", "🏢"), ("Куќа", "kukja", "🏠"), ("Вила", "vila", "🌿"), ("Соба", "soba", "🛏️")]:
            cats[slug], _ = Category.objects.get_or_create(slug=slug, defaults={"name": name, "icon": icon})
        if not Listing.objects.exists():
            data = [
                ("Модерен стан во Центар", "Светол, комплетно реновиран стан со отворен дневен простор, тераса и поглед кон Водно.", "Скопје", "Дебар Маало", 142000, 82, 3, "stan", "sale", True),
                ("Семејна куќа со двор", "Пространа куќа на мирна локација, уреден двор, паркинг и подрум.", "Скопје", "Бардовци", 265000, 210, 5, "kukja", "sale", False),
                ("Вила покрај езеро", "Современа вила со прекрасен поглед, приватна градина и голема тераса.", "Охрид", "Лагадин", 310000, 180, 4, "vila", "sale", True),
                ("Наместен стан за изнајмување", "Удобен стан близу факултетите, целосно опремен и веднаш вселив.", "Скопје", "Карпош 2", 480, 58, 2, "stan", "rent", True),
                ("Соба во центарот на градот", "Чиста и функционална соба со заедничка кујна, интернет и вклучени сметки.", "Битола", "Широк Сокак", 180, 22, 1, "soba", "rent", True),
                ("Пентхаус со панорамски поглед", "Ексклузивен пентхаус со две тераси, лифт и приватно паркинг место.", "Скопје", "Водно", 295000, 156, 4, "stan", "sale", True),
            ]
            for i, (title, desc, city, address, price, area, rooms, cat, trans, furnished) in enumerate(data):
                obj = Listing.objects.create(owner=demo, category=cats[cat], title=title, description=desc, city=city, address=address, price=price, area=area, rooms=rooms, bathrooms=2 if rooms > 3 else 1, floor=3 if cat == "stan" else None, transaction=trans, furnished=furnished, featured=i < 3, phone="070 123 456")
                for n in range(1, 4): ListingImage.objects.create(listing=obj, image=f"demo/home-{(i+n-1)%6+1}.svg")
        self.stdout.write(self.style.SUCCESS("Демо податоците се подготвени."))

