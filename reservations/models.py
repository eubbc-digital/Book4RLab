from django.db import models

# Create your models here.
class Booking(models.Model):

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    available = models.BooleanField(default=True)
    access_url = models.CharField(max_length=255, default='')
    user = models.IntegerField()
    kit = models.ForeignKey('reservations.Kit', related_name='reservations', on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['start_date']


class Kit(models.Model):

    name = models.CharField(max_length=255, blank=False, default='')
    description = models.CharField(max_length=255, default='')
    laboratory = models.ForeignKey('reservations.Laboratory', related_name='reservations', on_delete=models.CASCADE)
    

class Laboratory(models.Model):

    name = models.CharField(max_length=255, blank=False, default='')
    description = models.CharField(max_length=255, default='')
    
