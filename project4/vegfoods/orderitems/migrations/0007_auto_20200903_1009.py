# Generated by Django 3.0 on 2020-09-03 14:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orderitems', '0006_auto_20200902_1433'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='cartItems',
            new_name='orderItems',
        ),
        migrations.AlterField(
            model_name='coupon',
            name='createdDate',
            field=models.DateField(default=datetime.datetime(2020, 9, 3, 10, 9, 32, 478560)),
        ),
    ]
