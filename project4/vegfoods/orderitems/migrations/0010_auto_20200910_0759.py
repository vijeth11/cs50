# Generated by Django 3.0 on 2020-09-10 11:59

import datetime
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orderitems', '0009_auto_20200909_1446'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='wishlist',
            new_name='userwishlist',
        ),
        migrations.AlterField(
            model_name='coupon',
            name='createdDate',
            field=models.DateField(default=datetime.datetime(2020, 9, 10, 7, 59, 40, 823505)),
        ),
    ]
