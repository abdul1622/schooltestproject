# Generated by Django 3.2.5 on 2022-06-08 05:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0002_chapter_grade'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chapter',
            name='grade',
        ),
    ]
