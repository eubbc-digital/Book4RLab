from django.db import migrations, models

def set_default_availability_types(apps, schema_editor):
    Laboratory = apps.get_model('booking', 'Laboratory')
    # First update RT labs
    Laboratory.objects.filter(type='rt').update(availability_type='bookable')
    # Then update UC labs
    Laboratory.objects.filter(type='uc').update(availability_type='always')

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
                default=models.Case(
                    models.When(type='rt', then=models.Value('bookable')),
                    models.When(type='uc', then=models.Value('always')),
                    default=models.Value('development'),
                )
            ),
        ),
        migrations.RunPython(
            set_default_availability_types,
            migrations.RunPython.noop
        ),
    ]