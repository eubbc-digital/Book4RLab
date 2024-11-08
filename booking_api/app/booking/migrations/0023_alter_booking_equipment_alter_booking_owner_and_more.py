# Generated by Django 4.1.5 on 2024-06-14 18:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('booking', '0022_equipment_bookings_per_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='equipment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment_bookings', to='booking.equipment'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner_bookings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='booking',
            name='reserved_by',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reserved_by_bookings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='booking',
            name='timeframe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='timeframe_bookings', to='booking.timeframe'),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='laboratory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='laboratory_equipments', to='booking.laboratory'),
        ),
        migrations.AlterField(
            model_name='equipment',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner_equipments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='laboratory',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner_laboratories', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='laboratorycontent',
            name='laboratory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='laboratory_contents', to='booking.laboratory'),
        ),
        migrations.AlterField(
            model_name='timeframe',
            name='equipment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment_timeframes', to='booking.equipment'),
        ),
        migrations.AlterField(
            model_name='timeframe',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner_timeframes', to=settings.AUTH_USER_MODEL),
        ),
    ]