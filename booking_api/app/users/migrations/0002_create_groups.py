from django.contrib.auth.models import Group
from django.db import migrations


def create_groups(apps, schema_editor):
    Group.objects.get_or_create(name="instructors")
    Group.objects.get_or_create(name="students")


class Migration(migrations.Migration):
    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.RunPython(create_groups),
    ]
