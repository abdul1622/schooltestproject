# Generated by Django 3.2.5 on 2022-08-09 04:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0006_auto_20220808_1954'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='test_id',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='testresult',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
