# Generated by Django 3.2.13 on 2022-11-21 07:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_profile_standard'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'ordering': ('created_at',)},
        ),
    ]
