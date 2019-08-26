from django.db import models

# Create your models here.

class berth_info(models.Model):
    BerthNo = models.CharField(max_length=2,unique=True,null=False,verbose_name="泊位编号")
    Length = models.IntegerField(max_length=4,null=False,verbose_name="泊位长度")
    Draught = models.IntegerField(max_length=4,null=False,verbose_name="吃水")

