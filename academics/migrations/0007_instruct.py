# Generated by Django 3.2.5 on 2022-08-08 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0006_auto_20220808_1228'),
    ]

    operations = [
        migrations.CreateModel(
            name='Instruct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('instruction', models.TextField()),
            ],
        ),
    ]
