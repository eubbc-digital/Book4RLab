from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("users", "0002_create_groups")]

    operations = [
        migrations.AddField(
            model_name="user",
            name="keycloak_sub",
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
