# Generated by Django 3.0 on 2020-07-25 07:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_auto_20200725_0313'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='followers',
            field=models.CharField(default='', max_length=5000),
        ),
        migrations.AlterField(
            model_name='user',
            name='following',
            field=models.CharField(default='', max_length=5000),
        ),
        migrations.DeleteModel(
            name='Following',
        ),
    ]