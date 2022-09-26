# Generated by Django 3.2.13 on 2022-09-26 06:42

from django.conf import settings
import django.contrib.postgres.fields
import django.contrib.postgres.fields.hstore
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chapter_no', models.PositiveIntegerField(null=True, validators=[django.core.validators.MaxValueValidator(12)])),
                ('name', models.CharField(max_length=30)),
                ('description', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ('subject', 'chapter_no'),
            },
        ),
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade', models.PositiveIntegerField(null=True, validators=[django.core.validators.MaxValueValidator(12)])),
            ],
            options={
                'ordering': ('grade',),
            },
        ),
        migrations.CreateModel(
            name='InstructionForTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Question_Paper',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, null=True, upload_to='question_files/')),
                ('created_by', models.CharField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('test_id', models.CharField(blank=True, max_length=25, null=True)),
                ('no_of_questions', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=10), blank=True, default=list, size=None)),
                ('timing', models.IntegerField(default=0)),
                ('overall_marks', models.IntegerField(default=0)),
                ('grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.grade')),
            ],
            options={
                'ordering': ('grade', 'subject', '-created_at'),
            },
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('code', models.CharField(max_length=15)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.grade')),
            ],
            options={
                'ordering': ('grade', 'code', 'name'),
            },
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.PositiveIntegerField()),
                ('marks', models.PositiveIntegerField()),
                ('remarks', models.CharField(max_length=25)),
                ('description', models.CharField(max_length=50)),
                ('test_id', models.CharField(blank=True, max_length=25, null=True)),
                ('pass_percentage', models.PositiveIntegerField(default=35)),
                ('created_staff_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.grade')),
                ('question_paper', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.question_paper')),
                ('subject', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.subject')),
            ],
            options={
                'ordering': ('grade', 'subject', 'created_staff_id', 'question_paper'),
            },
        ),
        migrations.CreateModel(
            name='TestResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result', models.CharField(max_length=50)),
                ('score', models.PositiveIntegerField()),
                ('correct_answer', models.IntegerField(null=True)),
                ('wrong_answer', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('unanswered_questions', models.IntegerField(null=True)),
                ('test_detail', django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.hstore.HStoreField(), blank=True, default=list, null=True, size=None)),
                ('grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.grade')),
                ('question_paper', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='academics.question_paper')),
                ('student_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('subject', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.subject')),
                ('test_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='academics.test')),
            ],
        ),
        migrations.CreateModel(
            name='Questionbank',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_file', models.FileField(blank=True, null=True, upload_to='question_files/')),
                ('grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.grade')),
                ('subject', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='academics.subject')),
            ],
        ),
        migrations.AddField(
            model_name='question_paper',
            name='subject',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.subject'),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=50)),
                ('duration', models.PositiveIntegerField(default=30)),
                ('mark', models.PositiveIntegerField(default=1)),
                ('chapter_no', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('question_type', models.CharField(choices=[('MCQ', 'MCQ'), ('Fill_in_the_blanks', 'Fill_in_the_blanks'), ('Match_the_following', 'Match_the_following')], default='MCQ', max_length=20)),
                ('cognitive_level', models.CharField(choices=[('Knowledge', 'Knowledge'), ('Comprehension', 'Comprehension'), ('Application', 'Application')], default='Knowledge', max_length=20)),
                ('difficulty_level', models.CharField(choices=[('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')], default='Easy', max_length=20)),
                ('chapter', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.chapter')),
                ('grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.grade')),
                ('subject', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.subject')),
            ],
            options={
                'ordering': ('grade', 'subject', 'chapter', 'question_type', '-created_at'),
            },
        ),
        migrations.AddField(
            model_name='chapter',
            name='subject',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.subject'),
        ),
        migrations.CreateModel(
            name='Answers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_a', models.CharField(blank=True, max_length=50, null=True)),
                ('option_b', models.CharField(blank=True, max_length=50, null=True)),
                ('option_c', models.CharField(blank=True, max_length=50, null=True)),
                ('option_d', models.CharField(blank=True, max_length=50, null=True)),
                ('answer', models.CharField(choices=[('option_a', 'option_a'), ('option_b', 'option_b'), ('option_c', 'option_c'), ('option_d', 'option_d')], default='option_a', max_length=50)),
                ('question', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='academics.question')),
            ],
        ),
    ]
