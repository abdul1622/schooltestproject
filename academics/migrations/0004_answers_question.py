# Generated by Django 3.2 on 2022-06-13 10:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0003_remove_chapter_grade'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade', models.IntegerField()),
                ('subject', models.CharField(max_length=30)),
                ('chapter', models.CharField(max_length=20)),
                ('Question', models.CharField(max_length=50)),
                ('question_type', models.CharField(choices=[('Match_the_following', 'Match_the_following'), ('MCQ', 'MCQ'), ('Fill_in_the_blanks', 'Fill_in_the_blanks')], default='0', max_length=20)),
                ('cognitive_level', models.CharField(choices=[('Medium', 'Medium'), ('Easy', 'Easy'), ('Hard', 'Hard')], default='0', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Answers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_a', models.CharField(max_length=50)),
                ('option_b', models.CharField(max_length=50)),
                ('option_c', models.CharField(max_length=50)),
                ('option_d', models.CharField(max_length=50)),
                ('answer', models.CharField(max_length=50)),
                ('question', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.question')),
            ],
        ),
    ]
