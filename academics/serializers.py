<<<<<<< HEAD
from dataclasses import field
from rest_framework import serializers
from .models import Grade,Subject,Chapter,Question,Answers
questiontype_choice={
('MCQ','MCQ'),
('Fill_in_the_blanks','Fill_in_the_blanks'),
('Match_the_following','Match_the_following')
}
cognitive_level={
('Knowledge','Knowledge'),
('Comprehension','Comprehension'),
('Application','Application')
}
difficulty_level={
('Easy','Easy'),
('Medium','Medium'),
('Hard','Hard')
}
=======
from operator import sub
from rest_framework import serializers
import re
from .models import Grade, Question_Paper,Subject,Chapter,Answers,Question,Test


>>>>>>> 61e4d3f985c9c8ac868ca25a1de9e0b31bb93907
class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'
<<<<<<< HEAD
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'
class ChapterViewSerializer(serializers.Serializer):
    grade = serializers.IntegerField()
    subject = serializers.CharField()
class Questionserializer(serializers.ModelSerializer):
    class Meta:
        model=Question
        fields=('grade','subject','chapter','question','question_type','difficulty_level','cognitive_level')
class AnswerSerializer(serializers.ModelSerializer):
    question=Questionserializer()
    class Meta:
        model=Answers
        fields=['question','option_a','option_b','option_c','option_d','answer']
    def create(self,validated_data):
        question=validated_data.pop('question')
        q=Question.objects.create(**question)
        Answers.objects.create(**validated_data)
        return q
class QuestionViewSerializer(serializers.Serializer):
    grade = serializers.IntegerField()
    subject = serializers.CharField()
    no_of_question=serializers.IntegerField()

=======


    def validate(self, data):
        if Grade.objects.filter(grade=data['grade']).exists():
            raise serializers.ValidationError({'error':'grade altready exists'})
        return data

class SubjectSerializer(serializers.ModelSerializer):
    grade_name = serializers.SerializerMethodField('get_grade_name')

    def get_grade_name(self, subject):
        grade = Grade.objects.get(id=(subject.grade.id))
        return grade.grade

    class Meta:
        model = Subject
        fields = ['id','grade','grade_name','name','code','created_at']

    def validate(self,data):
        name = data['name']
        name = re.findall(r"[^\W\d_]+|\d+",name)
        data['name'] = (' '.join(name)).upper()
        code = data['code']
        if  not (data['name'])[:3] in data['code']:
            code = (data['name'])[:3] + data['code']
            data['code'] = code
            print(data['code'],data['name'])
        queryset = Subject.objects.all()
        if self.instance:
            id = self.instance.id
            queryset = queryset.exclude(id=id)
        if queryset.filter(name = data['name'],grade=data['grade']).exists():
            raise serializers.ValidationError({'error':'subject name altready exists'})
        if queryset.filter(code=code).exists():
            raise serializers.ValidationError({'error':'subject code altready exists'})

        return data

class ChapterSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField('get_subject_name')

    def get_subject_name(self, chapter):
      subject = Subject.objects.get(id=(chapter.subject.id))
      return subject.name

    class Meta:
        model = Chapter
        fields = ['id','subject','subject_name','name','chapter_no','description','created_at']

    def validate(self, data):
        name = data['name']
        name = re.findall(r"[^\W\d_]+|\d+",name)
        data['name'] = (' '.join(name)).lower()
        queryset = Chapter.objects.all()
        if self.instance:
            id = self.instance.id
            queryset = queryset.exclude(id=id)

        if queryset.filter(name = data['name'],subject=data['subject']).exists():
            raise serializers.ValidationError({'error':'chapter name altready exists'})
        if queryset.filter(subject=data['subject'],chapter_no=data['chapter_no']).exists():
            raise serializers.ValidationError({'error':'cahpter no altready exists'})

        return data 


class ChapterViewSerializer(serializers.Serializer):
    grade = serializers.IntegerField()
    subject = serializers.CharField()

class Question_answer_serializer(serializers.Serializer):
    grade = serializers.StringRelatedField(many=True,source ="Grade")
    # subject = serializers.StringRelatedField(many=True,'')

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = ['option_a','option_b','option_c','option_d','answer']

class questionanswerserializer(serializers.ModelSerializer):
    subject = serializers.SlugRelatedField(slug_field='name', queryset=Subject.objects.all())
    grade = serializers.SlugRelatedField(
        slug_field='grade',
        queryset= Grade.objects.all())
    chapter = serializers.SlugRelatedField(
        slug_field= 'name',
        queryset= Chapter.objects.all())
    class Meta:
        model = Question
        fields = ['id','grade','subject','chapter']

class QuestionAnswerSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer()
    class Meta:
        model = Question
        fields = ['id','grade','subject','chapter','question',
                    'question_type','cognitive_level','difficulty_level','answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        question = Question.objects.create(**validated_data)
        Answers.objects.create(question=question, **answers_data)
        return question

    def update(self, instance, validated_data):
        answers_data = validated_data.pop('answers')
        answers = instance.answers
        instance.grade = validated_data.get('grade', instance.grade)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.chapter = validated_data.get('chapter', instance.chapter)
        instance.question = validated_data.get('question', instance.question)
        instance.question_type = validated_data.get('question_type', instance.question_type)
        instance.cognitive_level = validated_data.get('cognitive_level', instance.cognitive_level)
        instance.difficulty_level = validated_data.get('difficulty_level', instance.difficulty_level)
        instance.save()

        answers.answer = answers_data.get(
            'answer',
            answers.answer
        )
        answers.option_a = answers_data.get(
            'option_a',
            answers.option_a
        )
        answers.option_b = answers_data.get(
            'option_b',
            answers.option_b
        )

        answers.option_c = answers_data.get(
            'option_c',
            answers.option_c
        )
        answers.option_d = answers_data.get(
            'option_d',
            answers.option_d
        )
        answers.save()
        return instance

class QuestionGetSerializer(serializers.Serializer):
    grade = serializers.IntegerField()
    subject = serializers.CharField()
    number_of_questions = serializers.IntegerField()

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class QuestionPaperSerializer(serializers.ModelSerializer):
    grade_name = serializers.SerializerMethodField('get_grade_name')
    subject_name = serializers.SerializerMethodField('get_subject_name')
    def get_grade_name(self, subject):
      grade = Grade.objects.get(id=(subject.grade.id))
      return grade.grade

    def get_subject_name(self, chapter):
      subject = Subject.objects.get(id=(chapter.subject.id))
      return subject.name
    class Meta:
        model = Question_Paper
        fields = ['id','grade','grade_name','subject','subject_name','file','no_of_questions','created_by','created_at']


class TestSerializer(serializers.ModelSerializer):
    grade_name = serializers.SerializerMethodField('get_grade_name')
    subject_name = serializers.SerializerMethodField('get_subject_name')
    def get_grade_name(self, subject):
      grade = Grade.objects.get(id=(subject.grade.id))
      return grade.grade

    def get_subject_name(self, chapter):
      subject = Subject.objects.get(id=(chapter.subject.id))
      return subject.name
    class Meta:
        model = Test
        fields = ['id','grade','grade_name','subject','subject_name','question_paper','created_staff_id','duration','marks','remarks','description']
    
>>>>>>> 61e4d3f985c9c8ac868ca25a1de9e0b31bb93907
