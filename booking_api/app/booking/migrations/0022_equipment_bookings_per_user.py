# Generated by Django 4.1.5 on 2024-04-25 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0021_laboratory_allowed_emails'),
    ]

    operations = [
        migrations.AddField(
            model_name='equipment',
            name='bookings_per_user',
            field=models.IntegerField(default=3),
        ),
    ]