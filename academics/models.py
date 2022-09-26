from datetime import datetime
import imp
from time import timezone
from unittest import result
from venv import create
from django.conf import settings
from django.db import DatabaseError, models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.postgres.fields import ArrayField,HStoreField
import re
import uuid
import jsonfield
from accounts.models import User
from django.forms import IntegerField
# Create your models here.

class Grade(models.Model):
    grade = models.PositiveIntegerField(
        null=True,
        validators=[
            MaxValueValidator(12)
        ]
    )
    def __str__(self):
        return str(self.grade)

    class Meta:
        ordering = ('grade',)


class Subject(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=15)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.grade) + ' ' + self.name

    def save(self, *args, **kwargs):
        name = re.findall(r"[^\W\d_]+|\d+", self.name)
        # self.created_at = (datetime.now()).strftime('%Y-%m-%d %H:%M')
        self.name = (' '.join(name)).upper()
        super(Subject, self).save(*args, **kwargs)

    class Meta:
        ordering = ('grade', 'code', 'name',)


class Chapter(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)
    chapter_no = models.PositiveIntegerField(
        null=True,
        validators=[
            MaxValueValidator(12)
        ])
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (str(self.subject))+' '+(self.name)

    def save(self, *args, **kwargs):
        # self.created_at = (datetime.now()).strftime('%Y-%m-%d %H:%M:%S')
        name = re.findall(r"[^\W\d_]+|\d+", self.name)
        self.name = (' '.join(name)).lower()
        super(Chapter, self).save(*args, **kwargs)

    class Meta:
        ordering = ('subject', 'chapter_no',)


questiontype_choice = (
    ('MCQ', 'MCQ'),
    ('Fill_in_the_blanks', 'Fill_in_the_blanks'),
    ('Match_the_following', 'Match_the_following')
)

cognitive_level = (
    ('Knowledge', 'Knowledge'),
    ('Comprehension', 'Comprehension'),
    ('Application', 'Application')
)

difficulty_level = (
    ('Easy', 'Easy'),
    ('Medium', 'Medium'),
    ('Hard', 'Hard')
)


class Question(models.Model):
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True)
    question = models.CharField(max_length=50)
    duration = models.PositiveIntegerField(default=30)
    mark = models.PositiveIntegerField(default=1)
    chapter_no = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    question_type = models.CharField(
        max_length=20,
        choices=questiontype_choice,
        default=questiontype_choice[0][0]
    )
    cognitive_level = models.CharField(
        max_length=20,
        choices=cognitive_level,
        default=cognitive_level[0][0])
    difficulty_level = models.CharField(
        max_length=20,
        choices=difficulty_level,
        default=difficulty_level[0][0])

    def __str__(self):
        return self.question

    # def cdate(self):
        # self.created_at =(self.created_at) .strftime('%Y-%m-%d %H:%M:%S')
        # self.created_at = (datetime.now()).strftime('%Y-%m-%d %H:%M:%S')
    def save(self, *args, **kwargs):
        chapter_id = self.chapter.id
        chapter = Chapter.objects.get(id=chapter_id)
        self.chapter_no = chapter.chapter_no
        super(Question, self).save(*args, **kwargs)

    class Meta:
        ordering = ('grade', 'subject', 'chapter',
                    'question_type', '-created_at')


answer_choices = (
    ("option_a", "option_a"),
    ("option_b", "option_b"),
    ("option_c", "option_c"),
    ("option_d", "option_d"),
)


class Answers(models.Model):
    question = models.OneToOneField(
        Question, on_delete=models.CASCADE, null=True)
    option_a = models.CharField(max_length=50, null=True, blank=True)
    option_b = models.CharField(max_length=50, null=True, blank=True)
    option_c = models.CharField(max_length=50, null=True, blank=True)
    option_d = models.CharField(max_length=50, null=True, blank=True)

    answer = models.CharField(
        max_length=50,
        choices=answer_choices,
        default=answer_choices[0][0])

    def __str__(self):
        return self.answer


class Question_Paper(models.Model):
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)
    file = models.FileField(upload_to='question_files/', null=True, blank=True)
    created_by = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    test_id = models.CharField(max_length=25, null=True, blank=True)
    no_of_questions = ArrayField(
        models.CharField(max_length=10, blank=True),
        blank=True,
        default=list
    )
    timing = models.IntegerField(default=0)
    overall_marks = models.IntegerField(default=0)

    def __str__(self):
        return (str(self.grade))+' '+(str(self.subject))
    def save(self, *args, **kwargs):
    #     self.created_at = (datetime.now()).strftime('%Y-%m-%d %H:%M:%S')
        if self.test_id:
            test = Test.objects.get(test_id=self.test_id)
            test.marks = self.overall_marks
            test.duration = self.timing
            test.save()
        super(Question_Paper, self).save(*args, **kwargs)
    class Meta:
        ordering = ('grade', 'subject', '-created_at',)


class Test(models.Model):
    question_paper = models.ForeignKey(
        Question_Paper, on_delete=models.SET_NULL, null=True)
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)
    duration = models.PositiveIntegerField()
    created_staff_id = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    marks = models.PositiveIntegerField()
    remarks = models.CharField(max_length=25)
    description = models.CharField(max_length=50)
    test_id = models.CharField(max_length=25, null=True, blank=True)
    pass_percentage = models.PositiveIntegerField(default=35)

    def __str__(self):
        return self.remarks

    def save(self, *args, **kwargs):
        if not self.test_id:
            self.test_id = (str(uuid.uuid4()))[:16]
        question_paper = self.question_paper
        if not self.duration:
            self.duration = question_paper.timing
        if not self.marks:
            self.marks = question_paper.overall_marks
        super(Test, self).save(*args, **kwargs)

    class Meta:
        ordering = ('grade', 'subject', 'created_staff_id', 'question_paper')



class TestResult(models.Model):
    student_id = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, null=True)
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)
    test_id = models.ForeignKey(Test, on_delete=models.DO_NOTHING, null=True)
    question_paper = models.ForeignKey(
        Question_Paper, on_delete=models.DO_NOTHING, null=True)
    result = models.CharField(max_length=50)
    score = models.PositiveIntegerField()
    correct_answer = models.IntegerField(null=True)
    wrong_answer = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    unanswered_questions = models.IntegerField(null=True)
    test_detail = jsonfield.JSONField()

    def __str__(self):
        return self.result


class InstructionForTest(models.Model):
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        return str(self.note[:10])


class Questionbank(models.Model):
    question_file = models.FileField(
        upload_to='question_files/', null=True, blank=True)
    # answer_file=models.FileField(upload_to='answer_files/',null=True,blank=True)
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.question_file)
