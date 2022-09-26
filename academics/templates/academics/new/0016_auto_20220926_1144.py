# Generated by Django 3.2.13 on 2022-09-26 06:14

import django.contrib.postgres.fields
import django.contrib.postgres.fields.hstore
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0015_testresult_testdetails'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testresult',
            name='testdetails',
        ),
        migrations.AddField(
            model_name='testresult',
            name='test_detail',
            field=django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.hstore.HStoreField(), blank=True, default=list, null=True, size=None),
        ),
    ]
