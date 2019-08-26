from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random
from django.http import JsonResponse
from django.apps import apps
from .models import *
from .methods import index_to_num, combined_bay_list,\
    create_engine_index, create_index_list, num_to_index,\
    bay_num_to_index_list, layer_con_list_to_db, \
    db_layer_info_to_list, get_bay_width, bay20_num_index_list
# Create your views here.


def index(request):
    if request.method == 'GET':
        return render(request, 'index.html')

def default_page_iframe(request):
    if request.method == 'GET':
        return render(request, 'defaultPage.html')

def add_vessel_page(request):
    if request.method == 'GET':

        return render(request, 'ves/add_vessel.html')



@csrf_exempt
def add_vessel(request):
    if request.method == 'POST':
        content = json.loads(request.body.decode('utf-8'))
        ves_name = content['ves_name']
        ves_length = float(content['ves_len'])
        ves_width = float(content['ves_wid'])

        ves_bay_20_num = int(content['bay_20_num'])
        ves_eng_pos = int(content['eng_pos'])
        ves_eng_wid = int(content['eng_wid'])
        ves_deck_max_lay = int(content['deck_max_lay'])
        ves_cab_max_lay = int(content['cab_max_lay'])
        ves_deck_max_col = int(content['deck_max_col'])
        ves_cab_max_col = int(content['cab_max_col'])

        # check if vessel_name exists
        try:
            obj = Ves_struct.objects.get(Vessel=ves_name)
        except Ves_struct.DoesNotExist:
            obj = None

        if obj is None:
            bay_index_list = bay_num_to_index_list(ves_bay_20_num)
            # add to DB
            Ves_struct.objects.create(Vessel=ves_name,
                                      VesLeng=ves_length,
                                      VesWidth=ves_width,
                                      TweBayNum=ves_bay_20_num,
                                      EngRomPos=ves_eng_pos,
                                      EngRomWid=ves_eng_wid,
                                     )
            # Ves_bay_lay_struct.objects.create( Vessel=ves_name,
            #                                    DeckHeg=ves_deck_max_lay,
            #                                    CabHeg=ves_cab_max_lay,
            #                                    DeckWidMax=ves_deck_max_col,
            #                                    CabWidMax=ves_cab_max_col)

            # for i in bay_index_list:
            #     con_pend_info.objects.create(Vessel=ves_name,
            #                                  BayNo=i['index'])
            #     ves_bay_struct.objects.create(Vessel=ves_name,
            #                                   BayNo=i['index'],
            #                                   BaySiz=i['size'])
            engine_list = create_engine_index(ves_eng_pos, ves_eng_wid)
            return JsonResponse(engine_list,safe=False)
        else:
            return JsonResponse({'WARNING': 'vessel_name is already exist'})