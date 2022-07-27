# Generated by Django 3.2.6 on 2022-06-13 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0005_auto_20220613_1734'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='difficulty_level',
            field=models.CharField(choices=[('Hard', 'Hard'), ('Easy', 'Easy'), ('Medium', 'Medium')], default='0', max_length=20),
        ),
        migrations.AlterField(
            model_name='question',
            name='cognitive_level',
            field=models.CharField(choices=[('Application', 'Application'), ('Knowledge', 'Knowledge'), ('Comprehension', 'Comprehension')], default='0', max_length=20),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(choices=[('MCQ', 'MCQ'), ('Fill_in_the_blanks', 'Fill_in_the_blanks'), ('Match_the_following', 'Match_the_following')], default='0', max_length=20),
        ),
    ]
