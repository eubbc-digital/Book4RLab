# Generated by Django 4.1.5 on 2023-07-28 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0015_alter_laboratory_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kit',
            name='description',
            field=models.CharField(default='', max_length=500),
        ),
    ]