# Generated by Django 2.0.3 on 2020-06-25 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='toppings',
            name='pizza',
        ),
        migrations.AddField(
            model_name='pizza',
            name='selectedTopings',
            field=models.ManyToManyField(to='orders.Toppings'),
        ),
    ]
