# Generated by Django 3.2.13 on 2022-09-01 06:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0013_questionbank'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionbank',
            name='answer_file',
        ),
    ]
