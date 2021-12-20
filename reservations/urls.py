from django.urls import path
from reservations import views

urlpatterns = [
    path('bookings/', views.BookingList.as_view()),
    path('bookings/<int:pk>/', views.BookingDetail.as_view()),
    path('kits/', views.KitList.as_view()),
    path('kits/<int:pk>/', views.KitDetail.as_view()),
    path('laboratories/', views.LaboratoryList.as_view()),
    path('laboratories/<int:pk>/', views.LaboratoryDetail.as_view()),
]
