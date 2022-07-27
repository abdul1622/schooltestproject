# Generated by Django 3.2.5 on 2022-07-13 08:09

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0021_alter_question_paper_no_of_questions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chapter',
            name='chapter_no',
            field=models.PositiveIntegerField(null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(12)]),
        ),
        migrations.AlterField(
            model_name='grade',
            name='grade',
            field=models.PositiveIntegerField(null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(12)]),
        ),
    ]
