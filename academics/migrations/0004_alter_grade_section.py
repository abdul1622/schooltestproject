# Generated by Django 3.2.13 on 2022-09-29 10:25

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0003_grade_section'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grade',
            name='section',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=1), blank=True, default=list, null=True, size=None),
        ),
    ]
