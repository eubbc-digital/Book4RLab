from django.db import migrations, models

def set_availability_types(apps, schema_editor):
    Laboratory = apps.get_model('booking', 'Laboratory')
    # Set defaults based on laboratory type
    Laboratory.objects.filter(type='rt', availability_type__isnull=True).update(availability_type='bookable')
    Laboratory.objects.filter(type='uc', availability_type__isnull=True).update(availability_type='always')

class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0003_alter_laboratory_instructor'),
    ]

    operations = [
        migrations.AddField(
            model_name='laboratory',
            name='availability_type',
            field=models.CharField(
                choices=[
                    ('bookable', 'Available for Booking'),
                    ('development', 'Under Development'),
                    ('demand', 'Available on Demand'),
                    ('unavailable', 'Not Available'),
                    ('always', 'Always Available')
                ],
                max_length=20,
                null=True  # Allow null temporarily
            ),
        ),
        migrations.RunPython(set_availability_types),
        migrations.AlterField(
            model_name='laboratory',
            name='availability_type',
            field=models.CharField(
                choices=[
                    ('bookable', 'Available for Booking'),
                    ('development', 'Under Development'),
                    ('demand', 'Available on Demand'),
                    ('unavailable', 'Not Available'),
                    ('always', 'Always Available')
                ],
                max_length=20,
                null=False  # Remove null after setting values
            ),
        ),
    ]