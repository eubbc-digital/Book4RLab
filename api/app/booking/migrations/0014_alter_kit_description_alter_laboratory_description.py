# Generated by Django 4.1.5 on 2023-06-01 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0013_merge_20230503_1510'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kit',
            name='description',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='laboratory',
            name='description',
            field=models.CharField(default='', max_length=1000),
        ),
    ]
