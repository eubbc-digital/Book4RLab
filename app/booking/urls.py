from django.urls import path
from booking import views

app_name = "booking"

urlpatterns = [
    path('', views.BookingList.as_view(), name='bookinglist'),
    path('<int:pk>/', views.BookingDetail.as_view(), name='bookingdetail'),
    path('me/', views.BookingUserList.as_view(), name='bookinguser'),
    path('kits/', views.KitList.as_view(), name='kitlist'),
    path('kits/<int:pk>/', views.KitDetail.as_view(), name='kitdetail'),
    path('laboratories/', views.LaboratoryList.as_view(), name='laboratorylist'),
    path('laboratories/<int:pk>/', views.LaboratoryDetail.as_view(), name='laboratorydetail'),
]
