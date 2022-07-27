# Generated by Django 3.2.5 on 2022-06-16 10:39

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0018_question_paper_no_of_questions'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question_paper',
            name='no_of_questions',
        ),
        migrations.AddField(
            model_name='question_paper',
            name='no_of_questions',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=10), blank=True, default=['1', '2'], size=None),
        ),
    ]
