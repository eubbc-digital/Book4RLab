"""
Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
"""

from django.urls import path
from booking import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('bookings/', views.BookingList.as_view(), name='bookinglist'),
    path('bookings/<int:pk>/', views.BookingDetail.as_view(), name='bookingdetail'),
    path('public/', views.BookingPublicList.as_view(), name='bookingpublic'),
    path('reservation/', views.BookingAccess.as_view(), name='bookingreserve'),
    path('me/', views.BookingUserList.as_view(), name='bookinguser'),
    path('equipments/', views.EquipmentList.as_view(), name='equipmentlist'),
    path('equipments/<int:pk>/', views.EquipmentDetail.as_view(), name='equipmentdetail'),
    path('timeframes/', views.TimeFrameList.as_view(), name='timeframelist'),
    path('timeframes/<int:pk>/', views.TimeFrameDetail.as_view(), name='timeframedetail'),
    path('laboratories/', views.LaboratoryList.as_view(), name='laboratorylist'),
    path('public-laboratories/', views.PublicLaboratoryList.as_view(), name='publiclaboratorylist'),
    path('laboratories/<int:pk>/', views.LaboratoryDetail.as_view(), name='laboratorydetail'),
    path('laboratories/contents/', views.LaboratoryContentList.as_view(), name='lab-content-list-create'),
    path('laboratories/<int:laboratory_id>/contents/', views.LaboratoryContentRetrieve.as_view(), name='contents-for-laboratory'),
    path('laboratories/<int:laboratory_id>/delete-contents/', views.LaboratoryContentDeleteAll.as_view(), name='delete_all_contents'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
