from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse_lazy,reverse
import pgeocode
import math
nomi = pgeocode.Nominatim('in')



class StudentModel(models.Model):
    user = models.OneToOneField(User,related_name="user_profile",on_delete=models.CASCADE,null=True,blank=True)
    percentile = models.FloatField(default=0.00)
    address = models.TextField()
    pincode = models.IntegerField(default=0)

    # def __str__(self):
    #     return self.user.email


class CollegeModel(models.Model):
    name = models.CharField(max_length=50)
    address = models.TextField()
    cutoff = models.FloatField(default=0.00)
    pincode = models.IntegerField(default=0)
    distance = models.IntegerField(default=0)
    nirf = models.IntegerField(default=0)
    fee = models.IntegerField(default=0)
    hostel = models.BooleanField(default=False)
    website = models.TextField(default="")
    salary = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    def updateDistance(self,myPin):
        srcPinLoc = nomi.query_postal_code(str(myPin))
        srcLat = srcPinLoc.latitude
        srcLong = srcPinLoc.longitude

        destPinLoc = nomi.query_postal_code(str(self.pincode))
        destLat = destPinLoc.latitude
        destLong = destPinLoc.longitude


        R = 6373.0
        lat1 = math.radians(srcLat)
        lon1 = math.radians(srcLong)
        lat2 = math.radians(destLat)
        lon2 = math.radians(destLong)
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        self.distance = R * c






        # self.distance = 
        #calculate distance
        self.save()

class PdfModel(models.Model):
    pdf = models.FileField(null = True,blank=True,upload_to='pdfs')

    def __str__(self):
        return self.pdf.url

