from django.db import DatabaseError, models
from django.core.validators import MaxValueValidator
from django.contrib.postgres.fields import ArrayField
import re
# Create your models here.

class Grade(models.Model):
    grade = models.IntegerField(
        validators=[
            MaxValueValidator(12)
        ]
    )
    def __str__(self):
        return str(self.grade)



class Subject(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=15)
    grade = models.ForeignKey(Grade,on_delete=models.DO_NOTHING,null =True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.grade) + ' ' +self.name

    def save(self, *args, **kwargs):
        name = re.findall(r"[^\W\d_]+|\d+",self.name)
        self.name = (' '.join(name)).upper()
        self.code = (self.code).upper()
        super(Subject, self).save(*args, **kwargs)
        


class Chapter(models.Model):
    subject = models.ForeignKey(Subject,on_delete=models.DO_NOTHING,null =True)
    chapter_no = models.IntegerField()
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (str(self.subject))+' '+(self.name)


    def save(self, *args, **kwargs):
        name = re.findall(r"[^\W\d_]+|\d+",self.name)
        self.name = (' '.join(name)).lower()
        super(Chapter, self).save(*args, **kwargs)


questiontype_choice=(
('MCQ','MCQ'),
('Fill_in_the_blanks','Fill_in_the_blanks'),
('Match_the_following','Match_the_following')
)

cognitive_level=(
('Knowledge','Knowledge'),
('Comprehension','Comprehension'),
('Application','Application')
)

difficulty_level=(
('Easy','Easy'),
('Medium','Medium'),
('Hard','Hard')
)

class Question(models.Model):
    grade = models.ForeignKey(Grade,on_delete=models.DO_NOTHING,null =True)
    subject = models.ForeignKey(Subject,on_delete=models.DO_NOTHING,null =True)
    chapter = models.ForeignKey(Chapter,on_delete=models.DO_NOTHING,null =True)
    question = models.CharField(max_length=50)
    question_type = models.CharField(
    max_length=20,
    choices =questiontype_choice,
    default=questiontype_choice[0][0]
    )
    cognitive_level=models.CharField(
                    max_length=20,
                    choices =cognitive_level,
                    default=cognitive_level[0][0])
    difficulty_level=models.CharField(
                    max_length=20,
                    choices =difficulty_level,
                    default=difficulty_level[0][0])

    def __str__(self):
        return self.question


answer_choices=(
    ("option_a","option_a"),
    ("option_b","option_b"),
    ("option_c","option_c"),
    ("option_d","option_d"),
)
    
class Answers(models.Model):
    question=models.OneToOneField(Question,on_delete=models.CASCADE,null =True)
    option_a=models.CharField(max_length=50,null=True,blank=True)
    option_b=models.CharField(max_length=50,null=True,blank=True)
    option_c=models.CharField(max_length=50,null=True,blank=True)
    option_d=models.CharField(max_length=50,null=True,blank=True)

    answer=models.CharField(
                    max_length=50,
                    choices =answer_choices,
                    default=answer_choices[0][0])

    def __str__(self):
        return self.answer


class Question_Paper(models.Model):
    grade = models.ForeignKey(Grade,on_delete=models.DO_NOTHING,null =True)
    subject = models.ForeignKey(Subject,on_delete=models.DO_NOTHING,null =True)
    file = models.FileField(upload_to='question_files/',null=True,blank=True)
    created_by = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    no_of_questions = ArrayField(
        models.CharField(max_length=10,blank=True),
        blank=True,
        default= list
    )

    def __str__(self):
        return (str(self.grade))+' '+(str(self.subject))



