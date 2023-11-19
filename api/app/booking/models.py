"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
import uuid

class Booking(models.Model):

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    available = models.BooleanField(default=True)
    public = models.BooleanField(default=False)
    access_key = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    password = models.CharField(max_length=15, blank=True, null=True, default=None)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owner', on_delete=models.CASCADE)
    reserved_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reserved_by', on_delete=models.CASCADE, blank=True, null=True, default=None)
    equipment = models.ForeignKey('Equipment', related_name='equipment_reservations', on_delete=models.CASCADE)
    timeframe = models.ForeignKey('TimeFrame', related_name='tf_reservations', on_delete=models.CASCADE)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_date']

class Equipment(models.Model):

    name = models.CharField(max_length=255, blank=False, default='')
    description = models.CharField(max_length=500, default='')
    laboratory = models.ForeignKey('Laboratory', related_name='reservations', on_delete=models.CASCADE)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    enabled = models.BooleanField(default=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='equipment_owner', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.laboratory.name}) ({self.id})"

class Laboratory(models.Model):

    name = models.CharField(max_length=255, blank=False, default='')
    instructor = models.CharField(max_length=255, blank=False, default='')
    university = models.CharField(max_length=255, blank=False, default='')
    course = models.CharField(max_length=255, blank=False, default='')
    image = models.ImageField(upload_to='labs/', blank=True, null=True, default=None)
    description = models.CharField(max_length=1000, default='')
    url = models.CharField(max_length=255, blank=True, null=True, default='')
    registration_date = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    enabled = models.BooleanField(default=True)
    visible = models.BooleanField(default=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='laboratory_owner', on_delete=models.CASCADE)

    def is_timeframe_available_now(self):
        current_datetime = timezone.now()

        active_timeframes = TimeFrame.objects.filter(
            Q(equipment__in=self.reservations.all()) &
            (
                Q(start_date__lt=current_datetime) |
                (Q(start_date=current_datetime.date()) & Q(start_hour__lte=current_datetime.time()))
            ) &
            (
                Q(end_date__gt=current_datetime) |
                (Q(end_date=current_datetime.date()) & Q(end_hour__gte=current_datetime.time()))
            ) &
            Q(enabled=True)
        )

        return active_timeframes.exists()

    details_big_title = models.CharField(max_length=100, blank=True, null=True, default='')
    details_title_1= models.CharField(max_length=100, blank=True, null=True, default='')
    details_title_2= models.CharField(max_length=100, blank=True, null=True, default='')
    details_title_3= models.CharField(max_length=100, blank=True, null=True, default='')
    details_title_4= models.CharField(max_length=100, blank=True, null=True, default='')
    details_title_5= models.CharField(max_length=100, blank=True, null=True, default='')
    details_subtitle_1= models.CharField(max_length=100, blank=True, null=True, default='')
    details_subtitle_2= models.CharField(max_length=100, blank=True, null=True, default='')
    details_subtitle_3= models.CharField(max_length=100, blank=True, null=True, default='')
    details_subtitle_4= models.CharField(max_length=100, blank=True, null=True, default='')
    details_subtitle_5= models.CharField(max_length=100, blank=True, null=True, default='')
    details_text_1 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_2 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_3 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_4 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_5 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_6 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_7 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_8 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_9 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_text_10 = models.CharField(max_length=500, blank=True, null=True, default='')
    details_image_1 = models.ImageField(upload_to='detail_photos/', blank=True, null=True, default=None)
    details_image_2 = models.ImageField(upload_to='detail_photos/', blank=True, null=True, default=None)
    details_image_3 = models.ImageField(upload_to='detail_photos/', blank=True, null=True, default=None)
    details_image_4 = models.ImageField(upload_to='detail_photos/', blank=True, null=True, default=None)
    details_image_5 = models.ImageField(upload_to='detail_photos/', blank=True, null=True, default=None)
    details_video_1 = models.FileField(upload_to='detail_videos/', blank=True, null=True, default=None)
    details_video_2 = models.FileField(upload_to='detail_videos/', blank=True, null=True, default=None)
    details_video_3 = models.FileField(upload_to='detail_videos/', blank=True, null=True, default=None)
    details_video_4 = models.FileField(upload_to='detail_videos/', blank=True, null=True, default=None)
    details_video_5 = models.FileField(upload_to='detail_videos/', blank=True, null=True, default=None)
    details_link_1= models.URLField(blank=True, null=True, default=None)
    details_link_2= models.URLField(blank=True, null=True, default=None)
    details_link_3= models.URLField(blank=True, null=True, default=None)
    details_link_4= models.URLField(blank=True, null=True, default=None)
    details_link_5= models.URLField(blank=True, null=True, default=None)

    def __str__(self):
        return f"{self.name} (E={self.enabled}, V={self.visible}) ({self.id})"

class TimeFrame(models.Model):

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_hour = models.TimeField()
    end_hour = models.TimeField()
    slot_duration = models.IntegerField()
    equipment = models.ForeignKey('Equipment', related_name='timeframes', on_delete=models.CASCADE)
    enabled = models.BooleanField(default=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='timeframe_owner', on_delete=models.CASCADE)
