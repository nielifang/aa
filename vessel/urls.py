from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('default_page/', views.default_page_iframe, name='default_page_iframe'),
    path('vessel/add_vessel_page/', views.add_vessel_page, name='add_vessel_page'),
    path('vessel/add_vessel/', views.add_vessel, name='add_vessel'),

]