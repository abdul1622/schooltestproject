# Generated by Django 3.2.5 on 2022-06-07 10:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chapter',
            name='grade',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='academics.grade'),
        ),
    ]
