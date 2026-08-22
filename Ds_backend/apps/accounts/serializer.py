from rest_framework import serializers

from .models import User


class Userserializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name" , "last_name" , "username" , "is_active" , "email" , "is_verified" , "is_superuser" ,"password"]
        extra_kwargs = {'password':{'write_only':True} , 'is_verified':{'read_only':True} , 'is_superuser':{'read_only':True} , }
    def create(self, validated_data):
        user= User.objects.create_user(**validated_data)
        return user 