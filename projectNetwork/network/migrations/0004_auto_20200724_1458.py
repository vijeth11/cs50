# Generated by Django 3.0 on 2020-07-24 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_auto_20200722_1502'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='followers',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='following',
            field=models.IntegerField(default=0),
        ),
    ]
